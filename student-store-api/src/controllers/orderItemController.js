const OrderItem = require("../models/orderItem")
const Order = require("../models/order")
const Product = require("../models/product")

const addOrderItem = async (req, res) => { 
    try {
        const { order_id } = req.params
        const { product_id, quantity } = req.body

        //validation per spec
        if (!product_id || !quantity) {
            return res.status(400).json({ error: "product_id and quantity are required" })
        }
        if (quantity < 1) {
            return res.status(400).json({ error: "quantity must be at least 1" })
        }

        //the order must already exist
        const order = await Order.findById(order_id)

        if (!order) {
            return res.status(404).json({ error: "Order not found" })
        }

        //the product must exist — and we need its price for the snapshot
        const product = await Product.findById(product_id)

        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }

        const price = Number(product.price) * quantity //price snapshot at order time

        const order_item = await OrderItem.create({
            order_id: Number(order_id),
            product_id: Number(product_id),
            quantity,
            price
        })

        res.status(201).json({ order_item })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}


const getAllOrderItems = async (req, res) => {
    try {
        const order_items = await OrderItem.findAll()
        res.status(200).json({ order_items })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch order items" })
    }
}
module.exports = { addOrderItem, getAllOrderItems }


