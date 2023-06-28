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

const LobbyCard = ({ team, name }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-100 ${teams[team]} w-72 h-20 rounded-3xl border-solid border-4 border-white flex flex-col px-4 py-2 gap-y-2`}>
      <div className="flex items-center gap-x-5 m-auto">
        <img alt={`team logo: ${team}`} src={require(`../assets/${team}.png`)} className="w-10 h-10"></img>
        <div className="font-bold font-primary text-xl flex-auto text-center overflow-hidden">{name}</div>
      </div>
    </div>
  )
}

export default LobbyCard