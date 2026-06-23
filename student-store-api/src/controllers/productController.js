const prisma = require("../db/db")

// GET /products
const getAllProducts = async (req, res) => {
    try {
        const { category, sort } = req.query //both optional: ?category=...&sort=...

        //only sort by fields we explicitly allow
        const allowedSorts = ["price", "name"]

        const products = await prisma.product.findMany({
            where: category ? { category } : undefined,
            orderBy: allowedSorts.includes(sort) ? { [sort]: "asc" } : undefined,
        })
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// GET /products/:id
const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        })

        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }

        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// POST /products
const createProduct = async (req, res) => {
    try {
        const { name, description, price, image_url, category } = req.body

        //collect whichever required fields are missing
        const required = { name, description, price, image_url, category }
        const missing = Object.keys(required).filter((key) => required[key] === undefined)
        if (missing.length > 0) {
            return res.status(400).json({ error: `Fields ${missing.join(", ")} are required` })
        }

        if (typeof price !== "number" || price <= 0) {
            return res.status(400).json({ error: "price must be a positive number" })
        }

        const product = await prisma.product.create({
            data: { name, description, price, image_url, category },
        })
        res.status(201).json({ product })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// PATCH /products/:id
const PatchProductById = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, image_url, category } = req.body

        const existing = await prisma.product.findUnique({ where: { id: Number(id) } })
        if (!existing) {
            return res.status(404).json({ error: "Product not found" })
        }

        //if price is being changed, it must still be positive
        if (price !== undefined && (typeof price !== "number" || price <= 0)) {
            return res.status(400).json({ error: "price must be a positive number" })
        }

        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, description, price, image_url, category }, //undefined fields are ignored by prisma
        })
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// PUT /products/:id
const UpdateProductById = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, image_url, category } = req.body

        const existing = await prisma.product.findUnique({ where: { id: Number(id) } })
        if (!existing) {
            return res.status(404).json({ error: "Product not found" })
        }

        //PUT replaces the whole resource, so all fields are required
        const required = { name, description, price, image_url, category }
        const missing = Object.keys(required).filter((key) => required[key] === undefined)
        if (missing.length > 0) {
            return res.status(400).json({ error: `Field(s) ${missing.join(", ")} are required` })
        }

        if (typeof price !== "number" || price <= 0) {
            return res.status(400).json({ error: "price must be a positive number" })
        }

        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, description, price, image_url, category },
        })
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// DELETE /products/:id
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const existing = await prisma.product.findUnique({ where: { id: Number(id) } })
        if (!existing) {
            return res.status(404).json({ error: "Product not found" })
        }

        await prisma.product.delete({ where: { id: Number(id) } })
        res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = { getAllProducts, getProductById, createProduct, PatchProductById, UpdateProductById, deleteProduct }
