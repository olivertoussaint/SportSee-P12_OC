const dayToDate = (date) => {
      const d = new Date(date);
      let day = d.getDate();
      console.log(day)
      return day;
    };
    
    /**
     * A function that formats data to display activity chart
     * @param {Array<Object>} sessions - activity data to be formatted
     * @returns {Array<Object>} formatted data for activity chart
     */
    
    const activityFormat = (sessions) => {
      return sessions.map(({ day, kilogram, calories }) => ({
        day: dayToDate(day),
        kilogram,
        calories,
      }));
    };
    
    export default activityFormat;