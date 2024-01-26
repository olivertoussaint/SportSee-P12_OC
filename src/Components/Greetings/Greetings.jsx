import React from 'react'
import PropTypes from 'prop-types'
import styles from './Greetings.module.css'

/**
 * A component that displays a greeting message and user's name
 * @param {Object} props - The props object containing user's name
 * @param {string} props.name - The user's name to be displayed
 * @returns {JSX.Element} - A react component that displays a greeting message and user's name
 */

function Greetings(props) {
      const { name } = props;
  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
            <span className={styles.greetings}>Bonjour</span>
            <span className={styles.name}>{name}</span>
      </div>
      <span className={styles.congrats}>Félicitation ! Vous avez explosé vos objectifs hier 👏 </span>
    </div>
  )
}
Greetings.propTypes = {
      name: PropTypes.string.isRequired
}

export default Greetings