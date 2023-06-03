import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { readFileSync } from 'fs';
import { DynamoDBClient, ScanCommand, BatchGetItemCommand  } from '@aws-sdk/client-dynamodb';

const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url)).toString('utf-8');
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

const resolvers = {
  Query: {
    getRandomPlayers: async (_, { count }) => {
      const params = {
        TableName: "NBAPlayerData",
        ProjectionExpression: "PLAYER_ID",
        FilterExpression: "GP >:value",
        ExpressionAttributeValues: {
          ':value': { N: '30'}
        }
      }
    
      let players;
    
      try {
        const command = new ScanCommand(params);
        players = await dynamoDB.send(command);
      } catch (error) {
        console.error("DynamoDB error:", error);
        throw new Error("Failed to get players from DynamoDB");
      }
    
      let randomIndexes = new Set();
      let chosenPlayers = [];
      while(randomIndexes.size < count) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * players.Items.length);
        } while (randomIndexes.has(newIndex))
        randomIndexes.add(newIndex);
        chosenPlayers.push(players.Items[newIndex])
      }

      
      const getPlayerParams = {
        RequestItems: {
          NBAPlayerData: {
            Keys: chosenPlayers.map(player => ({
              PLAYER_ID: { N: player.PLAYER_ID.N}
            }))
          }
        }
      }
      
      let playerData;
      try {
        const command = new BatchGetItemCommand(getPlayerParams);
        const response = await dynamoDB.send(command);

        playerData = response.Responses.NBAPlayerData.map((player) => ({
          id: player.PLAYER_ID.N,
          name: player.PLAYER_NAME.S,
          age: player.AGE.N,
          team: player.TEAM_ABBREVIATION.S,
          games: player.GP.N ,
          pts: player.PTS.N ,
          reb: player.REB.N ,
          ast: player.AST.N ,
          stl: player.STL.N ,
          blk: player.BLK.N ,
          fgPct: player.FG_PCT.N ,
          ftPct: player.FT_PCT.N ,
          fg3Pct: player.FG3_PCT.N ,
        }))
      } catch (error) {
        console.error("DynamoDB error:", error);
        return null;
      }
  
    
      return playerData;
    },
  },

  Mutation: {

  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


// Develop server locally
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`server started at: ${url}`)


// Host server to AWS

// export const graphqlHandler = startServerAndCreateLambdaHandler(
//   server,
//   handlers.createAPIGatewayProxyEventV2RequestHandler(),
// );
