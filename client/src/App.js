import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';
import CreateGame from './pages/CreateGame';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Players from './components/Players';
import ErrorPage from './pages/ErrorPage';

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
  { 
    path: "/",
    Component: Players,
    errorElement: <ErrorPage />
  },
  { path: "/create-game", Component: CreateGame },
  { 
    path: "/lobby/:id",
    Component: Lobby,
    loader: async ({ params }) => {
      try {
        const { data } = await client.query({ query: GET_GAME, variables: { gameId: params.id } })
        return data.getGameState;
      } catch(error) {
        throw new Error("Error 404: lobby doesn't exist", { status: 404 });
      }
    },
    errorElement: <ErrorPage />
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
