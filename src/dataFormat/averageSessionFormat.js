const days = ['L', 'Ma', 'Me', 'J', 'V', 'S', 'D'];

const averageSessionFormat = (data) => {
  // Vérifie si les données sont déjà un tableau ou si elles doivent être extraites
  const sessions = Array.isArray(data) ? data : data.sessions;

  if (!Array.isArray(sessions)) {
    console.error("Expected 'sessions' to be an array, received:", sessions);
    return [];
  }

  return sessions.map(session => ({
    day: days[session.day - 1], 
    sessionLength: session.sessionLength,
  }));
};


export default averageSessionFormat;