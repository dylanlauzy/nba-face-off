import { useState} from "react"
import { gql, useMutation } from "@apollo/client";
import { useRevalidator } from "react-router-dom";

const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!, $player: PlayerInput) {
    joinGame(gameId: $gameId, player: $player) {
      id
      name
      players {
        id
        name
      }
    }
  }
`

const PopoverForm = ({ gameState }) => {
  const [playerName, setPlayerName] = useState("");
  const [joinGame, { data, loading, error }] = useMutation(JOIN_GAME);
  const revalidator = useRevalidator();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await joinGame({ variables: { gameId: gameState.id, player: { name: playerName } } });
    console.log(data);
    
    let userData = JSON.parse(localStorage.getItem('nba-face-off-userData')) || { games: {}};
    userData.games[gameState.id] = { playerId: data.joinGame.players[1].id }
    localStorage.setItem('nba-face-off-userData', JSON.stringify(userData));

    revalidator.revalidate();
  }

  return (
    <form className="absolute bottom-24 flex items-end gap-x-3 w-72 font-secondary bg-white/90 p-4 rounded-md border-solid" onSubmit={handleSubmit}>
      <div>
        <label for="name" className="block font-bold text-gray-500">Your Name</label>
        <input autoFocus type="text" id="name" placeholder="Michael Jordan" value={playerName} className="w-full rounded-md" onChange={(e) => {setPlayerName(e.target.value)}}/>
      </div>
      <input type="submit" value="Join" className="h-10 rounded-md bg-blue-700 text-white font-bold px-4 hover:cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"/>
    </form>
  )
}

export default PopoverForm