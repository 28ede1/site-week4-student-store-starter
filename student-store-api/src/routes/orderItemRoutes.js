const express = require("express")
const router = express.Router()

router.get("/", getAllOrderItems)


module.exports = router;
