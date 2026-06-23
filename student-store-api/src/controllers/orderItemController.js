const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

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
        const order = await prisma.order.findUnique({
            where: { order_id: Number(order_id) },
        })
        if (!order) {
            return res.status(404).json({ error: "Order not found" })
        }

        //the product must exist — and we need its price for the snapshot
        const product = await prisma.product.findUnique({
            where: { id: product_id },
        })
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }

        const price = Number(product.price) * quantity //price snapshot at order time

        const order_item = await prisma.orderItem.create({
            data: {
                order_id: Number(order_id), //here we DO set it — the order already exists
                product_id,
                quantity,
                price,
            },
        })

        res.status(201).json({ order_item })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}


const getAllOrderItems = async (req, res) => {
    try {
        const order_items = await prisma.orderItem.findMany()
        res.status(200).json({ order_items })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch order items" })
    }
}
module.exports = { addOrderItem, getAllOrderItems }


