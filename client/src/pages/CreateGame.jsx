import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client'
import { handleError } from '@apollo/client/link/http/parseAndCheckHttpResponse';

const CREATE_GAME = gql`
  mutation CreateGame($name: String, $player: PlayerInput!) {
    createGame(name: $name, player: $player) {
      id
      name
      players {
        id
        name
      }
    }
  }
`


const CreateGame = () => {
  const navigate = useNavigate();
  const [createGame, { data, loading, error }] = useMutation(CREATE_GAME);
  const [playerName, setPlayerName] = useState("");
  const [gameName, setGameName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await createGame({ variables: { name: gameName, player: { name: playerName } }});
    navigate(`/lobby/${data.createGame.id}`);
  }


  return (
    <div className="flex h-screen bg-hero bg-cover">
      <div className="flex flex-col m-auto w-[34rem] py-7 px-8 gap-y-3 rounded-3xl bg-white/95">
        <div className="font-bold text-4xl text-center font-primary my-px">NBA Face Off</div>
        <div className="w-full h-1 bg-blue-800"></div>
        <div className="text-center font-secondary">Welcome to NBA Face Off! Start a lobby and invite a friend to see whose NBA knowledge (and luck) comes out on top.</div>
        <form className="flex flex-col gap-y-3 font-secondary" onSubmit={handleSubmit}>
          <div>
            <label for="name" className="block font-bold text-gray-500">Your Name</label>
            <input type="text" id="name" placeholder="Michael Jordan" value={playerName} className="w-full rounded-md" onChange={(e) => {setPlayerName(e.target.value)}}/>
          </div>
          <div>
            <label for="lobby" className="block font-bold text-gray-500">Lobby Name</label>
            <input type="text" id="lobby" placeholder="New Lobby" className="w-full rounded-md" value={gameName} onChange={(e) => {setGameName(e.target.value)}}/>
          </div>
          <input type="submit" value="Create Game" className="h-10 rounded-md bg-blue-700 text-white font-bold hover:cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"/>
        </form>
      </div>
    </div>
  )
}

export default CreateGame