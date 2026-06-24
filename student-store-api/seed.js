const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

async function seed() {
  try {
    console.log('🌱 Seeding database...\n')

    // Clear existing data AND reset the auto-increment id counters back to 1.
    // (deleteMany only removes rows; RESTART IDENTITY resets the sequences.)
    // CASCADE handles the foreign-key relations so order matters less.
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "OrderItem", "Order", "Product" RESTART IDENTITY CASCADE'
    )

    // Load JSON data
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8')
    )

    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/orders.json'), 'utf8')
    )

    // Seed products.
    // The DB assigns its own auto-increment ids (which keep climbing across
    // re-seeds), so map each product's JSON id → the real id it got created with.
    const productIdMap = new Map()
    for (const product of productsData.products) {
      const created = await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          category: product.category,
        },
      })
      productIdMap.set(product.id, created.id)
    }

    // Seed orders and items
    for (const order of ordersData.orders) {
      const createdOrder = await prisma.order.create({
        data: {
          customer_id: order.customer_id,
          total_price: order.total_price,
          status: order.status,
          email: order.email ?? `customer${order.customer_id}@example.com`,
          created_at: new Date(order.created_at),
          order_items: {
            create: order.items.map((item) => ({
              product_id: productIdMap.get(item.product_id),
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      console.log(`✅ Created order #${createdOrder.order_id}`)
    }

    console.log('\n🎉 Seeding complete!')
  } catch (err) {
    console.error('❌ Error seeding:', err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
