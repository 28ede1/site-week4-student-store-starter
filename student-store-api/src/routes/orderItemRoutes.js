const express = require("express")
const router = express.Router()

const { getAllOrderItems } = require("../controllers/orderItemController")

router.get("/", getAllOrderItems)


module.exports = router;
