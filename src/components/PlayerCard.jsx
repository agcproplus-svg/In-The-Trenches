import React from 'react';

export default function PlayerCard({player}){
  return (
    <div className="bg-white p-2 rounded shadow">
      <div className="text-sm font-semibold">{player.name} — {player.pos}</div>
      <ul className="text-xs mt-2 list-disc pl-5">
        {player.card.card.map((c,i)=> (
          <li key={i}>{c.label} — weight: {c.weight} — yards: {c.yards}</li>
        ))}
      </ul>
    </div>
  );
}
