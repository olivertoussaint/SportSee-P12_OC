import styles from './Dashboard.module.css'
import React from 'react'
import Header from '../../Header/Header'
import Sidebar from '../../SideBar/SideBar'
import Main from '../../Main/Main'

function dashboard() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className={styles.main}>
        <Sidebar />
        <Main />
      </main>
    </>
  )
}

export default dashboard
