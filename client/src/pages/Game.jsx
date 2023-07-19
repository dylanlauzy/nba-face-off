import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useSubscription, gql } from "@apollo/client";

import Layout from "../components/Layout";
import Confetti from 'react-confetti';
import {useWindowSize} from 'react-use';
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
  const [opponent, setOpponent] = useState(gameState.players.find(player => player.id !== userId));
  
  const [userCardHidden, setUserCardHidden] = useState(false);
  const [oppCardHidden, setOppCardHidden] = useState(true);
  const [vsHidden, setVsHidden] = useState(true);
  const [roundWinner, setRoundWinner] = useState("");
  const [chosenStat, setChosenStat] = useState("");

  const onStatChosen = ({ data }) => {
    // flip both cards upwards
    setOppCardHidden(false);
    setVsHidden(false);
    setChosenStat(data.data.statChosen.chosenStat);

    // reveal winner
    setTimeout(() => {
      setRoundWinner(data.data.statChosen.roundWinner)

      // flip both cards backwards
      setTimeout(() => {
        setRoundWinner("");
        setChosenStat("");
        setOppCardHidden(true);
        setUserCardHidden(true);
        setVsHidden(true);
  
        // flip my card upwards
        setTimeout(() => {
          setGameState(data.data.statChosen.gameState)
          setTimeout(() => {
            setUserCardHidden(false);
          }, 500);
        }, 500)
      }, 3000)
    }, 500)

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


  const { width, height } = useWindowSize()
  
  if(gameState.winner) {
    return (
      <>
        <Layout>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={1000}
            tweenDuration={10000}
          />
          <div className="flex flex-col h-screen justify-center items-center">
            <img src={require("../assets/goat.png")} alt="Goat" className="w-64 h-auto"/>
            <div className="text-6xl text-white font-bold text-center">
              {`${gameState.players.find(player => player.id === gameState.winner).name} is the winner!!`}
            </div>
          </div>
        </Layout>
      </>
    )
  } else {
    return (
      <Layout>
        <div className={`fixed top-0 left-0 w-full h-full bg-black ${roundWinner ? 'opacity-50' : 'opacity-0'} transition-color duration-1000`}></div>
        <div className={`flex flex-col gap-y-16 h-screen justify-center`}>
          <div className="flex">
            <div className="m-auto flex flex-col gap-y-3">
              <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
                <span className="font-bold">{me.name}:</span> {me.cardsLeft} cards remaining
              </div>
              {me && 
                <PlayerCard 
                  player={me.cards[0]}
                  isTurn={gameState.turn === userId}
                  hidden={userCardHidden}
                  winner={roundWinner === me.id}
                  highlightStat={chosenStat}
                  gameData={{gameId: gameState.id, userId}}
                />}
            </div>
            <img src={require('../assets/vs.png')} alt="vs" className={`h-32 w-auto self-center transition-all duration-500 ${vsHidden && 'opacity-0'}`}/>
            <div className="m-auto flex flex-col gap-y-3">
              <div className="py-2.5 px-5 bg-white/90 rounded-3xl font-primary text-center">
                <span className="font-bold">{opponent.name}:</span> {opponent.cardsLeft} cards remaining
              </div>
              {opponent && 
                <PlayerCard 
                  player={opponent.cards[0]}
                  isTurn={false}
                  hidden={oppCardHidden}
                  winner={roundWinner === opponent.id}
                  highlightStat={chosenStat}
                  gameData={{gameId: gameState.id, userId}}
                />}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Game