import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'
import logo from '../../assets/images/sportsee-logo.svg'
import AvatarOne from '../../assets/images/3d00864-removebg-preview.png'
import AvatarTwo from '../../assets/images/3d00870-removebg-preview.png'

const users = [
  { id: 12, firstName: 'Karl', picture: AvatarOne },
  { id: 18, firstName: 'Cecilia', picture: AvatarTwo },
]

function Home() {
  const [check, setChecked] = useState(true)

  const searchParam = `?api=${check}`

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" className={styles.img} id={styles.effect} />
      </div>
      <div className={styles.mainWrap}>
        <div className={styles.title}>
          <h2>Choisir un utilisateur pour se connecter au dashboard</h2>
        </div>
        <br />
        <div className={styles.optionWrap}>
          <div className={styles.checkBoxWrap}>
            <div className={styles.questionWrap}>
              <span className={styles.checkQuestion}>
                Vous voulez utilisez API ?
              </span>
              <br />
              <br />
              <span className={styles.secondQuestion}>
                Décochez si vous voulez utiliser Mock API
              </span>
              <br />
            </div>
            <br />
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="apiBtn"
                name="dataType"
                className={styles.checkBox}
                onChange={(e) => setChecked(e.target.checked)}
                checked={check}
              />
            </div>
            <div className={styles.buttonContainer}>
              <br />
              <hr />
              <br />
              <div className={styles.userWrapp}>
                {users.map((user, index) => (
                  <div key={user.id}>
                    <span>
                      <img
                        src={user.picture}
                        alt="avatar"
                        className={styles.avatar}
                      />
                    </span>
                    <NavLink to={`user/${user.id}${searchParam}`} key={user.id}>
                      <button className={styles.btn}>{user.firstName}</button>
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
