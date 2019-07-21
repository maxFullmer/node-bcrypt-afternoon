const bcrypt = require('bcrypt');

module.exports = {
    register: async (req, res, next) => {
        // What is coming in to server from the client request body? (username, password, isAdmin)
        const { username, password, isAdmin } = req.body;

        // Get the database instance and run the sql file
        const db = req.app.get('db');
        //SQL NEEDS ARRAY DATA
        const result = await db.get_user([username]);

        // SQL queries come back in an array
        const existingUser = result[0];

        // If existingUser is defined, send a response with status 409 and the text 'Username taken');
        if(existingUser) {
            res.status(409).send("Seat's taken (ehem I mean username is taken)")
        }
        //Otherwise create a salt for the password
        console.log(password)
        const salt = bcrypt.genSaltSync(10);
        console.log(salt);
        const hash = bcrypt.hashSync(password, salt);
         //remember, SQL NEEDS ARRAY DATA
        const registeredUser = await db.register_user([isAdmin, username, hash]);
        const user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        return res.status(201).send(req.session.user);
        },

        login: async (req, res) => {
            const { username, password } = req.body;
            const db = req.app.get('db');

            const result = await db.get_user(username);
            const user = result[0];
            if (!user) {
                res.status(401).send('User not found. Please register as a new user before logging in.');
            }
            const isAuthenticated = bcrypt.compareSync(password, user.hash);
            if (!isAuthenticated) {
                res.status(403).send('Incorrect username/password');
            }
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
            }
            res.status(200).send(req.session.user);
        },

        logout: async (req, res) => {
            req.session.destroy();
            res.sendStatus(200);
        }
}