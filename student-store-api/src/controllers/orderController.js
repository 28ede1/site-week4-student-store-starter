const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const getAllOrders = async (req, res) => { 
    try {

        const {email} = req.query //from ?email=...
        const orders = await prisma.order.findMany ({
            where: email ? {email} : undefined,
            include: { order_items: true }, //needed to manually have order_items list included
        })

        res.status(200).json({orders}) //wrap in {} so that you will have an orders key
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

const getOrderById = async (req, res) => { 
    try {
        const {order_id} = req.params 
        const order = await prisma.order.findUnique ({
            where: { order_id: Number(order_id) },
            include: { order_items: true }, //needed to manually have order_items list included
        })

        if (!order) {
            return res.status(404).json({ error: "Order not found." })
        }

        res.status(200).json({order}) //wrap in {} so that you will have an orders key
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}
const createOrder = async (req, res) => { 
    try {
        const { customer_id, status, email, order_items } = req.body

        //validation per spec
        if (!email) {
            return res.status(400).json({ error: "Email is required." })
        }
        if (!order_items || order_items.length === 0) {
            return res.status(400).json({ error: "Order_items must contain at least one product" })
        }

        //build the items + compute total_price from the Product table (not the client)
        let total_price = 0
        const itemsData = [] //what we'll hand to prisma

        for (const item of order_items) {
            if (!item.quantity || item.quantity < 1) {
                return res.status(400).json({ error: "quantity must be at least 1" })
            }

            const product = await prisma.product.findUnique({
                where: { id: item.product_id },
            })
            if (!product) {
                return res.status(404).json({ error: "Product not found" })
            }

            const linePrice = Number(product.price) * item.quantity //price snapshot
            total_price += linePrice

            itemsData.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: linePrice,
            })
        }

        //nested write: create the order AND its order_items in one call
        const order = await prisma.order.create({
            data: {
                customer_id,
                status,
                email,
                total_price,
                order_items: { create: itemsData }, //prisma inserts these + links order_id automatically
            },
            include: { order_items: true },
        })

        res.status(201).json({ order })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

const PatchOrderById = async (req, res) => { 
    try {
        const { order_id } = req.params
        const { status } = req.body

        const existing = await prisma.order.findUnique({
            where: { order_id: Number(order_id) },
        })
        if (!existing) {
            return res.status(404).json({ error: "Order not found" })
        }

        const order = await prisma.order.update({
            where: { order_id: Number(order_id) },
            data: { status },
        })

        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

const UpdateOrderById = async (req, res) => { 
    try {
        const { order_id } = req.params
        const { customer_id, status, email } = req.body

        if (!email) {
            return res.status(400).json({ error: "email is required" })
        }

        //check it exists first → clean 404 instead of a thrown prisma error
        const existing = await prisma.order.findUnique({
            where: { order_id: Number(order_id) },
        })
        if (!existing) {
            return res.status(404).json({ error: "Order not found" })
        }

        const order = await prisma.order.update({
            where: { order_id: Number(order_id) },
            data: { customer_id, status, email }, //note: no total_price
        })

        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

const deleteOrder = async (req, res) => { 
    try {
        const { order_id } = req.params

        const existing = await prisma.order.findUnique({
            where: { order_id: Number(order_id) },
        })
        if (!existing) {
            return res.status(404).json({ error: "Order not found" })
        }

        await prisma.order.delete({
            where: { order_id: Number(order_id) },
        })

        res.status(200).json({ message: "Order deleted" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}


module.exports = { getAllOrders, getOrderById, createOrder, PatchOrderById, UpdateOrderById, deleteOrder }
