#1 Data Models
Product:

id (int) (autoincrements) (primary key)
name (string)
description (string)
price (float/decimal)
image_url (string)
category (string)

Order:

order_id (int) (autoincrements) (primary key)
created_at (Datetime) (created automatically)
customer_id (int)
total_price (float decimal)
status (string) — the order's fulfillment state. Allowed values:
    "completed"   (order has completed)
    "pending"      (order in process, default when order created)
    "cancelled"   (order voided)
email (string)
OrderItem[] (list of OrderItems)


OrderItem:
order_item_id (int) (autoincrements)
order_id (int) (references Order order_id) (foreign key)
product_id (int) (references Product id) (foreign key)
quantity (int)
price (float/decimal) price = Product.price × quantity (stored as snapshot at order time)

Cascade Rules:
Deleting a Product should delete any OrderItem that references it by product_id

Deleting an Order should delete any OrderItem that references it by order_id

#2 API contract

GET /products  
Fetch list of all products

route params: None
body fields:  None

Query Parameters: (all optional)
  category — string. Filters products to only those whose category matches
             exactly (e.g. ?category=Clothing).
  sort     — string. Orders the results by the given field, ascending.
             Allowed values: "price", "name" (e.g. ?sort=price or ?sort=name).

Default behavior (no query params provided): return all products, unordered.

Examples:
  GET /products                      → all products, unordered
  GET /products?category=Clothing    → only Clothing products
  GET /products?sort=price           → all products, cheapest first
  GET /products?category=Clothing&sort=name → Clothing products, sorted by name

success: 
200 OK
{
  "products": [
    {
      "id": 1,
      "name": "CodePath Hoodie",
      "description": "Official CodePath hoodie",
      "price": 49.99,
      "image_url": "https://example.com/hoodie.jpg",
      "category": "Clothing"
    },
    {
      "id": 2,
      "name": "CodePath Mug",
      "description": "Coffee mug",
      "price": 14.99,
      "image_url": "https://example.com/mug.jpg",
      "category": "Accessories"
    }
  ]
}
error(s):

500 (internal server error)
{
    "error" : "Internal Server Error"
}
----------------------------
GET /products/:id
Fetch a product by id

route params: id
query params; None
body field: None

success: 
200 OK
{
  "product": {
    "id": 1,
    "name": "CodePath Hoodie",
    "description": "Official CodePath hoodie",
    "price": 49.99,
    "image_url": "https://example.com/hoodie.jpg",
    "category": "Clothing"
  }
}
error(s):


404 (Not Found)
{
    "error" :  "Product not found"
}
----------------------------
POST /products
Add a new product to the database

route params: None
query params; None
body field: 
(All are required)
{
  "name": "string",
  "description": "string",
  "price": "float/decimal",
  "image_url": "string",
  "category": "string"
}

success: 

201 Created
{
  "product": {
    "id": 3,
    "name": "CodePath Sticker Pack",
    "description": "Pack of stickers",
    "price": 4.99,
    "image_url": "https://example.com/stickers.jpg",
    "category": "Accessories"
  }
}

error(s):

400 (Bad Request)
{
    "error" : "Fields {missing_fields} are required"
}

400 (Bad Request)
{
    "error" : "price must be a positive number"
}
----------------------------
Patch /products/:id
Update the details of a product by id

route params: id
query params; None
body field:
(not that any fields that are missing remain the same value)
(Ex: Only update name)
{
  "name": "string",
}

success: 
200 OK
{
  "product": {
    "id": 1,
    "name": "CodePath Hoodie (V2)",
    "description": "Official CodePath hoodie",
    "price": 39.99,
    "image_url": "https://example.com/hoodie.jpg",
    "category": "Clothing"
  }
}

error(s):

400 (Bad Request)
{
    "error" : "price must be a positive number"
}

404 (Not Found)
{
    "error" : "Product not found"
}
----------------------------
PUT /products/:id
Update the details of a product by id

route params: id
query params; None
body field: all fields are required

