import React from 'react'
import styles from './Main.module.css'

import NutritionCard from '../Components/NutritionCard/NutritionCard'
import Greetings from '../Components/Greetings/Greetings'

import { ReactComponent as FireIcon } from '../../src/assets/nutrition-icons/fire-icon.svg'
import { ReactComponent as AppleIcon } from '../../src/assets/nutrition-icons/apple-icon.svg'
import { ReactComponent as ChickenIcon } from '../../src/assets/nutrition-icons/chicken-icon.svg'
import { ReactComponent as CheeseburgerIcon } from '../../src/assets/nutrition-icons/cheeseburger-icon.svg'

function Main() {
  return (
    <div className={styles.container}>
      <Greetings />
      <div className={styles.mainWrap}>
        <div className={styles.chartContainer}>
          <div className={styles.activityChartWrap}></div>
          <div className={styles.bottomCharts}></div>
        </div>
        <div className={styles.cardWrap}>
          <NutritionCard>
            <FireIcon />
          </NutritionCard>
          <NutritionCard>
            <ChickenIcon />
          </NutritionCard>
          <NutritionCard>
            <AppleIcon />
          </NutritionCard>
          <NutritionCard>
            <CheeseburgerIcon />
          </NutritionCard>
        </div>
      </div>
    </div>
  )
}

export default Main
