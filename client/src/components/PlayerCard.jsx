import Stats from "./Stats"

const teams = {
  'ATL': 'to-ATL/90',
  'BOS': 'to-BOS/90',
  'CLE': 'to-CLE/90',
  'MIA': 'to-MIA/90',
  'OKC': 'to-OKC/90',
  'GSW': 'to-GSW/90',
  'HOU': 'to-HOU/90',
  'BKN': 'to-BKN/90',
  'CHA': 'to-CHA/90',
  'CHI': 'to-CHI/90',
  'DAL': 'to-DAL/90',
  'DEN': 'to-DEN/90',
  'DET': 'to-DET/90',
  'IND': 'to-IND/90',
  'LAC': 'to-LAC/90',
  'LAL': 'to-LAL/90',
  'MEM': 'to-MEM/90',
  'MIL': 'to-MIL/90',
  'MIN': 'to-MIN/90',
  'NOP': 'to-NOP/90',
  'NYK': 'to-NYK/90',
  'ORL': 'to-ORL/90',
  'PHI': 'to-PHI/90',
  'PHX': 'to-PHX/90',
  'POR': 'to-POR/90',
  'SAC': 'to-SAC/90',
  'SAS': 'to-SAS/90',
  'TOR': 'to-TOR/90',
  'UTA': 'to-UTA/90',
  'WAS': 'to-WAS/90'
}

const PlayerCard = ( {player, isTurn} ) => {

  const stats = {
    "Age": player.age,
    "Points Per Game": player.pts,
    "Rebounds Per Game": player.reb,
    "Assists Per Game": player.ast,
    "Steals Per Game": player.stl,
    "Blocks Per Game": player.blk,
    "Field Goal %": player.fgPct,
    "Free Throw %": player.ftPct,
    "Three-Point %": player.fg3Pct,
  }

  return (
    <div className={`m-auto bg-gradient-to-br from-slate-100 ${teams[player.team]} w-80 h-128 rounded-3xl border-solid border-4 border-white flex flex-col p-6 gap-y-2`}>
      <div className="flex items-center gap-x-2">
        <img alt={`team logo: ${player.team}`} src={require(`../assets/${player.team}.png`)} className="w-16 h-16"></img>
        <div className="flex flex-col">
          <div className="font-bold font-primary text-xl">{player.name}</div>
          <div className="font-normal font-secondary text-xs">{player.team} | Point Guard</div>
        </div>
      </div>

      <img alt={`player headshot for ${player.name}`} src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`} className="h-44 object-cover border-solid border-2 border-black"></img>

      <Stats data={stats} isTurn={isTurn}/>

      <div className="flex justify-between">
        <div>
          <div className="text-xs font-secondary font-bold underline">Awards</div>
          <div className="text-xs font-secondary">5x All Star | 2x NBA Champion | 2x Finals MVP | 2x Def. POY | 1x All-Star MVP </div>
        </div>

        <img alt={`team logo: ${player.team}`} src={require(`../assets/${player.team}.png`)} className="w-16 h-16"></img>
      </div>
    </div>
  )
}

export default PlayerCard