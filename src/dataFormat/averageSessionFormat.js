const days = ['L', 'Ma', 'Me', 'J', 'V', 'S', 'D'];

const averageSessionFormat = (sessions) => {
  if (typeof sessions !== 'object' || !Array.isArray(sessions.sessions)) {
    console.error("sessions n'est pas un objet avec une propriété sessions qui est un tableau :", sessions);
    return [];
  }

  return sessions.sessions.map(({ day, sessionLength }) => ({
    day: days[day - 1],
    sessionLength,
  }));
}

export default averageSessionFormat;