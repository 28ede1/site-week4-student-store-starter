const Order = require("../models/order")
const Product = require("../models/product")

//only allow the statuses defined in the spec
const allowedStatuses = ["completed", "pending", "cancelled"]

// Look up each product, validate quantity, and build the priced items + total.
// total_price is ALWAYS computed here (server-side), never trusted from the client.
// Returns { error, status } on failure, or { itemsData, total_price } on success.
const buildPricedItems = async (order_items) => {
    let total_price = 0
    const itemsData = [] //what we'll hand to the model

    for (const item of order_items) {
        if (!item.quantity || item.quantity < 1) {
            return { error: "Quantity must be at least 1.", status: 400 }
        }

        const product = await Product.findById(item.product_id)
        if (!product) {
            return { error: "Product not found.", status: 404 }
        }

        const unitPrice = Number(product.price) //unit price snapshot at order time
        total_price += unitPrice * item.quantity //line total contributes to the order total

        itemsData.push({
            product_id: item.product_id,
            quantity: item.quantity,
            price: unitPrice, //store the per-unit price, matching seed/frontend convention
        })
    }

    return { itemsData, total_price }
}

const getAllOrders = async (req, res) => { 
    try {

        const {email} = req.query //from ?email=...
        const orders = await Order.findAll({email})

        res.status(200).json({orders}) //wrap in {} so that you will have an orders key
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

const getOrderById = async (req, res) => { 
    try {
        const {order_id} = req.params 
        const order = await Order.findById(order_id)

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
        let{ customer_id, status, email, order_items } = req.body


        //validation per spec (status omitted → model defaults it to "pending")
        const required = { customer_id, email, order_items }
        status = status || "pending"
        const missing = Object.keys(required).filter((key) => required[key] === undefined)
        if (missing.length > 0) {
            return res.status(400).json({ error: `Fields {${missing.join(", ")}} are required.` })
        }

        if (!order_items || order_items.length === 0) {
            return res.status(400).json({ error: "Items must contain at least one product." })
        }

        //build the items + compute total_price from the Product table (not the client)
        const priced = await buildPricedItems(order_items)
        if (priced.error) {
            return res.status(priced.status).json({ error: priced.error })
        }

        const order = await Order.create({
            customer_id,
            status,
            total_price: priced.total_price,
            email,
            order_items: priced.itemsData,
        })

        res.status(201).json({ order })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

// PATCH /orders/:order_id — partial update of ANY field(s)
const PatchOrderById = async (req, res) => {
    try {
        const { order_id } = req.params
        const { customer_id, status, email, order_items } = req.body

        //check it exists first → clean 404 instead of a thrown prisma error
        const existing = await Order.findById(order_id)
        if (!existing) {
            return res.status(404).json({ error: "Order not found." })
        }

        //if status is being changed, it must be one of the allowed values
        if (status !== undefined && !allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Status is not a valid value" })
        }

        //only recompute items + total_price if the client actually sent items
        const fields = { customer_id, status, email }
        if (order_items !== undefined) {
            const priced = await buildPricedItems(order_items)
            if (priced.error) {
                return res.status(priced.status).json({ error: priced.error })
            }
            fields.total_price = priced.total_price
            fields.order_items = priced.itemsData
        }

        const order = await Order.update(order_id, fields)

        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

// PUT /orders/:order_id — full replace
const UpdateOrderById = async (req, res) => {
    try {
        const { order_id } = req.params
        const { customer_id, status, email, order_items } = req.body

        const required = {customer_id, status, email, order_items}
        const missing = Object.keys(required).filter((key) => required[key] === undefined)
        if (missing.length > 0) {
            return res.status(400).json({ error: `Fields {${missing.join(", ")}} are required.` })
        }

        if (!email) {
            return res.status(400).json({ error: "email is required" })
        }

        //check it exists first → clean 404 instead of a thrown prisma error
        const existing = await Order.findById(order_id)
        if (!existing) {
            return res.status(404).json({ error: "Order not found" })
        }

        //status (if sent) must be a valid value
        if (status !== undefined && !allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "status is not a valid value" })
        }

        const fields = { customer_id, status, email }

        //a full replace recomputes total_price from the products (never trust the client)
        if (order_items !== undefined) {
            const priced = await buildPricedItems(order_items)
            if (priced.error) {
                return res.status(priced.status).json({ error: priced.error })
            }
            fields.total_price = priced.total_price
            fields.order_items = priced.itemsData
        }

        const order = await Order.update(order_id, fields)

        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

// DELETE /orders/:order_id
const deleteOrder = async (req, res) => {
    try {
        const { order_id } = req.params

        const existing = await Order.findById(order_id)
        if (!existing) {
            return res.status(404).json({ error: "Order not found" })
        }

        await Order.delete(order_id)

        res.status(200).json({ message: "Order deleted" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}


module.exports = { getAllOrders, getOrderById, createOrder, PatchOrderById, UpdateOrderById, deleteOrder }
