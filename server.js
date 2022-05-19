const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./src/db');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql/schema');
const path = require('path');
const { authenticate } = require('./src/middleware/auth');
const cookieParser = require('cookie-parser')
const { userData } = require('./src/middleware/userData')

dotenv.config();

const app = express();
// connecting a database
connectDB();

app.use(cookieParser())

//routes
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

app.use(express.urlencoded({ extended: true }))


// setting view engine 
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, '/src/templates/views'))

// Middleware (authentication)
app.use(authenticate)
app.use(userData)

// initialized Routes 
require('./src/routes')(app)

app.listen(process.env.PORT, () => {
    console.log(`server now runs at PORT ${process.env.PORT}`)
})