const app = require('express')()
const consign = require('consign')
const db = require('./config/db.js')
const path = require('path');

const HTTP_PORT = process.env.APP_PORT || 3001

app.db  = db;

consign( { cwd:  'src' })
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app)

app.listen(HTTP_PORT, ()=>{
    console.log(`Listening on port ${HTTP_PORT}`)
    console.log("GCVI-NFT Backend Running");
})
