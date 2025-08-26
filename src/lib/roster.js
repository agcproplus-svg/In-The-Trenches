import sampleCards from '../data/player_cards.json';

function idGen(team, pos, idx){ return `${team}-${pos}-${idx+1}`; }

function pickCardForPos(pos){
  const map = {
    'QB': sampleCards.QB,
    'RB': sampleCards.RB,
    'WR': sampleCards.WR,
    'TE': sampleCards.TE
  };
  return map[pos] || sampleCards.DEF;
}

function weightedPickFactory(card){
  return {
    card,
    weightedPick: function(){
      const total = this.card.reduce((s,c)=>s+c.weight,0);
      let r = Math.random()*total;
      for(const c of this.card){
        r -= c.weight;
        if(r<=0) return c;
      }
      return this.card[this.card.length-1];
    }
  };
}

export default function generateRoster(teamCode, cards){
  const roster = [];
  // offense
  roster.push({ id:idGen(teamCode,'QB',0), name:'QB 1', pos:'QB', card: weightedPickFactory(pickCardForPos('QB')) });
  for(let i=0;i<2;i++) roster.push({ id:idGen(teamCode,'RB',i), name:`RB ${i+1}`, pos:'RB', card: weightedPickFactory(pickCardForPos('RB')) });
  for(let i=0;i<3;i++) roster.push({ id:idGen(teamCode,'WR',i), name:`WR ${i+1}`, pos:'WR', card: weightedPickFactory(pickCardForPos('WR')) });
  roster.push({ id:idGen(teamCode,'TE',0), name:'TE 1', pos:'TE', card: weightedPickFactory(pickCardForPos('TE')) });
  roster.push({ id:idGen(teamCode,'K',0), name:'K 1', pos:'K', card: weightedPickFactory(pickCardForPos('RB')) });
  roster.push({ id:idGen(teamCode,'P',0), name:'P 1', pos:'P', card: weightedPickFactory(pickCardForPos('RB')) });
  // defense
  for(let i=0;i<2;i++) roster.push({ id:idGen(teamCode,'DT',i), name:`DT ${i+1}`, pos:'DT', card: weightedPickFactory(pickCardForPos('DEF')) });
  for(let i=0;i<2;i++) roster.push({ id:idGen(teamCode,'DE',i), name:`DE ${i+1}`, pos:'DE', card: weightedPickFactory(pickCardForPos('DEF')) });
  for(let i=0;i<3;i++) roster.push({ id:idGen(teamCode,'LB',i), name:`LB ${i+1}`, pos:'LB', card: weightedPickFactory(pickCardForPos('DEF')) });
  for(let i=0;i<2;i++) roster.push({ id:idGen(teamCode,'CB',i), name:`CB ${i+1}`, pos:'CB', card: weightedPickFactory(pickCardForPos('DEF')) });
  roster.push({ id:idGen(teamCode,'FS',0), name:'FS 1', pos:'FS', card: weightedPickFactory(pickCardForPos('DEF')) });
  roster.push({ id:idGen(teamCode,'SS',0), name:'SS 1', pos:'SS', card: weightedPickFactory(pickCardForPos('DEF')) });

  return roster;
}
