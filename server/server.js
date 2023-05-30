import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { readFileSync } from 'fs';
// import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js';
import AWS from 'aws-sdk';

const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url)).toString('utf-8');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const resolvers = {
  Query: {
    getRandomPlayers: async (_, { count }) => {
      const params = {
        TableName: "NBAPlayerData",
        ProjetionExpression: "PLAYER_ID",
        FilterExpression: "GP >:value",
        ExpressionAttributeValues: {
          ':value': 30
        }
      }
    
      let players;
    
      try {
        players = await dynamoDB.scan(params).promise();
      } catch (error) {
        console.error("DynamoDB error:", error);
        return null;
      }
    
      let randomIndexes = new Set();
      while(randomIndexes.size < count) {
        randomIndexes.add(Math.floor(Math.random() * players.Items.length));
      }
    
      let playerData = [];
      for (let index of randomIndexes) {
        const getPlayerParams = {
          TableName: "NBAPlayerData",
          Key: {
            PLAYER_ID: players.Items[index].PLAYER_ID
          }
        }
    
        try {
          let player = await dynamoDB.get(getPlayerParams).promise();
          player = player.Item;
          player = {
            id: player.PLAYER_ID,
            name: player.PLAYER_NAME,
            age: player.AGE,
            team: player.TEAM_ABBREVIATION,
            games: player.GP ,
            pts: player.PTS ,
            reb: player.REB ,
            ast: player.AST ,
            stl: player.STL ,
            blk: player.BLK ,
            fgPct: player.FG_PCT ,
            ftPct: player.FT_PCT ,
            fg3Pct: player.FG3_PCT ,
          }
    
          playerData.push(player);
        } catch (error) {
          console.error("DynamoDB error:", error);
          return null;
        }
      }
    
      return playerData;
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
