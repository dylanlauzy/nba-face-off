const Stats = ({ data, isTurn }) => {
  return (
    <div className="text-sm flex flex-col gap-y-1">
      {Object.keys(data).map((key) => {
        return (<div className={`flex justify-between px-2 ${isTurn ? "hover:font-bold hover:cursor-pointer hover:bg-slate-100/50 hover:rounded-lg" : ""}`}>
          <div className="font-bold font-secondary">{key}:</div>
          <div className="font-secondary">{data[key]}</div>
        </div>)
      })}
    </div>
  )
}

export default Stats