import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
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

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Players />} />
          <Route path="/create-game" element={<CreateGame />} />
          <Route path="/lobby/:id" element={<Lobby />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}


export default App;
