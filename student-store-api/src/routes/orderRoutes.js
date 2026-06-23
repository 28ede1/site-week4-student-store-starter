const express = require("express")
const router = express.Router()

const { getAllOrders, getOrderById, createOrder, UpdateOrderById, PatchOrderById, deleteOrder } = require("../controllers/orderController")
const { addOrderItem} = require("../controllers/orderItemController")


router.get("/", getAllOrders)
router.get("/:order_id", getOrderById)
router.post("/", createOrder)
router.put("/:order_id", UpdateOrderById)
router.patch("/:order_id", PatchOrderById)
router.delete("/:order_id", deleteOrder)
router.post("/:order_id/items", addOrderItem)

module.exports = router;
