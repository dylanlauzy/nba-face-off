import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';
import CreateGame from './pages/CreateGame';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Players from './components/Players';

// const API_URI = process.env.REACT_APP_API_URI;
const API_URI = "http://localhost:4000/";
console.log(API_URI)

const client = new ApolloClient({
  uri: API_URI,
  cache: new InMemoryCache(),
});

const GET_GAME = gql`
  query GetGameState($gameId: ID!) {
    getGameState(gameId: $gameId) {
      id
      name
      players {
        id
        name
      }
    }
  }
`

// Router
const router = createBrowserRouter([
  { path: "/", Component: Players },
  { path: "/create-game", Component: CreateGame },
  { 
    path: "/lobby/:id",
    Component: Lobby,
    loader: async ({ params }) => {
      const { data } = await client.query({ query: GET_GAME, variables: { gameId: params.id } })
      return data.getGameState;
    }
  },
  { path: "/game/:id", Component: Game }
])

function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router}/>
    </ApolloProvider>
  );
}

export default App;
