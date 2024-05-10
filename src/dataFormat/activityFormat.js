const dayToDate = (date) => {
      const d = new Date(date);
      let day = d.getDate();
      return day;
    };
    
    
    const activityFormat = (sessions) => {
      return sessions.map(({ day, kilogram, calories }) => ({
        day: dayToDate(day),
        kilogram,
        calories,
      }));
    };
    
    export default activityFormat;