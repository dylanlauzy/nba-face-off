import { ApolloServer } from '@apollo/server';

import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors'; 
import express from 'express';
import bodyParser from 'body-parser';

import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { readFileSync } from 'fs';

import resolvers from './resolvers/resolvers.js';
const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url)).toString('utf-8');

// Develop server locally
const schema = makeExecutableSchema({ typeDefs, resolvers});

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({ 
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        }
      }
    }
  ]
});

await server.start();
app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));
  
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`server started at: http://localhost:${PORT}/graphql`)
})