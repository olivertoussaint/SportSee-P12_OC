import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'
import logo from '../../assets/images/sportsee-logo.svg'
import { useState } from 'react'

const users = [
  { id: 12, userName: 'User 12' },
  { id: 18, userName: 'User 18' },
]

/**
 * A React component that renders home page
 * @returns {JSX.Element} - A JSX element of combined components to display home page
 */

export default function Home() {
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
            <input
              type="checkbox"
              id="apiBtn"
              name="dataType"
              className={styles.checkBox}
              onChange={(e) => setChecked(e.target.checked)}
              checked={check}
            />
            <label htmlFor="apiBtn">Oui</label>
            <div className={styles.buttonContainer}>
              <br />
              <hr />
              <br />
              <div>
                {users.map((user) => (
                  <NavLink to={`user/${user.id}${searchParam}`} key={user.id}>
                    <button key={user.id} className={styles.btn}>
                      {user.userName}
                    </button>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
