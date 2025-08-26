import React, { useEffect, useState, useRef } from 'react';
import TEAMS from './data/teams.js';
import generateRoster from './lib/roster.js';
import PlayerCard from './components/PlayerCard.jsx';
import CPU from './lib/cpu.js';
import sampleCards from './data/player_cards.json';

/* In the Trenches - App
   - Uses Tailwind utility classes (styles.css configured)
   - Loads placeholder logos from src/assets/logos/*.png (replace with real assets)
*/

export default function App(){
  const [home, setHome] = useState(TEAMS[0]);
  const [away, setAway] = useState(TEAMS[1]);
  const [homeRoster, setHomeRoster] = useState([]);
  const [awayRoster, setAwayRoster] = useState([]);
  useEffect(()=>{
    setHomeRoster(generateRoster(home.code, sampleCards));
    setAwayRoster(generateRoster(away.code, sampleCards));
  }, [home, away]);

  // Game state
  const [possession, setPossession] = useState('home');
  const [ball, setBall] = useState(35); // 0..100
  const [quarter, setQuarter] = useState(1);
  const [clock, setClock] = useState(15*60);
  const [score, setScore] = useState({home:0, away:0});
  const [down, setDown] = useState(1);
  const [distance, setDistance] = useState(10);
  const [playLog, setPlayLog] = useState([]);
  const [offPlay, setOffPlay] = useState('');
  const [defPlay, setDefPlay] = useState('');
  const [selectedControl, setSelectedControl] = useState('home'); // who user controls
  const [isRunning, setIsRunning] = useState(false);

  function addLog(line){
    setPlayLog(l=>[line, ...l].slice(0,300));
  }

  function runPlay(){
    if(isRunning) return;
    setIsRunning(true);
    // Determine which side CPU controls
    const offenseIsUser = (selectedControl === possession || selectedControl === 'both');
    const defenseIsUser = (selectedControl !== possession && selectedControl !== 'both');
    const offenseChoice = offenseIsUser ? offPlay || 'Run' : CPU.selectOffense({down, distance, ball, quarter, score});
    const defenseChoice = defenseIsUser ? defPlay || 'Base' : CPU.selectDefense({down, distance, ball, quarter, score});
    addLog(`Play called: Offense=${offenseChoice} vs Defense=${defChoice(defenseChoice)}`);
    // Simple resolution: use QB card vs defense modifier + play types
    setTimeout(()=>{
      // pick outcome from QB card
      const roster = possession === 'home' ? homeRoster : awayRoster;
      const qb = roster.find(p=>p.pos==='QB');
      const outcome = qb ? qb.card.weightedPick() : {label:'Minimal', yards:3};
      // defense effect
      const defMod = CPU.defenseModifier(defenseChoice);
      const finalYards = Math.max(-10, Math.round(outcome.yards - defMod));
      // apply
      let newBall = ball;
      if(possession==='home') newBall = Math.min(100, ball + finalYards);
      else newBall = Math.max(0, ball - finalYards);
      addLog(`${outcome.label} for ${finalYards} yards.`);
      if(newBall >= 100 || newBall <= 0){
        // touchdown
        const scoring = possession;
        setScore(s=>({...s, [scoring]: s[scoring]+7}));
        addLog(`${scoring.toUpperCase()} TOUCHDOWN!`);
        setBall(35);
        setPossession(p=>p==='home'?'away':'home');
        setDown(1); setDistance(10);
      } else {
        const gained = Math.abs(newBall - ball);
        if(gained >= distance){ setDown(1); setDistance(10); } else { setDown(d=>Math.min(4,d+1)); setDistance(d=>Math.max(1,d - gained)); }
        setBall(newBall);
      }
      // clock rules
      const isQ2or4 = quarter===2 || quarter===4;
      const clockUsed = (isQ2or4 && clock <= 2*60) ? 5 : 30;
      setClock(c=>Math.max(0,c-clockUsed));
      setIsRunning(false);
    }, 700);
  }

  function defChoice(c){ return c; }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">In the Trenches</h1>
        <div className="text-sm">
          Clock: <span className="font-mono">{Math.floor(clock/60).toString().padStart(2,'0')}:{(clock%60).toString().padStart(2,'0')}</span> Q{quarter}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-3 gap-4">
        <section className="col-span-2">
          <div className="bg-white rounded shadow p-4 space-y-3">
            <div className="flex gap-4">
              <div>
                <label className="text-xs">Home</label>
                <select className="border p-1 rounded" value={home.code} onChange={e=>setHome(TEAMS.find(t=>t.code===e.target.value))}>
                  {TEAMS.map(t=>(<option key={t.code} value={t.code}>{t.name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs">Away</label>
                <select className="border p-1 rounded" value={away.code} onChange={e=>setAway(TEAMS.find(t=>t.code===e.target.value))}>
                  {TEAMS.map(t=>(<option key={t.code} value={t.code}>{t.name}</option>))}
                </select>
              </div>
              <div className="ml-auto">
                <label className="text-xs">You control:</label>
                <select className="border p-1 rounded" value={selectedControl} onChange={e=>setSelectedControl(e.target.value)}>
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            <div className="bg-green-700 h-48 rounded relative overflow-hidden">
              <div className="absolute inset-0 p-6">
                <div className="w-full h-full relative bg-[linear-gradient(#0b6623,#0a5a1f)] rounded">
                  {Array.from({length:11}).map((_,i)=>(
                    <div key={i} style={{left:`${i*10}%`}} className="absolute top-0 bottom-0 w-[2px] bg-white/30"></div>
                  ))}
                  <div style={{left:`${ball}%`}} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold">🏈</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-semibold">Offense</h3>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {(possession==='home' ? homeRoster : awayRoster).filter(p=>['QB','RB','WR','TE','K','P'].includes(p.pos)).map(p=>(
                    <div key={p.id} className="w-12 h-12 bg-white rounded shadow flex items-center justify-center text-xs" title={p.name}>
                      {p.pos}
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-xs">Off Play</label>
                  <select className="border p-1 rounded w-full" value={offPlay} onChange={e=>setOffPlay(e.target.value)}>
                    <option value="">--Select--</option>
                    <option>Run</option>
                    <option>Quick Pass</option>
                    <option>Pass</option>
                    <option>Deep Pass</option>
                    <option>Punt</option>
                    <option>Field Goal</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-semibold">Defense</h3>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {(possession==='home' ? awayRoster : homeRoster).filter(p=>['DT','DE','LB','CB','FS','SS'].includes(p.pos)).map(p=>(
                    <div key={p.id} className="w-12 h-12 bg-white rounded shadow flex items-center justify-center text-xs" title={p.name}>
                      {p.pos}
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-xs">Def Play</label>
                  <select className="border p-1 rounded w-full" value={defPlay} onChange={e=>setDefPlay(e.target.value)}>
                    <option value="">--Select--</option>
                    <option>Base</option>
                    <option>Blitz</option>
                    <option>Man</option>
                    <option>Prevent</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={runPlay} disabled={isRunning}>Run Play</button>
              <div className="ml-auto text-sm">Down: {down} &nbsp; Dist: {distance}</div>
            </div>

          </div>

          <div className="mt-4 bg-white rounded shadow p-3">
            <h3 className="font-semibold">Play Result</h3>
            <div className="mt-2 max-h-48 overflow-auto text-sm bg-gray-50 p-2 rounded">
              {playLog.length===0 ? <div className="text-gray-500">Results appear here.</div> : (
                <ul className="list-disc pl-5">
                  {playLog.map((l,i)=>(<li key={i}>{l}</li>))}
                </ul>
              )}
            </div>
          </div>

        </section>

        <aside className="col-span-1 space-y-4">
          <div className="bg-white rounded shadow p-3">
            <h3 className="font-semibold">Scoreboard</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 items-center">
              <div>
                <div className="text-sm font-semibold">{home.code}</div>
                <div className="text-2xl font-bold">{score.home}</div>
              </div>
              <div>
                <div className="text-sm font-semibold">{away.code}</div>
                <div className="text-2xl font-bold">{score.away}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-3">
            <h3 className="font-semibold">Rosters (hover for card)</h3>
            <div className="mt-2 max-h-96 overflow-auto text-sm">
              <div className="mb-2 font-semibold">{home.code}</div>
              <div className="grid grid-cols-3 gap-2">
                {homeRoster.map(p=>(
                  <div key={p.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">{p.pos}</div>
                    <div className="text-xs">{p.name}</div>
                  </div>
                ))}
              </div>
              <hr className="my-2"/>
              <div className="mb-2 font-semibold">{away.code}</div>
              <div className="grid grid-cols-3 gap-2">
                {awayRoster.map(p=>(
                  <div key={p.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">{p.pos}</div>
                    <div className="text-xs">{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </aside>

      </main>
    </div>
  );
}
