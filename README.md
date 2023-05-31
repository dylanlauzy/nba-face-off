# NBA Face-Off

A competitive, multiplayer, web-based card game designed around real-time NBA player statistics. Developed using React, Apollo GraphQL, AWS Lambda, DynamoDB, Serverless, and Python.

## Overview

In NBA Face-Off, you go head-to-head in a card game that tests your NBA knowledge and luck. Each player is given a random collection of 12 NBA player cards, each with a player's stats from the past season. Each round, you draw a random player and then must choose one of those player's stats that you believe will outdo your opponent's. If you're successful, your opponent's card is added to your deck and you get to pick again. If not, the tables turn. The player who successfully takes all of their opponent's cards is crowned the winner.

<img width="1323" alt="image" src="https://github.com/dylanlauzy/nba-face-off/assets/64353872/3d055fc9-9978-404c-8433-14178543b8fe">

## Features

- Real-time player stats: Game data is refreshed in real-time using the NBA API.
- Dynamic Frontend: The game's interface was prototyped in Figma and then built with React, Apollo Client and Tailwind CSS.
- Serverless backend: AWS Lambda function is used to populate the DynamoDB database with real-time player stats, and the application is deployed using Serverless.
- API: GraphQL API was developed for querying randomized player statistics from DynamoDB using Apollo Server.
- Multiplayer functionality [In development]: Compete against friends or foes across the globe.


## Local Development

To get started developing locally, you will need the API URI (please contact the developer for this). follow these steps:

1. Clone this repo and `cd` into the directory:

    ```
    git clone https://github.com/username/nba-face-off.git
    cd nba-face-off
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Within the client folder, create a .env file with the variable REACT_APP_API_URI set to the apps URI:

    ```env
    REACT_APP_API_URI=<URI>
    ```

4. Run the local development server:

    ```
    cd client
    npm start
    ```

The application should now be running on `localhost:3000`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Ensure that your PRs are up-to-date with the main branch.

## License

NBA Face-Off is open-source software [licensed as MIT](LICENSE.md).

## Contact

If you have any questions, feel free to reach out or raise an issue. We'd be happy to help.
