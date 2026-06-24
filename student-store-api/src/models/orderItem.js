const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

class OrderItem {

    // GET /ordersItems
    static async findAll() {
        return prisma.orderItem.findMany()
    }

    // POST /orders/:order_id/items

    static async create({ order_id, product_id, quantity, price} = {}) {
        return prisma.orderItem.create({
          data: {
            order_id,
            product_id,
            quantity,
            price 
          },
        });
      }

}

module.exports = OrderItem