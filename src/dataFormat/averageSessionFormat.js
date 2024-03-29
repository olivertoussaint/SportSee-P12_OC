const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const averageSessionFormat = (sessionsObj) => {
      const sessions = sessionsObj.sessions;
      console.log(sessionsObj)
      return sessions.map(({ day, sessionLength }) => ({
        day: days[day -1],
        sessionLength,
      }))
    }

export default averageSessionFormat