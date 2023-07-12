import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, split, HttpLink} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import CreateGame from './pages/CreateGame';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import ErrorPage from './pages/ErrorPage';

// const API_URI = process.env.REACT_APP_API_URI;
const API_URI = "http://localhost:4000/graphql";
const SUBSCRIPTION_URL = "ws://localhost:4000/graphql";

const httpLink = new HttpLink({
  uri: API_URI
})

const wsLink = new GraphQLWsLink(createClient({
  url: SUBSCRIPTION_URL
}))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const GET_STATE_LOBBY = gql`
  query GetGameState($gameId: ID!) {
    getGameState(gameId: $gameId) {
      id
      name
      status
      players {
        id
        name
        team
      }
    }
  }
`

const GET_STATE_GAME = gql`
  query GetGameState($gameId: ID!) {
    getGameState(gameId: $gameId) {
      id
      name
      status
      players {
        id
        name
        team
        cardsLeft
        cards {
          id
          name
          age
          team
          games
          pts
          reb
          ast
          stl
          blk
          fgPct
          ftPct
          fg3Pct
        }
      }
    }
  }
`

// Router
const router = createBrowserRouter([
  { 
    path: "/",
    Component: CreateGame,
    errorElement: <ErrorPage />
  },
  { path: "/create-game", Component: CreateGame },
  { 
    path: "/lobby/:id",
    Component: Lobby,
    loader: async ({ params }) => {
      try {
        const { data } = await client.query({ query: GET_STATE_LOBBY, variables: { gameId: params.id } })
        return data.getGameState;
      } catch(error) {
        throw new Error("Error 404: lobby doesn't exist", { status: 404 });
      }
    },
    errorElement: <ErrorPage />
  },
  { 
    path:
    "/game/:id",
    Component: Game,
    loader: async ({ params }) => {
      try {
        const { data } = await client.query({ query: GET_STATE_GAME, variables: { gameId: params.id } })

        if (data.getGameState.status === "Waiting") throw new Error("Game hasn't started", { status: 404 });

        return data.getGameState;
      } catch(error) {
        throw new Error("Error 404: game doesn't exist", { status: 404 });
      }
    },
    errorElement: <ErrorPage />
  }
])

function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router}/>
    </ApolloProvider>
  );
}

export default App;
