import { NavLink } from 'react-router-dom'
import React from 'react'
import { ReactComponent as Logo } from '../../src/assets/images/sportsee-logo.svg'
import styles from './Header.module.css'


function Header() {
  return (
    <div className={styles.container}>
    <div className="logoContainer">
      
        <Logo width={178} className={styles.logo} />
      
    </div>
    <nav className={styles.nav}>
      <ul>
      <NavLink to={'/'}>
        <li>Accueil</li>
        </NavLink>
        <li>Profil</li>
        <li>Réglage</li>
        <li>Communauté</li>
      </ul>
    </nav>
  </div>
      
 
  )
}

export default Header
