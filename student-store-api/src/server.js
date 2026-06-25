const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Student Store Web App Now Running.")
});

app.use("/products", require("./routes/productRoutes"))
app.use("/orders", require("./routes/orderRoutes"))
app.use("/order-items", require("./routes/orderItemRoutes" /* → routes */))

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

