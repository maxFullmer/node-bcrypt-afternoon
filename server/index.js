require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./controllers/authController.js');
const treasureCtrl = require('./controllers/treasureController.js');
const auth = require('./authMiddleware.js');

const app = express();
const PORT = 4000;
const { CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(express.json());
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('Connected to database');
});

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)

//user authentication
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);
//treasure
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));