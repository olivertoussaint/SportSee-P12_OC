import activityFormat from './activityFormat'



const globalFormat = ({ activitySessions, user }) => {
  const activitySection = activityFormat(activitySessions)
  const nameDisplay = user.userInfos.firstName
  const nutricard = user.keyData
  const calories = `${nutricard.calorieCount}Kcal`
  const protein = `${nutricard.proteinCount}g`
  const carbo = `${nutricard.carbohydrateCount}g`
  const lipid = `${nutricard.lipidCount}g`

  return {
    activitySection,
    nameDisplay,
    calories,
    protein,
    carbo,
    lipid,
  }
}

export default globalFormat
