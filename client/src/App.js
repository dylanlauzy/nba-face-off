import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

import PlayerCard from './components/PlayerCard'

const API_URI = process.env.REACT_APP_API_URI;

const client = new ApolloClient({
  uri: API_URI,
  cache: new InMemoryCache(),
});

const GET_RANDOM_PLAYER = gql`
  query GetRandomPlayer {
    getRandomPlayer {
      id
      name
      team
      age
      games
    }
  }
`;

function Player() {
  const { loading, error, data } = useQuery(GET_RANDOM_PLAYER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <p>{`ID: ${data.getRandomPlayer.id}`}</p>
      <p>{`Name: ${data.getRandomPlayer.name}`}</p>
      <p>{`Team: ${data.getRandomPlayer.team}`}</p>
      <p>{`Age: ${data.getRandomPlayer.age}`}</p>
      <p>{`Games: ${data.getRandomPlayer.games}`}</p>
    </div>
  );
}

// Use ApolloProvider to provide the Apollo Client instance to your React app
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="flex bg-sky-50 h-screen">
        <PlayerCard />
        <Player></Player>
      </div>
    </ApolloProvider>
  );
}


export default App;
