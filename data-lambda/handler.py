from decimal import Decimal
import boto3
from nba_api.stats.endpoints import leaguedashplayerstats
import pandas

def fetchData(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('NBAPlayerData')
        
        players_df = leaguedashplayerstats.LeagueDashPlayerStats().get_data_frames()[0]
        players_df = players_df[['PLAYER_ID', 'PLAYER_NAME', 'TEAM_ABBREVIATION', 'AGE', 'GP', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'FG_PCT', 'FT_PCT', 'FG3_PCT']]
        players_df = players_df.applymap(lambda x: Decimal(str(x)) if isinstance(x, float) else x)

        players_dict = players_df.to_dict('records')

        response = table.scan()
        items = response['Items']

        items_to_remove = [item for item in items if item not in players_dict]
        items_to_add = [item for item in players_dict if item not in items]
        items_to_update = [item for item in players_dict if item in items]

        # remove
        for item in items_to_remove:
            table.delete_item(Key={ 'PLAYER_ID': item['PLAYER_ID'] })

        for item in items_to_add:
            table.put_item(Item=item)

        for item in items_to_update:
            table.update_item(
                Key={ 'PLAYER_ID': item['PLAYER_ID'] },
                UpdateExpression="set PLAYER_NAME = :n, TEAM_ABBREVIATION = :t, AGE = :age, GP = :gp, PTS = :p, REB = :r, AST = :a, STL = :s, BLK = :b, FG_PCT = :f, FT_PCT = :ft, FG3_PCT = :fg3",
                ExpressionAttributeValues={
                    ':n': item['PLAYER_NAME'],
                    ':t': item['TEAM_ABBREVIATION'],
                    ':age': item['AGE'],
                    ':gp': item['GP'],
                    ':p': item['PTS'],
                    ':r': item['REB'],
                    ':a': item['AST'],
                    ':s': item['STL'],
                    ':b': item['BLK'],
                    ':f': item['FG_PCT'],
                    ':ft': item['FT_PCT'],
                    ':fg3': item['FG3_PCT']
                },
            )
        
        return {
            'statusCode': 200,
            'body': 'NBA Player Data successfully updated from nba_api: https://github.com/swar/nba_api/blob/master/docs/nba_api/stats/endpoints/leaguedashplayerstats.md'
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }