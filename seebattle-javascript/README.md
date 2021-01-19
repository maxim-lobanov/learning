# SeeBattle

You can play with bot AI in singleplayer or with live opponent in multiplayer.
AI of bot has simple algorithm. If there are hurt ships that were not destoryed it tries to destroy them fully.
Else it make random shot to free cells.

Server is the simple NodeJS application that uses Express. It processes logic of game and allow two people play each other.
It

## How to run:
+ Develop
  + `npm run start` - run "react-scripts start" to start client (PORT 3000 by default) (it uses 3001 port as proxy to support server)
  + `npm run srv` - run "nodemon server/app.js" to start server (PORT 3001 by default)
+ Production
  + `npm run build` - run "react-scripts build" to build application to "build\" folder
  + `npm run srvrun` - run "node server/app.js" to start server (PORT 3001 by default)
