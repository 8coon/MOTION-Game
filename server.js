'use strict';

const fs = require('fs');
const express = require('express');

const path = `${__dirname}/../../dist/`;
const app = express();


app.use('/', express.static(`${__dirname}/dist`));
app.use('/game', express.static(`${__dirname}/game`));
app.use('/babylonjs', express.static(`${__dirname}/node_modules/babylonjs`));


app.get('/', (req,res) => {
    res.sendFile(__dirname + '/game/game.html');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sample Application server listening on port ${PORT}!`);
    console.log(`JSWorks is in ${path}`);
});
