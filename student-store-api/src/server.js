const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Student Store Web App Now Runnings.")
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

