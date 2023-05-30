import { useQuery, gql } from '@apollo/client'
import Stats from "./Stats"

const PlayerCard = ( {player} ) => {
  const stats = {
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
    <div className="m-auto bg-gradient-to-br from-slate-100 to-violet-500 w-80 h-128 rounded-3xl border-solid border-4 border-white flex flex-col p-6 gap-y-2" >
      <div className="flex items-center gap-x-2">
        <img src={require(`../assets/${player.team}.png`)} className="w-16 h-16"></img>
        <div className="flex flex-col">
          <div className="font-bold font-primary text-2xl">{player.name}</div>
          <div className="font-normal font-secondary text-xs">{player.team} | Point Guard</div>
        </div>
      </div>

      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`} className="h-44 object-cover border-solid border-2 border-black"></img>

      <Stats data={stats}/>

      <div className="flex justify-between">
        <div>
          <div className="text-xs font-secondary font-bold underline">Awards</div>
          <div className="text-xs font-secondary">5x All Star | 2x NBA Champion | 2x Finals MVP | 2x Def. POY | 1x All-Star MVP </div>
        </div>

        <img src={require(`../assets/${player.team}.png`)} className="w-16 h-16"></img>
      </div>
    </div>
  )
}

export default PlayerCard