const WaitingLobbyCard = () => {
  return (
    <div className="relative bg-transparent w-72 h-20 rounded-3xl border-solid border-4 border-white flex px-4 py-2 gap-y-2 items-center">
      <div className= "flex items-center justify-center gap-x-5 w-full">
        <div className="font-bold font-primary text-xl text-center text-slate-700 overflow-hidden">Waiting for player...</div>
      </div>
    </div>
  )
}

export default WaitingLobbyCard