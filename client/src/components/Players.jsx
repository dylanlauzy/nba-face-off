import { useQuery, gql } from '@apollo/client'
import { useState, useEffect } from 'react';
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
  const { loading, error, data } = useQuery(GET_RANDOM_PLAYERS, {
    variables: { count: 2 }
  });

  const [p1, setP1] = useState({
    name: "Player 1",
    isTurn: true,
    cards: []
  });

  const [p2,setP2] = useState({
    name: "Player 2",
    isTurn: false,
    cards: []
  });

  useEffect(() => {
    if(!loading && !error) {
      let p1Cards = [];
      let p2Cards = [];

      for(let i = 0; i < data.getRandomPlayers.length; i++) {
        if(i % 2 === 1) {
          p1Cards.push(data.getRandomPlayers[i]);
        } else {
          p2Cards.push(data.getRandomPlayers[i]);
        }
      }

      setP1((prevP1) => ({
        ...prevP1,
        cards: p1Cards
      }))
      
      setP2((prevP2) => ({
        ...prevP2,
        cards: p2Cards
      }))
    }
  }, [loading, error, data])

  useEffect(() => {
    console.log(p1)
    console.log(p2)
  }, [p1, p2])


  if (loading || p1.cards.length == 0 || p2.cards.length == 0) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="flex h-screen bg-hero bg-cover">
      <PlayerCard player={p1.cards[0]} isTurn={p1.isTurn}/>
      <PlayerCard player={p2.cards[0]} isTurn={p2.isTurn}/>
    </div>
  )
}

export default Players