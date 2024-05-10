import React from 'react'
import styles from './NutritionCards.module.css'
import PropTypes from 'prop-types'

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
