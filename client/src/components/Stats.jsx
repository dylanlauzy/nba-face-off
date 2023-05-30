const Stats = ({ data }) => {
  return (
    <div className="text-sm flex flex-col gap-y-1">
      {Object.keys(data).map((key) => {
        return (<div className="flex justify-between">
          <div className="font-bold font-secondary">{key}:</div>
          <div className="font-secondary">{data[key]}</div>
        </div>)
      })}
    </div>
  )
}

export default Stats