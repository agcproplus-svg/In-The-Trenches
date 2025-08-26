/*
 CPU heuristics for In the Trenches
 Provides selectOffense and selectDefense and small modifiers
*/
export default {
  selectOffense({down, distance, ball, quarter, score}){
    // Basic situational logic
    if(down===4 && distance>8) return 'Punt';
    if(down===4 && distance<=3 && ball>20 && ball<80) return 'Field Goal';
    if(distance>=15) return 'Deep Pass';
    if(distance<=3) return Math.random()>0.4 ? 'Run' : 'Quick Pass';
    if(score.home - score.away > 8 && quarter>=4) return 'Run';
    return Math.random()>0.6 ? 'Pass' : 'Run';
  },
  selectDefense({down, distance, ball, quarter, score}){
    if(distance>=15) return 'Prevent';
    if(down<=2 && Math.random()>0.7) return 'Blitz';
    if(quarter>=4 && Math.abs(score.home - score.away) < 8) return 'Blitz';
    return ['Base','Man'][Math.floor(Math.random()*2)];
  },
  defenseModifier(play){
    if(play==='Blitz') return 6;
    if(play==='Prevent') return -5;
    return 0;
  }
};
