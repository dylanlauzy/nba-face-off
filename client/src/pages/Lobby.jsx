import { useLoaderData } from "react-router-dom"
import LobbyCard from "../components/LobbyCard";
import JoinLobbyCard from "../components/JoinLobbyCard";

const Lobby = () => {
  // load data from route loader
  const gameState = useLoaderData();
  console.log(gameState);

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

  return (
    <div className="flex h-screen bg-hero bg-cover">
      <div className="flex flex-col items-center m-auto py-7 px-8 gap-y-3 rounded-3xl bg-white/95">
        <div className="font-bold text-4xl text-center font-primary my-px">{gameState.name}</div>
        <div className="w-full h-1 bg-blue-800"></div>
        <div className="flex items-center gap-x-5 py-6 px-10">
          <LobbyCard team={gameState.players[0].team} name={gameState.players[0].name}/>
          <img alt="graphic for word 'vs'" src={require('../assets/vs.png')} className="h-12 w-12"></img>
          {gameState.players[1] ? <LobbyCard team={gameState.players[1].team} name={gameState.players[1].name}/> : <JoinLobbyCard gameState={gameState} />}
        </div>
        <div className="flex gap-x-2 w-full">
          <div onClick={copyURL} className="flex-auto text-center font-secondary bg-white py-2 rounded-md shadow-inner shadow-gray-300 hover:cursor-pointer active:bg-gray-100 select-none">{window.location.href}</div>
          <button onClick={copyURL}className="h-10 px-6 rounded-xl bg-green-700 text-white font-bold hover:cursor-pointer hover:bg-green-800 active:ring active:ring-green-300">Copy</button>
        </div>
        <button className="w-full h-10 rounded-xl bg-blue-800 text-white font-bold hover:cursor-pointer hover:bg-blue-900 focus:outline-none active:ring active:ring-blue-300">Start Game</button>
      </div>
    </div>
  )
}

export default Lobby