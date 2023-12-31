const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRouter = require('./src/routes/userRoutes');


const app = express();

app.use(bodyParser.json());
app.use(cors());

// setting auth api api
app.use("/api", userRouter);


// homepage
app.get("/", (req, res) => {
    res.send("Hello")
});


// starting server
app.listen(5000, () => console.log('Server listening on port 5000'));