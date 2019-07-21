module.exports = {
    dragonTreasure: async (req, res) => {
        //use a getter method inside the request object so we can get/read the db, store it in var db so we can do this over and over
        const db = req.app.get('db');

        //this request (what we want) involves some SQL commands 
        // (get_dragon_treasure(), which takes in an array of values that will be argued in the SQL methods)
        const treasure = await db.get_dragon_treasure([1]);
        //we return as a response: what we wanted/was requested (makes sense)
        return res.status(200).send(treasure)
    },

    getUserTreasure: async (req, res) => {
        const db = req.app.get('db');
        const {id} = req.session.user;

        const userTreasure = await db.get_user_treasure([id]);
        return res.status(200).send(userTreasure)
    },

    addUserTreasure: async (req, res) => {
        const db = req.app.get('db');
        const {treasureUrl} = req.body;
        const {id} = req.session.user;

        const userTreasure = await db.add_user_treasure([treasureUrl,id]);
        return res.status(200).send(userTreasure)
    }
}