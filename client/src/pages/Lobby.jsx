import { useLoaderData } from "react-router-dom"
import { useState } from "react";
import LobbyCard from "../components/LobbyCard";
import JoinLobbyCard from "../components/JoinLobbyCard";

const teams = {
  'ATL': 'to-ATL/95',
  'BOS': 'to-BOS/95',
  'CLE': 'to-CLE/95',
  'MIA': 'to-MIA/95',
  'OKC': 'to-OKC/95',
  'GSW': 'to-GSW/95',
  'HOU': 'to-HOU/95',
  'BKN': 'to-BKN/95',
  'CHA': 'to-CHA/95',
  'CHI': 'to-CHI/95',
  'DAL': 'to-DAL/95',
  'DEN': 'to-DEN/95',
  'DET': 'to-DET/95',
  'IND': 'to-IND/95',
  'LAC': 'to-LAC/95',
  'LAL': 'to-LAL/95',
  'MEM': 'to-MEM/95',
  'MIL': 'to-MIL/95',
  'MIN': 'to-MIN/95',
  'NOP': 'to-NOP/95',
  'NYK': 'to-NYK/95',
  'ORL': 'to-ORL/95',
  'PHI': 'to-PHI/95',
  'PHX': 'to-PHX/95',
  'POR': 'to-POR/95',
  'SAC': 'to-SAC/95',
  'SAS': 'to-SAS/95',
  'TOR': 'to-TOR/95',
  'UTA': 'to-UTA/95',
  'WAS': 'to-WAS/95'
}

const Lobby = () => {
  const data = useLoaderData();
  console.log(data);

  const [player, setPlayer] = useState({
    team: Object.keys(teams)[ Object.keys(teams).length * Math.random() << 0]
  });

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
        <div className="font-bold text-4xl text-center font-primary my-px">{data.name}</div>
        <div className="w-full h-1 bg-blue-800"></div>
        <div className="flex items-center gap-x-5 py-6 px-10">
          <LobbyCard team={player.team} name={data.players[0].name}/>
          <img alt="graphic for word 'vs'" src={require('../assets/vs.png')} className="h-12 w-12"></img>
          {data.players[1] ? <LobbyCard team={player.team} name={data.players[1].name}/> : <JoinLobbyCard />}
        </div>
        <div className="flex gap-x-2 w-full">
          <div onClick={copyURL} className="flex-auto text-center font-secondary bg-white py-2 rounded-md shadow-inner shadow-gray-300 hover:cursor-pointer">{window.location.href}</div>
          <button onClick={copyURL}className="h-10 px-6 rounded-xl bg-green-700 text-white font-bold hover:cursor-pointer hover:bg-green-800 focus:outline-none focus:ring focus:ring-green-300">Copy</button>
        </div>
        <button className="w-full h-10 rounded-xl bg-blue-800 text-white font-bold hover:cursor-pointer hover:bg-blue-900 focus:outline-none focus:ring focus:ring-blue-300">Start Game</button>
      </div>
    </div>
  )
}

export default Lobby