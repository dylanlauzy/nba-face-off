import { useQuery, useMutation, gql } from '@apollo/client'

const CREATE_GAME = gql`
  mutation CreateGame($name: String) {
    createGame(name: $name) {
      id
      name
    }
  }
`


const CreateGame = () => {


  return (
    <div className="flex h-screen bg-hero bg-cover">
      <div className="flex flex-col m-auto w-[34rem] py-7 px-8 gap-y-3 rounded-3xl bg-white/95">
        <div className="font-bold text-4xl text-center font-primary my-px">NBA Face Off</div>
        <div className="w-full h-1 bg-blue-900"></div>
        <div className="text-center font-secondary">Welcome to NBA Face Off! Start a lobby and invite a friend to see whose NBA knowledge (and luck) comes out on top.</div>
        <form className="flex flex-col gap-y-3 font-secondary">
          <div>
            <label for="name" className="block font-bold text-gray-500">Your Name</label>
            <input type="text" id="name" placeholder="Michael Jordan" className="w-full rounded-md"/>
          </div>
          <div>
            <label for="lobby" className="block font-bold text-gray-500">Lobby Name</label>
            <input type="text" id="lobby" placeholder="New Lobby" className="w-full rounded-md"/>
          </div>
          <input type="submit" value="Create Game" className="h-10 rounded-md bg-blue-900 text-white font-bold"/>
        </form>
      </div>
    </div>
  )
}

export default CreateGame