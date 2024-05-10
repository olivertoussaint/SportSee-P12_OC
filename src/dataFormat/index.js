import activityFormat from './activityFormat';
import averageSessionFormat from './averageSessionFormat';
import performanceFormat from './performanceFormat';
import scoreFormat from './scoreFormat';



const globalFormat = ({ 
  user,
  activitySessions,
  performances,
   averageSessions
   }) => {
  const activitySection = activityFormat(activitySessions)
  const averageSection = averageSessionFormat(averageSessions)
  const performanceSection = performanceFormat(performances)
  const nameDisplay = user.userInfos.firstName
  const nutricard = user.keyData
  const scoreSection = scoreFormat(user)

  const calories = `${nutricard.calorieCount}Kcal`
  const protein = `${nutricard.proteinCount}g`
  const carbo = `${nutricard.carbohydrateCount}g`
  const lipid = `${nutricard.lipidCount}g`

  return {
    nameDisplay,
    activitySection,
    averageSection,
    performanceSection,
    scoreSection,
    calories,
    protein,
    carbo,
    lipid,
  }
}

export default globalFormat
