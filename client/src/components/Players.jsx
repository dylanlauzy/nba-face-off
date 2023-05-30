import { useQuery, gql } from '@apollo/client'
import PlayerCard from './PlayerCard';

const GET_RANDOM_PLAYERS = gql`
  query GetRandomPlayers($count: Int!) {
    getRandomPlayers(count: $count) {
      id
      name
      age
      team
      games
      pts
      reb
      ast
      stl
      blk
      fgPct
      ftPct
      fg3Pct
    }
  }
`;

const Players = () => {
  const { loading: loading, error: error, data: data } = useQuery(GET_RANDOM_PLAYERS, {
    variables: { count: 2 }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="flex bg-sky-100 h-screen">
      <PlayerCard player={data.getRandomPlayers[0]}/>
      <PlayerCard player={data.getRandomPlayers[1]}/>
    </div>
  )
}

export default Players