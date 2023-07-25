import { useState, useEffect } from "react";

import Stats from "./Stats"
import PlayerCardBack from "./PlayerCardBack";

const teams = {
  'ATL': 'to-ATL',
  'BOS': 'to-BOS',
  'CLE': 'to-CLE',
  'MIA': 'to-MIA',
  'OKC': 'to-OKC',
  'GSW': 'to-GSW',
  'HOU': 'to-HOU',
  'BKN': 'to-BKN',
  'CHA': 'to-CHA',
  'CHI': 'to-CHI',
  'DAL': 'to-DAL',
  'DEN': 'to-DEN',
  'DET': 'to-DET',
  'IND': 'to-IND',
  'LAC': 'to-LAC',
  'LAL': 'to-LAL',
  'MEM': 'to-MEM',
  'MIL': 'to-MIL',
  'MIN': 'to-MIN',
  'NOP': 'to-NOP',
  'NYK': 'to-NYK',
  'ORL': 'to-ORL',
  'PHI': 'to-PHI',
  'PHX': 'to-PHX',
  'POR': 'to-POR',
  'SAC': 'to-SAC',
  'SAS': 'to-SAS',
  'TOR': 'to-TOR',
  'UTA': 'to-UTA',
  'WAS': 'to-WAS'
}

const PlayerCard = ( {player, isTurn, hidden, winner, highlightStat, gameData} ) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // pre-load image
  useEffect(() => {
    const img = new Image();
    img.src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`;
    img.onload = () => setImageLoaded(true);
  }, [player]);

  if(!imageLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className={`flip-card ${hidden ? "" : "flipped"} w-80 h-128 z-20`}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <PlayerCardBack />
        </div>
        <div className="flip-card-back">
        <div className={`${winner && 'shadow-xl shadow-yellow-300'} m-auto bg-gradient-to-br from-slate-100 ${teams[player.team]} w-80 h-128 rounded-3xl border-solid border-4 border-white flex flex-col p-6 gap-y-2`}>
          <div className="flex items-center gap-x-2">
            <img alt={`team logo: ${player.team}`} src={require(`../assets/${player.team}.png`)} className="w-16 h-16"></img>
            <div className="flex flex-col">
              <div className="font-bold font-primary text-xl">{player.name}</div>
              <div className="font-normal font-secondary text-xs">{player.team} | Point Guard</div>
            </div>
          </div>

          <img alt={`player headshot for ${player.name}`} src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`} className="h-44 object-cover border-solid border-2 border-black"></img>

          <Stats player={player} isTurn={isTurn} highlightStat={highlightStat} gameData={gameData}/>

          
        </div>
        </div>
      </div>
    </div>
  )

  // if (hidden) {
  //   return (
  //     <div className="hover:skew-x-3 m-auto bg-bharis w-80 h-128 rounded-3xl border-solid border-4 border-white flex flex-col gap-y-2"></div>
  //   )
  // } else {
  //   return (
  //     <div className={`m-auto bg-gradient-to-br from-slate-100 ${teams[player.team]} w-80 h-128 rounded-3xl border-solid border-4 border-white flex flex-col p-6 gap-y-2`}>
  //       <div className="flex items-center gap-x-2">
  //         <img alt={`team logo: ${player.team}`} src={require(`../assets/${player.team}.png`)} className="w-16 h-16"></img>
  //         <div className="flex flex-col">
  //           <div className="font-bold font-primary text-xl">{player.name}</div>
  //           <div className="font-normal font-secondary text-xs">{player.team} | Point Guard</div>
  //         </div>
  //       </div>

  //       <img alt={`player headshot for ${player.name}`} src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`} className="h-44 object-cover border-solid border-2 border-black"></img>

  //       <Stats data={stats} isTurn={isTurn}/>

  //       <div className="flex justify-between">
  //         <div>
  //           <div className="text-xs font-secondary font-bold underline">Awards</div>
  //           <div className="text-xs font-secondary">5x All Star | 2x NBA Champion | 2x Finals MVP | 2x Def. POY | 1x All-Star MVP </div>
  //         </div>

  //         <img alt={`team logo: ${player.team}`} src={require(`../assets/${player.team}.png`)} className="w-16 h-16"></img>
  //       </div>
  //     </div>
  // )
  // }
}

export default PlayerCard