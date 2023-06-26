import { useLoaderData } from "react-router-dom"

const Lobby = () => {
  const data = useLoaderData();
  console.log(data);

  return (
    <div>Lobby</div>
  )
}

export default Lobby