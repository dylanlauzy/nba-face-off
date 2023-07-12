import { PubSub, withFilter } from 'graphql-subscriptions';
import { DynamoDBClient, GetItemCommand, ScanCommand,  BatchGetItemCommand, PutItemCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall, convertToAttr, convertToNative } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const pubsub = new PubSub();

const teams =['ATL', 'BOS', 'CLE','MIA','OKC','GSW','HOU','BKN','CHA','CHI','DAL','DEN','DET','IND','LAC','LAL','MEM','MIL','MIN','NOP','NYK','ORL','PHI','PHX','POR','SAC','SAS','TOR','UTA','WAS']

const randomTeam = () => {
  return teams[teams.length * Math.random() << 0]
}

const getRandomPlayers = async (count) => {
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
}

const resolvers = {
  Query: {
    getRandomPlayers: async (_, { count }) => getRandomPlayers(count),
    getGameState: async (_, { gameId }) => {
      const input = {
        TableName: "NBA-face-off-games",
        Key: {id: {S: gameId}},
        ProjectionExpression: "id, #N, players, #S",
        ExpressionAttributeNames: {
          "#N": "name",
          "#S": "status"
        }
      }
      
      try {
        const command = new GetItemCommand(input);
        const response = await dynamoDB.send(command);
        return unmarshall(response.Item);
      } catch (error) {
        console.error("DynamoDB error:", error);
        return { status: 404, error };
      }
    }
  },

  Mutation: {
    createGame: async (_, { name, player }) => {
      const newItem = {
        id: uuidv4(),
        name: name ? name: "New Game" ,
        status: "Waiting",
        deleteAt: Math.floor((Date.now() / 1000) + (60*60*24)), // time for AWS in seconds - delete in a day
        players: [{
          id: player.id ? player.id : "1",
          name: player.name,
          team: player.team ? player.team : randomTeam(),
          cards: []
        }]
      }

      const params = {
        Item: marshall(newItem),
        TableName: "NBA-face-off-games",
      }

      try {
        const command = new PutItemCommand(params);
        const response = await dynamoDB.send(command);
        pubsub.publish('GAME_UPDATE', { getGameState: newItem });
        return newItem;
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
              id: player.id ? { S: player.id } : { S: "2"},
              name: { S: player.name },
              team: player.team ? { S: player.team } : { S: randomTeam() },
              cards: {L: [] }
            }
          }]},
        },
        ReturnValues: "ALL_NEW",
      }

      try {
        const command = new UpdateItemCommand(updateParams);
        const response = await dynamoDB.send(command);
        const data = unmarshall(response.Attributes)
        pubsub.publish('GAME_UPDATE', { getGameState: data });
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    removeFromGame: async(_, { gameId, playerId }) => {
      try {
        const getParams = {
          TableName: "NBA-face-off-games",
          Key: { id: { S: gameId } },
          ProjectionExpression: "players",
        }

        const getCommand = new GetItemCommand(getParams);
        const response = await dynamoDB.send(getCommand);
        const updatedPlayers = response.Item.players.L.filter(player => player.M.id.S != playerId);
        
        const updateParams = {
          Key: { id: { S: gameId }},
          TableName: "NBA-face-off-games",
          UpdateExpression: "SET players = :updated",
          ExpressionAttributeNames: {
            ":updated": { L: updatedPlayers },
          },
          ReturnValues: "ALL_NEW",
        }

        const updateCommand = new UpdateItemCommand(updateParams);
        const updateResponse = await dynamoDB.send(updateCommand);
        return unmarshall(updateResponse.Attributes);
      } catch(error) {
        console.error(error);
        return null;
      }
    },
    startGame: async (_, { gameId }) => {
      try {
        const getParams = {
          TableName: "NBA-face-off-games",
          Key: { id: { S: gameId } },
          ProjectionExpression: "#S, players",
          ExpressionAttributeNames: {
            "#S": "status"
          }
        }

        const CARDS_EACH = 12;

        const getCommand = new GetItemCommand(getParams);
        const response = await dynamoDB.send(getCommand);

        const status = response.Item.status.S;
        if(status != "Waiting") throw new Error("Game is not startable");

        let players = response.Item.players.L;
        if(players.length != 2) throw new Error("Not enough players");

        players[0].M.cards.L = [];
        players[0].M.cardsLeft = convertToAttr(CARDS_EACH / 2);
        players[1].M.cards.L = [];
        players[1].M.cardsLeft = convertToAttr(CARDS_EACH / 2);

        const cards = await getRandomPlayers(CARDS_EACH);

        for(let i = 0; i < cards.length; i++) {
          if(i % 2 == 0) {
            players[0].M.cards.L.push(convertToAttr(cards[i]));
          } else {
            players[1].M.cards.L.push(convertToAttr(cards[i]));
          }
        }
        
        const updateParams = {
          Key: { id: { S: gameId }},
          TableName: "NBA-face-off-games",
          UpdateExpression: "SET players = :players, #S = :status",
          ExpressionAttributeValues: {
            ":players": { L: players },
            ":status": { S: "Active" }
          },
          ExpressionAttributeNames: {
            "#S": "status"
          },
          ReturnValues: "ALL_NEW",
        }

        const updateCommand = new UpdateItemCommand(updateParams);
        const updateResponse = await dynamoDB.send(updateCommand);
        const data = unmarshall(updateResponse.Attributes);
        pubsub.publish("GAME_UPDATE", { getGameState: data });
        return data;
      } catch(error) {
        console.error(error);
        return { status: 404 };
      }
    },
    chooseStat: async (_ , { gameId, playerId, stat }) => {
      
    }
  },
  Subscription: {
    getGameState: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['GAME_UPDATE']),
        (payload, variables) => {
          return (
            payload.getGameState.id == variables.gameId
          )
        }
      ),
    }
  }
};

export default resolvers; 