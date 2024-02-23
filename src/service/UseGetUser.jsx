// common part of breakpoint
const USER_URL = 'http://localhost:3000/user/'

/**
 * Retrieves user information by making multiple API requests
 * @param {Array<Object>} id - The ID of the user to retrieve information for
 * @returns {Promise<{user: object, activity: object, averageSessions: object, performance: object}>} - A promise that resolves to an object containing user information
 */

const getUserInfo = async (id) => {
  try {
    const userPromise = fetch(`${USER_URL}${id}`)
    .then((response) => response.json())

    const activityPromise = fetch(`${USER_URL}${id}/activity`)
    .then((response) => response.json())

    const averageSessionsPromise = fetch(`${USER_URL}${id}/average-sessions`)
    .then((response) => response.json())

    const performancePromise = fetch(`${USER_URL}${id}/performance`)
    .then((response) => response.json())

    const [user, activity, averageSessions, performance] = await Promise.all([
      userPromise,
      activityPromise,
      averageSessionsPromise,
      performancePromise,
    ])

    return { user, activity, averageSessions, performance }
    
  } catch (error) {
    throw new Error('Failed to fetch user information')
  }
}

export default getUserInfo
