import React from 'react'
import styles from './Main.module.css'

import NutritionCard from '../Components/NutritionCard/NutritionCard'
import Greetings from '../Components/Greetings/Greetings'
import Activity from '../Components/Graphs/Activity/Activity'
import useFetch from '../hooks/useFetch'
import DataSource from '../Components/DataSource/DataSource'

import { ReactComponent as FireIcon } from '../../src/assets/nutrition-icons/fire-icon.svg'
import { ReactComponent as AppleIcon } from '../../src/assets/nutrition-icons/apple-icon.svg'
import { ReactComponent as ChickenIcon } from '../../src/assets/nutrition-icons/chicken-icon.svg'
import { ReactComponent as CheeseburgerIcon } from '../../src/assets/nutrition-icons/cheeseburger-icon.svg'
// import AverageSession from '../Components/Graphs/AverageSession/AverageSession'
import Test from '../Components/Graphs/Test/Test'

function Main() {
  const { data, loading, dataSource, error } = useFetch()
  if ((loading || !data) && !error) {
    return <div>loading...</div>
  }
  return (
    <div className={styles.container}>
      <DataSource source={dataSource} />
      <Greetings name={data.nameDisplay} />
      <div className={styles.mainWrap}>
        <div className={styles.chartContainer}>
          <div className={styles.activityChartWrap}>
            <Activity data={data.activitySection} />
          </div>
          <div className={styles.bottomCharts}>
            <Test />
          </div>
        </div>
        <div className={styles.cardWrap}>
          <NutritionCard value={data.calories} nutrition="Calories">
            <FireIcon />
          </NutritionCard>
          <NutritionCard value={data.protein} nutrition="Proteines">
            <ChickenIcon />
          </NutritionCard>
          <NutritionCard value={data.carbo} nutrition="Glucides">
            <AppleIcon />
          </NutritionCard>
          <NutritionCard value={data.lipid} nutrition="Lipides">
            <CheeseburgerIcon />
          </NutritionCard>
        </div>
      </div>
    </div>
  )
}

export default Main
