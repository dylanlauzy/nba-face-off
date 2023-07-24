import { useState, useEffect } from "react";

import Stats from "./Stats"

const teams = {
  'ATL': 'to-ATL/95',
  'BOS': 'to-BOS/95',
  'CLE': 'to-CLE/95',
  'MIA': 'to-MIA/95',
  'OKC': 'to-OKC/95',
  'GSW': 'to-GSW/95',
  'HOU': 'to-HOU/95',
  'BKN': 'to-BKN/95',
  'CHA': 'to-CHA/95',
  'CHI': 'to-CHI/95',
  'DAL': 'to-DAL/95',
  'DEN': 'to-DEN/95',
  'DET': 'to-DET/95',
  'IND': 'to-IND/95',
  'LAC': 'to-LAC/95',
  'LAL': 'to-LAL/95',
  'MEM': 'to-MEM/95',
  'MIL': 'to-MIL/95',
  'MIN': 'to-MIN/95',
  'NOP': 'to-NOP/95',
  'NYK': 'to-NYK/95',
  'ORL': 'to-ORL/95',
  'PHI': 'to-PHI/95',
  'PHX': 'to-PHX/95',
  'POR': 'to-POR/95',
  'SAC': 'to-SAC/95',
  'SAS': 'to-SAS/95',
  'TOR': 'to-TOR/95',
  'UTA': 'to-UTA/95',
  'WAS': 'to-WAS/95'
}

const PlayerCard = ( {player, isTurn, hidden, winner, highlightStat, gameData} ) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log(gameData)

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
    <div className={`flip-card ${hidden ? "" : "flipped"} w-80 h-128`}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="m-auto bg-card-back bg-cover bg-center w-80 h-128 rounded-3xl border-solid border-4 border-white flex flex-col gap-y-2"></div>
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