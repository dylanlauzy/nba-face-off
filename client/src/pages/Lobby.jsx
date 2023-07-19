import { useLoaderData, useNavigate } from "react-router-dom";
import LobbyCard from "../components/LobbyCard";
import JoinLobbyCard from "../components/JoinLobbyCard";
import WaitingLobbyCard from "../components/WaitingLobbyCard";
import { gql, useMutation, useSubscription } from "@apollo/client";

import Layout from '../components/Layout'


const START_GAME = gql`
  mutation StartGame($gameId: ID!) {
    startGame(gameId: $gameId) {
      id
      status
    }
  }
`

const GAME_STATE_SUBSCRIPTION = gql`
  subscription GetGameState($gameId: ID!) {
    getGameState(gameId: $gameId) {
      id
      name
      status
      players {
        id
        name
        team
      }
    }
  }
`

const Lobby = () => {
  // load data from route loader
  const userId = localStorage.getItem('userId');
  let gameState = useLoaderData();
  const navigate = useNavigate();
  
  const { data: subscriptionData, loading: subscriptionLoading } = useSubscription(
    GAME_STATE_SUBSCRIPTION,
    { variables: { gameId: gameState.id  } }
  );

  if(subscriptionData) {
    console.log("new Data");
    gameState = subscriptionData.getGameState;

  };
  
  if(gameState.status !== "Waiting") {
    navigate(`/game/${gameState.id}`);
  }

  // URL sharing
  const copyURL = () => {
    const { href } = window.location;
    navigator.clipboard.writeText(href)
      .then(() => {
        console.log('URL copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy URL: ', error);
      });
  };

  // start game
  const [startGame, { data, loading, error}] = useMutation(START_GAME, { variables: { gameId: gameState.id }})
  const handleStart = async () => {
    if(gameState.players.length < 2) throw new Error("Waiting for players");

    const res = await startGame();
    const data = res.data.startGame
    if(data.status == 404) throw new Error("Game already started");

    navigate(`/game/${data.id}`)
  }

  return (
    <Layout>
      <div className="flex h-screen">
        <div className="flex flex-col items-center m-auto py-7 px-8 gap-y-3 rounded-3xl bg-white/95">
          <div className="font-bold text-4xl text-center font-primary my-px">{gameState.name}</div>
          <div className="w-full h-1 bg-blue-800"></div>
          <div className="flex items-center gap-x-5 py-6 px-10">
            <LobbyCard team={gameState.players[0].team} name={gameState.players[0].name}/>
            <img alt="graphic for word 'vs'" src={require('../assets/vs.png')} className="h-12 w-12"></img>
            {gameState.players[1] ? <LobbyCard team={gameState.players[1].team} name={gameState.players[1].name}/> : userId ? <WaitingLobbyCard /> : <JoinLobbyCard gameState={gameState}/>}
          </div>
          <div className="flex gap-x-2 w-full">
            <div onClick={copyURL} className="flex-auto text-center font-secondary bg-white py-2 rounded-md shadow-inner shadow-gray-300 hover:cursor-pointer active:bg-gray-100 select-none">{window.location.href}</div>
            <button onClick={copyURL}className="h-10 px-6 rounded-xl bg-green-700 text-white font-bold hover:cursor-pointer hover:bg-green-800 active:ring active:ring-green-300">Copy</button>
          </div>
          <button onClick={handleStart} className="w-full h-10 rounded-xl bg-blue-800 text-white font-bold hover:cursor-pointer hover:bg-blue-900 focus:outline-none active:ring active:ring-blue-300">Start Game</button>
        </div>
      </div>
    </Layout>
  )
}

export default Lobby