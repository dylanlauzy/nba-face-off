import { useMutation, gql } from "@apollo/client"

const CHOOSE_STAT = gql`
  mutation ChooseStat($gameId: ID!, $userId: ID!, $stat: String!) {
    chooseStat(gameId: $gameId, userId: $userId, stat: $stat) {
      name
      players {
        name
        cardsLeft
      }
    }
  }
`

const Stats = ({ player, isTurn, gameData: { gameId, userId} }) => {

  const [chooseStat, {data, loading, error}] = useMutation(CHOOSE_STAT);

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

  const handleClick = (e) => {
    const stat = e.target.getAttribute('stat-type');
    console.log(gameId, userId, stat);

    chooseStat({ variables: { gameId, userId, stat } });
  }

  return (
    <div className="text-sm flex flex-col gap-y-1">
      {Object.entries(stats).map(([key, val]) => {
        return (
        <div className={`flex justify-between px-2 ${isTurn ? "hover:font-bold hover:cursor-pointer hover:bg-slate-100/50 hover:rounded-lg": "pointer-events-none"}`} onClick={handleClick} stat-type={val[1]}>
          <div className="font-bold font-secondary pointer-events-none">{key}:</div>
          <div className="font-secondary pointer-events-none">{val[0]}</div>
        </div>
        )})}
    </div>
  )
}

export default Stats