import React from 'react'
import styles from './NutritionCards.module.css'
import PropTypes from 'prop-types'

/**
 * Component to display nutrition card
 *
 * @property {Object} children - SVG elements to display icon
 * @property {string} value - The nutrition value to be displayed in the card
 * @property {string} nutrition - The type of nutrition to be displayed in the card
 * @returns {React.ReactElement} Nutrition card
 */

function NutritionCard(props) {
  return (
    <div className={styles.cardWrap}>
      <div className={styles.iconWrap}>{props.children}</div>
      <div className={styles.nutritionInfo}>
        <span className={styles.nutriValue}>{props.value}</span>
        <span className={styles.nutrition}>{props.nutrition}</span>
      </div>
    </div>
  )
}

NutritionCard.propTypes = {
      children: PropTypes.object.isRequired,
      value: PropTypes.string.isRequired,
      nutrition: PropTypes.string.isRequired
}

export default NutritionCard
