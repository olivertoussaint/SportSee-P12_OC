const USER_URL = 'http://localhost:3000/user/'

const getUserInfo = async (id) => {
  try {
    console.log(`Fetching user information for ID: ${id}`);
    
    const userPromise = fetch(`${USER_URL}${id}`)
      .then((response) => {
        console.log(`Response for user data:`, response);
        return response.json();
      });

    const activityPromise = fetch(`${USER_URL}${id}/activity`)
      .then((response) => {
        console.log(`Response for activity data:`, response);
        return response.json();
      });

    const averageSessionsPromise = fetch(`${USER_URL}${id}/average-sessions`)
      .then((response) => {
        console.log(`Response for average sessions data:`, response);
        return response.json();
      });

    const performancePromise = fetch(`${USER_URL}${id}/performance`)
      .then((response) => {
        console.log(`Response for performance data:`, response);
        return response.json();
      });

    const [user, activity, averageSessions, performance] = await Promise.all([
      userPromise,
      activityPromise,
      averageSessionsPromise,
      performancePromise,
    ]);

    console.log('All data fetched successfully:', { user, activity, averageSessions, performance });

    return { user, activity, averageSessions, performance };
    
  } catch (error) {
    console.error('Failed to fetch user information:', error);
    throw new Error('Failed to fetch user information');
  }
}

export default getUserInfo;
