﻿# Backend of Peerhub
This is the backend of peerhub. 
## scripts
### npm start
#### runs the index.js file
    `NODE_ENV=production node index.js`
### npm test
#### runs all tests
    `NODE_ENV=test jest --verbose --runInBand`
### npm run dev
#### runs the server in developement mode.
    `NODE_ENV=development nodemon index.js`
### npm run lint
#### runs lint to check if coding standards are met as defined in .eslintrc.js
    `eslint .`
