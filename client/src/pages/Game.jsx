import { useLoaderData, useNavigate } from "react-router-dom";

const Game = () => {
  const gameState = useLoaderData();
  const playerId = localStorage.getItem("playerId");
  console.log(gameState);
  console.log("Player: ", playerId);

  return (
    <div>Game</div>
  )
}

export default Game