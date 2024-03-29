import activityFormat from './activityFormat'
import averageSessionFormat from './averageSessionFormat';



const globalFormat = ({ 
  activitySessions,
   user,
   averageSessions
   }) => {
  const activitySection = activityFormat(activitySessions)
  const averageSection = averageSessionFormat(averageSessions)
  const nameDisplay = user.userInfos.firstName
  const nutricard = user.keyData
  const calories = `${nutricard.calorieCount}Kcal`
  const protein = `${nutricard.proteinCount}g`
  const carbo = `${nutricard.carbohydrateCount}g`
  const lipid = `${nutricard.lipidCount}g`

  return {
    activitySection,
    averageSection,
    nameDisplay,
    calories,
    protein,
    carbo,
    lipid,
  }
}

export default globalFormat
