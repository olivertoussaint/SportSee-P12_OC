import React from 'react'
import imageSvg from '../../assets/images/sportsee-logo.svg'
import styles from './Error.module.css'
import { NavLink } from 'react-router-dom'

function error() {
  return (
    <div className={styles.container}>
      <main className={styles.wrapper}>
        <section className={styles.display}>
          <h1 className={styles.error}>
            <span>404</span>
          </h1>
          <div className={styles.logo}>
            <img src={imageSvg} alt="logo" />
          </div>
          <p className={styles.textError}>
            Oups! La page que vous demandez n'existe pas.
          </p>
          <NavLink to="/" className={styles.backToHome}>
            Retourner sur la page d'accueil
          </NavLink>
        </section>
      </main>
    </div>
  )
}

export default error
