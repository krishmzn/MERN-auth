const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./src/routes/userRoutes');


const app = express();


app.use(bodyParser.json());

app.use("/api", userRouter);



app.get("/", (req, res) => {
    res.send("Hello")
});






app.listen(3000, () => console.log('Server started on port 3000'));
console.log('app.js');