{
  "name": "string",
  "description": "string",
  "price": "float/decimal",
  "image_url": "string",
  "category": "string"
}

success: 
200 OK
{
  "product": {
    "id": 1,
    "name": "CodePath Hoodie",
    "description": "Blue holdie",
    "price": 49.99,
    "image_url": "image.png",
    "category": "Clothing"
  }
}
error(s):

400 (Bad Request)
{
    "error" : "Field(s) {missing_fields_list} are required"
}

404 (Not Found)
{
    "error" : "Product not found"
}

400 (Bad Request)
{
    "error" : "Price must be a positive number."
}

500 (Interal Server Error)
{
  "error" : "Internal Server Error."
}

----------------------------
DELETE /products/:id
Remove a product from the datebase

route params: id
query params; None
body field: None

success: 
200 OK
{
    "message" : "Product deleted"
}
error(s):

404 (Not Found)
{
    "error" : "Product not found"
}
----------------------------
GET /orders
Fetch a list of all orders (can get orders where email matches)

route params: None
query params; email (string, optional)
body field: Nonei dont 

success: 
200 OK
{
  "orders": [
    {
      "order_id": 1,
      "created_at": "2026-06-22T14:30:00.000Z",
      "customer_id": 7,
      "total_price": 64.97,
      "status": "pending",
      "email": "student@example.com",
      "order_items": [
        { "order_item_id": 1, "order_id": 1, "product_id": 1, "quantity": 1, "price": 49.99 },
        { "order_item_id": 2, "order_id": 1, "product_id": 2, "quantity": 1, "price": 14.99 }
      ]
    }
  ]
}
error(s):

500 (internal server error)
{
    "error" : "Internal Server Error."
}
----------------------------
GET /orders/:order_id
Fetch an order by id

route params: order_id
query params; None
body field: None

success: 
200 OK
{
  "order": {
    "order_id": 1,
    "created_at": "2026-06-22T14:30:00.000Z",
    "customer_id": 7,
    "total_price": 64.97,
    "status": "pending",
    "email": "student@example.com",
    "order_items": [
      { "order_item_id": 1, "order_id": 1, "product_id": 1, "quantity": 1, "price": 49.99 },
      { "order_item_id": 2, "order_id": 1, "product_id": 2, "quantity": 1, "price": 14.99 }
    ]
  }
}
error(s):

404 (Not Found)
{
    "error" : "Order not found"
}
----------------------------
POST /orders
Add a new order to the database

route params: None
query params; None
body field: 
(all fields required)
(note that total_price should be recalculated 
by the server not the client)
{
    "customer_id" : "int",
    "status" : "string",
    "email" : "string",
    "order_items" : [
        { "product_id" : 1, "quantity" : 1 },
        { "product_id" : 2, "quantity" : 1 }
    ]
}
(note: each item only needs product_id and quantity.
 the server looks up price from the Product and computes total_price)

(attributes like order_id do not need to be specified for the OrderItems because they can be derived from the "parent")

success: 
201 Created
{
  "order": {
    "order_id": 1,
    "created_at": "2026-06-22T14:30:00.000Z",
    "customer_id": 7,
    "total_price": 64.97,
    "status": "pending",
    "email": "student@example.com",
    "order_items": [
      { "order_item_id": 1, "order_id": 1, "product_id": 1, "quantity": 1, "price": 49.99 },
      { "order_item_id": 2, "order_id": 1, "product_id": 2, "quantity": 1, "price": 14.99 }
    ]
  }
}

error(s):

400 (Bad Request)
{
    "error" : "email is required"
}

400 (Bad Request)
{
    "error" : "items must contain at least one product"
}

400 (Bad Request)
{
    "error" : "quantity must be at least 1"
}

404 (Not Found)
{
    "error" : "Product not found"
}
----------------------------
PUT /orders/:order_id
Update the details of an order by id

route params: order_id
query params; None
body field: 

(note that total_price is server-computed and cannot be set directly by the client)

{
  "customer_id": "int",
  "status": "string",
  "email": "string",
  "total_price": "number (ignored by server)",
  "order_items": "list of orderItems"
}

