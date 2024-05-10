function scoreFormat(data) {
    const score = data.score;
    const todayScore = data.todayScore;


  return score || todayScore;
  
}

export default scoreFormat
