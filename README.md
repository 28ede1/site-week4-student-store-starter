📝 `NOTE` Use this template to initialize the contents of a README.md file for your application. As you work on your assignment over the course of the week, update the required or stretch features lists to indicate which features you have completed by changing `[ ]` to `[x]`. (🚫 Remove this paragraph before submitting your assignment.)

## Unit Assignment: Student Store

Submitted by: **Emmanuel Ekpenyong**

Deployed Application (optional): [Student Store Deployed Site](https://site-week4-student-store-starter-frontend.onrender.com/)

### Application Features

#### CORE FEATURES

- [ x] **Database Creation**: Set up a Postgres database to store information about products and orders.
  - [x ]  Use Prisma to define models for `products`, `orders`, and `order_items`.
  - [x ]  **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: Use Prisma Studio to demonstrate the creation of your `products`, `orders`, and `order_items` tables. 
- [x ] **Products Model**
  - [ x] Develop a products model to represent individual items available in the store. 
  - [x ] This model should at minimum include the attributes:
    - [ x] `id`
    - [ x] `name`
    - [ x] `description`
    - [ x] `price` 
    - [ x] `image_url`
    - [ x] `category`
  - [x ] Implement methods for CRUD operations on products.
  - [ x] Ensure transaction handling such that when an product is deleted, any `order_items` that reference that product are also deleted. 
  - [ x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: Use Prisma Studio to demonstrate the creation of all attributes (table columns) in your Products Model.
- [ x] **Orders Model**
  - [ x] Develop a model to manage orders. 
  - [x ] This model should at minimum include the attributes:
    - [ x] `order_id`
    - [ x] `customer_id`
    - [ x] `total_price`
    - [x ] `status`
    - [x ] `created_at`
  - [x ] Implement methods for CRUD operations on orders.
  - [ x] Ensure transaction handling such that when an order is deleted, any `order_items` that reference that order are also deleted. 
  - [x ] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: Use Prisma Studio to demonstrate the creation of all attributes (table columns) in your Order Model.

- [x ] **Order Items Model**
  - [ x] Develop a model to represent the items within an order. 
  - [ x] This model should at minimum include the attributes:
    - [ x] `order_item_id`
    - [ x] `order_id`
    - [ x] `product_id`
    - [ x] `quantity`
    - [ x] `price`
  - [x ] Implement methods for fetching and creating order items.  
  - [ x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: Use Prisma Studio to demonstrate the creation of all attributes (table columns) in your Order Items Model.
- [ x] **API Endpoints**
  - [x ] Application supports the following **Product Endpoints**:
    - [x ] `GET /products`: Fetch a list of all products.
    - [ x] `GET /products/:id`: Fetch details of a specific product by its ID.
    - [x ] `POST /products`: Add a new product to the database.
    - [x ] `PUT /products/:id`: Update the details of an existing product.
    - [x ] `DELETE /products/:id`: Remove a product from the database.
  - [ x] Application supports the following **Order Endpoints**:
    - [ x] `GET /orders`: Fetch a list of all orders.
    - [ x] `GET /orders/:order_id`: Fetch details of a specific order by its ID, including the order items.
    - [ x] `POST /orders`: Create a new order with specified order items.
    - [x ] `PUT /orders/:order_id`: Update the details of an existing order (e.g., change status).
    - [x ] `DELETE /orders/:order_id`: Remove an order from the database.
    - [ x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: Use Postman or another API testing tool to demonstrate the successful implementation of each endpoint. For the `DELETE` endpoints, please use Prisma Studio to demonstrate that any relevant order items have been deleted. 
- [ x] **Frontend Integration**
  - [ x] Connect the backend API to the provided frontend interface, ensuring dynamic interaction for product browsing, cart management, and order placement. Adjust the frontend as necessary to work with your API.
  - [ x] Ensure the home page displays products contained in the product table.
  - [x ] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: Use `npm start` to run your server and display your website in your browser. 
    - [ x] Demonstrate that users can successfully add items to their shopping cart, delete items from their shopping cart, and place an order
    - [x ] After placing an order use Postman or Prisma Studio demonstrate that a corresponding order has been created in your orders table.

### Stretch Features

- [x ] **Added Endpoints**
  - [ x] `GET /order-items`: Create an endpoint for fetching all order items in the database.
  - [x ] `POST /orders/:order_id/items` Create an endpoint that adds a new order item to an existing order. 
- [x ] **Past Orders Page**
  - [x ] Build a page in the UI that displays the list of all past orders.
  - [ x] The page lists all past orders for the user, including relevant information such as:
    - [ x] Order ID
    - [ x] Date
    - [ x] Total cost
    - [ x] Order status.
  - [ x] The user should be able to click on any individual order to take them to a separate page detailing the transaction.
  - [ x] The individual transaction page provides comprehensive information about the transaction, including:
    - [x ] List of order items
    - [x ] Order item quantities
    - [x ] Individual order item costs
    - [x ] Total order cost
- [x ] **Filter Orders**.
  - [x ] Create an input on the Past Orders page of the frontend application that allows the user to filter orders by the email of the person who placed the order. 
  - [ x] Users can type in an email and click a button to filter the orders.
  - [x ] Upon entering an email address and submitting the input, the list of orders is filtered to only show orders placed by the user with the provided email. 
  - [x ] The user can easily navigate back to the full list of orders after filtering. 
    - [x ] Proper error handling is implemented, such as displaying "no orders found" when an invalid email is provided.
- [ x] **Deployment**
  - [x ] Website is deployed using [Render](https://courses.codepath.org/snippets/site/render_deployment_guide).
  - [ x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: To ease the grading process, please use the deployed version of your website in your walkthrough with the URL visible. 

### Walkthrough Video

https://www.loom.com/share/ab107da5235c413fbc1fa25912acc133 


### Reflection

* Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

The labs gave me a solid foundation for the core work — defining Prisma models, running migrations, and wiring up basic CRUD routes for the products, orders, and order_items tables felt familiar after practicing them. Where I felt less prepared was the relational/transaction handling: making sure that deleting a product or an order also cleaned up the related order_items took some extra reading on cascading deletes in Prisma. Connecting the backend to the existing frontend was also trickier than the labs suggested, especially getting the cart state and the order placement flow to talk to my API correctly.

* If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.

If I had more time I would have spent more of it on the frontend polish and on input validation. On the data side, I'd add better validation and error messages on the order endpoints so the API fails gracefully instead of returning raw errors. I'd also have liked to add real user accounts so the "past orders" page filtered by a logged-in user automatically instead of relying on typing in an email, and to add loading/empty states throughout the UI so it feels more responsive.

* Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

What went well was the end-to-end flow: adding items to the cart, placing an order, and then seeing that order show up in the database and on the past-orders page. Deploying to Render and getting the frontend to use the correct API base URL through an environment variable was a good learning moment after a couple of failed attempts with hardcoded URLs. What didn't go as smoothly was tracking down small UI bugs, like a checkout field that was mislabeled. From my peers I'd like to try writing tests for the API endpoints next time, since a few of them did that and it made debugging much faster for them.

### Open-source libraries used

- Add any links to open-source libraries used in your project.

### Shout out

Give a shout out to somebody from your cohort that especially helped you during your project. This can be a fellow peer, instructor, TA, mentor, etc.