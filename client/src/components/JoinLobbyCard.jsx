import { useState } from "react"
import PopoverForm from "./PopoverForm"

const JoinLobbyCard = ({ gameState }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="relative">
      <button className="relative bg-transparent w-72 h-20 rounded-3xl border-solid border-4 border-white flex px-4 py-2 gap-y-2 items-center" onClick={() => {setShowForm(!showForm)}}>
        <div className= "flex items-center justify-center gap-x-5 w-full">
          <img alt='Plus icon' src={require("../assets/plus.png")} className="w-10 h-10"></img>
          <div className="font-bold font-primary text-xl text-center text-slate-700 overflow-hidden">Join Game</div>
        </div>
      </button>
      {showForm && <PopoverForm gameState={gameState} />}
    </div>
  )
}


export default JoinLobbyCard