import React from 'react'
import { ReactComponent as Meditation } from '../../src/assets/sideBarMenu-icons/meditation-icon.svg'
import { ReactComponent as Swimming } from '../../src/assets/sideBarMenu-icons/swimming-icon.svg'
import { ReactComponent as Bike } from '../../src/assets/sideBarMenu-icons/bike-icon.svg'
import { ReactComponent as Weight } from '../../src/assets/sideBarMenu-icons/weight-icon.svg'
import styles from './SideBar.module.css'

function Sidebar() {
  return (
    <div className={styles.sideBarContainer}>
      <div className={styles.iconContainer}>
        <Meditation className={styles.icon} />
        <Swimming className={styles.icon} />
        <Bike className={styles.icon} />
        <Weight className={styles.icon} />
      </div>
      <div className={styles.copyright}>
        <span>Copyright, SportSee 2020</span>
      </div>
    </div>
  )
}

export default Sidebar
