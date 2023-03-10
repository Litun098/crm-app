const express = require('express');
const { mongoose } = require('mongoose');
const { DB_URL } = require('./config/db.config')
const User = require('./models/user.model');
const bcrypt = require('bcrypt');
const constants = require('./utils/constants');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const ticketRouter = require('./routes/ticket.routes');
require('dotenv').config();



const app = express()

mongoose.connect(DB_URL);
app.use(express.json());
authRouter(app);
userRouter(app);
ticketRouter(app);

const db = mongoose.connection;
db.on('error', () => console.log("Can't connect to DB"))
db.on('open', () => {
    console.log("Connected to DB")
    // init()
})



const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server is running at port", port);
})


// This was for testing purpose
async function init() {
    let user = await User.findOne({ userId: "admin" });

    if (user) {
        console.log("Admin user already present", user);
        return;
    }
    try {
        let user = await User.create({
            name: "Litun",
            userId: "admin",
            email: "admin@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("welcome1", 10),
            userStatus: constants.userStatus.approved
        })
        console.log(user);
    } catch (err) {
        console.log(err.message);
    }
}
