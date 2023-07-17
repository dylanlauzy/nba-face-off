import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useSubscription, gql } from "@apollo/client";
import PlayerCard from '../components/PlayerCard';

const STAT_CHOSEN_SUBSCRIPTION = gql`
  subscription StatChosen($gameId: ID!) {
    statChosen(gameId: $gameId) {
      gameState {
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
      roundWinner
      chosenStat
      chosenBy
    }
  }
`

const Game = () => {
  const userId = localStorage.getItem("userId");
  
  // create state variables for 'me' and 'opponent'
  const [gameState, setGameState] = useState(useLoaderData());
  const [me, setMe] = useState(gameState.players.find(player => player.id === userId));
  const [userCardHidden, setUserCardHidden] = useState(false);
  const [oppCardHidden, setOppCardHidden] = useState(true);
  const [opponent, setOpponent] = useState(gameState.players.find(player => player.id !== userId));

  const onStatChosen = ({ data }) => {
    setOppCardHidden(false);
    setTimeout(() => {
      setOppCardHidden(true);
      setUserCardHidden(true);
    }, 2000)
    setTimeout(() => {
      setUserCardHidden(false);
      setGameState(data.data.statChosen.gameState)
    }, 2500)
  }

  const { data: selectionData, loading: statChosenLoading } = useSubscription(
    STAT_CHOSEN_SUBSCRIPTION,
    { 
      variables: { gameId: gameState.id },
      onData: onStatChosen
    }
  )

  // update 'me' and 'opponent' whenever 'gameState' or 'userId' changes
  useEffect(() => {
    if (gameState && userId) {
      setMe(gameState.players.find(player => player.id === userId));
      setOpponent(gameState.players.find(player => player.id !== userId));
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
        { selectionData && (
          <div className="w-128 mx-auto py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center font-bold">
            {`${gameState.players.find(player => player.id === selectionData.statChosen.chosenBy).name} chose ${selectionData.statChosen.chosenStat} and ${selectionData.statChosen.roundWinner ? selectionData.statChosen.roundWinner == selectionData.statChosen.chosenBy ? "won" : "lost" : "it was a tie!"}`}
          </div>
        )}
        <div className="flex">
          <div className="m-auto flex flex-col gap-y-3">
            <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
              <span className="font-bold">{me.name}:</span> {me.cardsLeft} cards remaining
            </div>
            {me && <PlayerCard player={me.cards[0]} isTurn={gameState.turn === userId} hidden={userCardHidden} gameData={{gameId: gameState.id, userId}}/>}
          </div>
          <div className="m-auto flex flex-col gap-y-3">
            <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
              <span className="font-bold">{opponent.name}:</span> {opponent.cardsLeft} cards remaining
            </div>
            {opponent && <PlayerCard player={opponent.cards[0]} isTurn={false} hidden={oppCardHidden} gameData={{gameId: gameState.id, userId}}/>}
          </div>
        </div>
      </div>
    )
  }
}

export default Game