success: 
200 OK
{
  "order": {
    "order_id": 1,
    "created_at": "2026-06-22T14:30:00.000Z",
    "customer_id": 7,
    "total_price": 64.97,
    "status": "pending",
    "email": "student@example.com",
    "order_items": {
        .... new order item objects
    }
  }
}
error(s):

400 (Bad Request)
{
    "error" : "email is required"
}

404 (Not Found)
{
    "error" : "Order not found"
}
----------------------------
PATCH /orders/:order_id
Update the details of an order by id

route params: order_id
query params; None
body field: 

Partially update an order (e.g., status only)

(note that total_price is server-computed and cannot be set directly by the client)

{
    "status" : "string",
}

success: 
200 OK
{
  "order": {
    "order_id": 1,
    "created_at": "2026-06-22T14:30:00.000Z",
    "customer_id": 7,
    "total_price": 64.97,
    "status": "pending",
    "email": "student@example.com"
  }
}
error(s):

400 (Bad Request)
{
    "error" : "status is not a valid value"
}

404 (Not Found)
{
    "error" : "Order not found"
}
----------------------------
DELETE /orders/:order_id
Remove an order from the database

route params: order_id
query params; None
body field: None

success: 
200 OK
{
    "message" : "Order deleted"
}
error(s):

404 (Not Found)
{
    "error" : "Order not found"
}

----------------------------
POST /orders/:order_id/items
Adds an order item to an existing order

route params: order_id
query params; None
body field: 

(note: only product_id and quantity are needed. the server looks up price from
the Product and stores price = Product.price × quantity as a snapshot at order time)

{   
    "product_id" : "int",
    "quantity" : "int"
}

success: 
201 Created
{
  "order_item": {
    "order_item_id": 3,
    "order_id": 1,
    "product_id": 2,
    "quantity": 2,
    "price": 14.99
  }
}
error(s):

400 (Bad Request)
{
    "error" : "product_id and quantity are required"
}

400 (Bad Request)
{
    "error" : "quantity must be at least 1"
}

404 (Not Found)
{
    "error" : "Order not found"
}

404 (Not Found)
{
    "error" : "Product not found"
}

----------------------------
Get /order-items
Fetch all order items 

route params: None
query params; None
body field: None

success: 
200 OK
{
  "order_items": [
    { "order_item_id": 1, "order_id": 1, "product_id": 1, "quantity": 1, "price": 49.99 },
    { "order_item_id": 2, "order_id": 1, "product_id": 2, "quantity": 1, "price": 14.99 }
  ]
}
error(s):

500 (internal server error)
{
    "error" : "Internal Server Error."
}

#3 Transaction Workflow

The request body is received containing customer_id, status, email, and an items array, where each item includes a product_id and quantity. An Order record is then created with an auto-generated order_id and created_at timestamp, along with the provided customer_id, status (typically set to “pending” when the order is first created), and email. The total_price is initially calculated as 0 and will be computed based on the order items.

Next, the system iterates through the items array. For each item, it checks whether the referenced product exists in the database. If any product is not found, the entire operation fails and no data is saved to the database. If the product exists, the item total is calculated as product.price × quantity, and this value is accumulated into the order’s total_price. An OrderItem record is then created for each item, storing the order_id (from the newly created order), product_id, quantity, and the calculated price as a snapshot at the time of purchase.

Finally, once all items have been successfully processed, the total_price is updated in the Order record and the transaction is committed, returning the created Order along with its associated OrderItems as a JSON object.

## Decisions Log — Product Model

- **Schema translation that went smoothly**: [e.g., "`price` as Float — Prisma's Float maps cleanly to PostgreSQL DECIMAL for currency"]

- **Field decision I made during implementation that wasn't in the original spec**: [e.g., "Added `@updatedAt` to track when products were last modified — useful for the frontend cache"]

- **Route behavior that needed a spec update**: [e.g., "Spec said `PUT /products/:id` returns 200 with the updated product — confirmed and tested; no spec change needed"]
