const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 8081;
const crypto = require("crypto");
require('dotenv').config();

const config = {
    connectionString:
        "postgres://sd_db_user:aCJKXgIOBWIJltqaTSHZZcepRRsGGePO@dpg-cik2amdph6euh7jbad30-a.singapore-postgres.render.com/sd_db?ssl=true"
};

const { Client } = require('pg');
const { constants } = require("buffer");
const client = new Client(config);
client.connect()

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit:50000 }));

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

function GenerateJWT(_userId, _email, _username)
{
  return jwt.sign(
      { userId: _userId, email: _email, username: _username},
      process.env.TOKEN_KEY,
      { expiresIn: "24h" }
    );
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) =>
    {
      if (err)
      {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  }
  else
  {
    res.sendStatus(401);
  }
}

app.get('/', async (req, res) => {
    res.status(200).send("OK");
  })