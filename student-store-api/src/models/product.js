const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

//only sort by fields we explicitly allow
const allowedSorts = ["price", "name"]

// Product data-access layer: each method wraps a Prisma Client call
class Product {
    // GET /products — optional category filter and sort
    static async findAll({ category, sort } = {}) {
        return prisma.product.findMany({
            where: category ? { category } : undefined,
            orderBy: allowedSorts.includes(sort) ? { [sort]: "asc" } : undefined,
        })
    }

    // GET /products/:id
    static async findById(id) {
        return prisma.product.findUnique({
            where: { id: Number(id) },
        })
    }

    // POST /products
    static async create({ name, description, price, image_url, category }) {
        return prisma.product.create({
            data: { name, description, price, image_url, category },
        })
    }

    // PATCH / PUT /products/:id — undefined fields are ignored by prisma
    static async update(id, { name, description, price, image_url, category }) {
        return prisma.product.update({
            where: { id: Number(id) },
            data: { name, description, price, image_url, category },
        })
    }

    // DELETE /products/:id
    static async delete(id) {
        return prisma.product.delete({
            where: { id: Number(id) },
        })
    }
}

module.exports = Product
