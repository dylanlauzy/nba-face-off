import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import Players from './components/Players';

const API_URI = process.env.REACT_APP_API_URI;

const client = new ApolloClient({
  uri: API_URI,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Players/>
    </ApolloProvider>
  );
}


export default App;
