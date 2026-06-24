const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

class Order {

    // GET /orders
    static async findAll({email} = {}) {
        return prisma.order.findMany({
            where: email ? {email} : undefined,
            include: { order_items: true }
        })
    }

    // GET /orders/:order_id

    static async findById(order_id) {
        return prisma.order.findUnique({
            where: {order_id : Number(order_id)},
            include: { order_items:true }
        })
    }

    // POST /orders
    static async create({ customer_id, total_price, status, email, order_items } = {}) {

        // assumes that order_items is in this format:
        // EX: { "order_item_id": 1, "order_id": 1, "product_id": 1, "quantity": 1, "price": 49.99 }
        // with the price for the order item already summed

        // assumes total_price was already calculated
        return prisma.order.create({
            data: {
              customer_id,
              total_price,
              status,
              email,
              order_items: { // prisma allows you to do nested create
                create: order_items
              }
            },
            include: {
              order_items: true
            }
          });
        }
    
    // PATCH / PUT /orders/:order_id -- undefined fields are ignored by prisma
    static async update(order_id, {customer_id, status, email, total_price, order_items} = {}) {
        const data = { customer_id, status, email, total_price }

        // Pass the recalculated total_price and the fully 
        // constructed order_items array, where each item includes all required fields

        // only touch items if the caller actually sent them (PUT / full replace)
        if (order_items !== undefined) {
            data.order_items = {
                deleteMany: {},
                create: order_items,
            }
        }

        return prisma.order.update({
            where: { order_id: Number(order_id) },
            data,
            include: {
            order_items: true
            }
        });
        }
    
    static async delete(order_id) {
        return prisma.order.delete({
            where:  {order_id : Number(order_id)}
        })
    }
}

module.exports = Order