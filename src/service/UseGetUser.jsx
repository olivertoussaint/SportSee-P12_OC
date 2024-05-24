import axios from 'axios'

const USER_URL = 'http://localhost:3000/user/'

const getUserInfo = async (id) => {
  const user = await axios.get(`${USER_URL}${id}`)
  const activity = await axios.get(`${USER_URL}${id}/activity`)
  const averageSessions = await axios.get(`${USER_URL}${id}/average-sessions`)
  const performance = await axios.get(`${USER_URL}${id}/performance`)

  return { user, activity, averageSessions, performance }
}

export default getUserInfo
