import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useSubscription, gql } from "@apollo/client";
import PlayerCard from '../components/PlayerCard';

const GAME_STATE_SUBSCRIPTION = gql`
  subscription GetGameState($gameId: ID!) {
    getGameState(gameId: $gameId) {
      id
      name
      status
      turn
      winner
      players {
        id
        name
        team
        cardsLeft
        cards {
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
    }
  }
`

const Game = () => {
  let gameState = useLoaderData();
  const userId = localStorage.getItem("userId");
  
  const { data: subscriptionData, loading: subscriptionLoading } = useSubscription(
    GAME_STATE_SUBSCRIPTION,
    { variables: { gameId: gameState.id  } }
  );

  if (subscriptionData) {
    console.log("new Data");
    gameState = subscriptionData.getGameState;

  };

  // create state variables for 'me' and 'opponent'
  const [me, setMe] = useState(gameState.players.find(player => player.id === userId));
  const [flip, setFlip] = useState(false);
  const [opponent, setOpponent] = useState(gameState.players.find(player => player.id !== userId));

  // update 'me' and 'opponent' whenever 'gameState' or 'userId' changes
  useEffect(() => {
    if (gameState && userId) {
      setMe(gameState.players.find(player => player.id === userId));
      setOpponent(gameState.players.find(player => player.id !== userId));

      setFlip(true);
      setTimeout(() => setFlip(false), 500)
    }
  }, [gameState, userId]);

  if(gameState.winner) {
    return (
      <div>
        {`${gameState.players.find(player => player.id === gameState.winner).name} is the winner`}
      </div>
    )
  } else {
    return (
      <div className="flex flex-col gap-y-16 h-screen bg-hero justify-center">
        <div className="w-128 mx-auto py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
          <span className="font-bold">{me.name}:</span> {me.cardsLeft} cards remaining
        </div>
        <div className="flex">
          <div className="m-auto flex flex-col gap-y-3">
            <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
              <span className="font-bold">{me.name}:</span> {me.cardsLeft} cards remaining
            </div>
            {me && <PlayerCard player={me.cards[0]} isTurn={gameState.turn === userId} hidden={flip} gameData={{gameId: gameState.id, userId}}/>}
          </div>
          <div className="m-auto flex flex-col gap-y-3">
            <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
              <span className="font-bold">{opponent.name}:</span> {opponent.cardsLeft} cards remaining
            </div>
            {opponent && <PlayerCard player={opponent.cards[0]} isTurn={false} hidden={true} gameData={{gameId: gameState.id, userId}}/>}
          </div>
        </div>
      </div>
    )
  }
}

export default Game