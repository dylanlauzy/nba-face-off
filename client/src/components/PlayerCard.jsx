const PlayerCard = () => {
  return (
    <div className="m-auto bg-gradient-to-br from-slate-100 to-violet-500 w-80 h-128 rounded-3xl border-solid border-4 border-white flex flex-col p-6 gap-y-2" >
      <div className="flex items-center gap-x-2">
        <img src={require("../assets/LAL.png")} className="w-16 h-16"></img>
        <div className="flex flex-col">
          <div className="font-bold font-primary text-2xl">Charis Au</div>
          <div className="font-normal font-secondary text-xs">LA Lakers | Point Guard</div>
        </div>
      </div>

      <img src={require("../assets/bharis.png")} className="h-44 object-cover border-solid border-2 border-black"></img>

      <div className="text-sm flex flex-col gap-y-1">
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Points Per Game:</div>
          <div className="font-secondary">36.5</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Rebounds Per Game:</div>
          <div className="font-secondary">12.3</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Assists Per Game:</div>
          <div className="font-secondary">15.5</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Steals Per Game:</div>
          <div className="font-secondary">6.2</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Blocks Per Game:</div>
          <div className="font-secondary">4.2</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Field Goal %:</div>
          <div className="font-secondary">69.2%</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Free Throw %:</div>
          <div className="font-secondary">100.0%</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold font-secondary">Three-Point %:</div>
          <div className="font-secondary">69.0%</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="text-xs font-secondary font-bold underline">Awards</div>
          <div className="text-xs font-secondary">5x All Star | 2x NBA Champion | 2x Finals MVP | 2x Def. POY | 1x All-Star MVP </div>
        </div>

        <img src={require("../assets/LAL.png")} className="w-16 h-16"></img>
      </div>
    </div>
  )
}

export default PlayerCard