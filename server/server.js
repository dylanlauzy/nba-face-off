import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { readFileSync } from 'fs';
import { DynamoDBClient, GetItemCommand, ScanCommand,  BatchGetItemCommand, PutItemCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url)).toString('utf-8');
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

function convertDynamoDBResponse(data) {
  const result = {};

  for (const key in data) {
    if (data[key].hasOwnProperty('S')) {
      result[key] = data[key]['S'];
    } else if (data[key].hasOwnProperty('L')) {
      result[key] = data[key]['L'].map(convertDynamoDBResponse);
    } else if (data[key].hasOwnProperty('M')) {
      result[key] = convertDynamoDBResponse(data[key]['M']);
    }
  }

  return result;
}

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
    createGame: async (_, { name }) => {
      const newItem = {
        id: {S: uuidv4()},
        name: {S: name ? name: "New Game" },
        status: {S: "Waiting"},
        deleteAt: {S: String(Math.floor((Date.now() / 1000) + (60*60*24)))} // time for AWS in seconds - delete in a day
      }

      const params = {
        Item: newItem,
        TableName: "NBA-face-off-games",
      }

      try {
        const command = new PutItemCommand(params);
        const response = await dynamoDB.send(command);
        return {
          id: newItem.id.S,
          name: newItem.name.S,
          status: newItem.status.S,
          deleteAt: newItem.deleteAt.S
        };
      } catch (error) {
        console.error("DynamoDB error:", error)
        return null;
      }
    },
    joinGame: async(_, { gameId, player}) => {
      const updateParams = {
        Key: { id: { S: gameId }},
        TableName: "NBA-face-off-games",
        ConditionExpression: "attribute_not_exists(players) OR size(players) < :maxSize",
        UpdateExpression: "SET players = list_append(if_not_exists(players, :emptyList), :newPlayer)",
        ExpressionAttributeValues: {
          ":maxSize": { N: "2" },
          ":emptyList": { L: []},
          ":newPlayer": {L: [{
            M: {
              id: { S: player.id },
              name: { S: player.name },
              cards: {L: [] }
            }
          }]},
        },
        ReturnValues: "ALL_NEW",
      }

      try {
        const command = new UpdateItemCommand(updateParams);
        const response = await dynamoDB.send(command);
        return convertDynamoDBResponse(response.Attributes);
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    removeFromGame: async(_, { gameId, playerId }) => {
      const getParams = {
        TableName: "NBA-face-off-games",
        Key: { id: { S: gameId } },
        ProjectionExpression: "players",
      }

      try {
        const getCommand = new GetItemCommand(getParams);
        const response = await dynamoDB.send(getCommand);
        const updatedPlayers = response.Item.players.L.filter(player => player.M.id.S != playerId);
        
        const updateParams = {
          Key: { id: { S: gameId }},
          TableName: "NBA-face-off-games",
          UpdateExpression: "SET players = :updated",
          ExpressionAttributeValues: {
            ":updated": { L: updatedPlayers },
          },
          ReturnValues: "ALL_NEW",
        }

        const updateCommand = new UpdateItemCommand(updateParams);
        const updateResponse = await dynamoDB.send(updateCommand);
        return convertDynamoDBResponse(updateResponse.Attributes);
      } catch(error) {
        console.error(error);
        return null;
      }
    }
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
