import json
import boto3
from nba_api.stats.endpoints import leaguedashplayerstats
import pandas as pd

def fetchData(event, context):
    player_stats = leaguedashplayerstats.LeagueDashPlayerStats()
    df = player_stats.get_data_frames()[0]
    # df = df[['PLAYER_ID', 'PLAYER_NAME', 'TEAM_ABBREVIATION', 'GP', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'FG_PCT', 'FT_PCT', 'FG3_PCT']]
    df = df[['PLAYER_ID', 'PLAYER_NAME']]
    
    dynamodb = boto3.resource('dynamodb')
    table_name = 'NBAPlayerData'

    table = dynamodb.Table(table_name)
    table.load()

    for index, row in df.iterrows():
        table.put_item(
            Item={
                'Id': row['PLAYER_ID'],
                'Name': row['PLAYER_NAME']
            }
        )