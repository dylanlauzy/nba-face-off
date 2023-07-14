import { useMutation, gql } from "@apollo/client"

// const CHOOSE_STAT = gql`
//   mutation ChooseStat($gameId: ID!, $playerId: ID!, $stat: String!) {
//     chooseStat(gameId: $gameId, playerId: $playerId, stat: $stat) {
      
//     }
//   }
// `

const Stats = ({ player, isTurn, gameData: { gameId, playerId} }) => {
  let stat;

  const stats = {
    "Age": [player.age, "age"],
    "Points Per Game": [player.pts, "pts"],
    "Rebounds Per Game": [player.reb, "reb"],
    "Assists Per Game": [player.ast, "ast"],
    "Steals Per Game": [player.stl, "stl"],
    "Blocks Per Game": [player.blk, "blk"],
    "Field Goal %": [player.fgPct, "fgPct"],
    "Free Throw %": [player.ftPct, "ftPct"],
    "Three-Point %": [player.fg3Pct, "fg3Pct"],
  }

  // const [chooseStat, { data, loading, error}] = useMutation(CHOOSE_STAT, { variables: { gameId, playerId, stat }})

  const handleClick = (e) => {
    stat = e.target.getAttribute('stat-type');
  }

  return (
    <div className="text-sm flex flex-col gap-y-1">
      {Object.entries(stats).map(([key, val]) => {
        return (
        <div className={`flex justify-between px-2 ${isTurn ? "hover:font-bold hover:cursor-pointer hover:bg-slate-100/50 hover:rounded-lg" : ""}`} onClick={handleClick} stat-type={val[1]}>
          <div className="font-bold font-secondary">{key}:</div>
          <div className="font-secondary">{val[0]}</div>
        </div>
        )})}
    </div>
  )
}

export default Stats