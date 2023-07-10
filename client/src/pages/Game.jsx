import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useSubscription, gql } from "@apollo/client";
import PlayerCard from '../components/PlayerCard';

const Game = () => {
  const gameState = useLoaderData();
  const playerId = localStorage.getItem("playerId");
  console.log(gameState);
  console.log("Player: ", playerId);

  // create state variables for 'me' and 'opponent'
  const [me, setMe] = useState(gameState.players.find(player => player.id === playerId));
  const [opponent, setOpponent] = useState(gameState.players.find(player => player.id !== playerId));

  // update 'me' and 'opponent' whenever 'gameState' or 'playerId' changes
  useEffect(() => {
    if (gameState && playerId) {
      setMe(gameState.players.find(player => player.id === playerId));
      setOpponent(gameState.players.find(player => player.id !== playerId));
    }
  }, [gameState, playerId]);

  return (
    <div className="flex h-screen bg-hero">
      <div className="m-auto flex flex-col gap-y-3">
        <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
          <span className="font-bold">{me.name}:</span> {me.cardsLeft} cards remaining
        </div>
        {me && <PlayerCard player={me.cards[0]} isTurn={true} hidden={false}/>}
      </div>
      <div className="m-auto flex flex-col gap-y-3">
        <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
          <span className="font-bold">{opponent.name}:</span> {me.cardsLeft} cards remaining
        </div>
        {opponent && <PlayerCard player={opponent.cards[0]} isTurn={false} hidden={true}/>}
      </div>
    </div>
  )
}

export default Game