const express = require("express")
const router = express.Router()

const { getAllProducts, getProductById, createProduct, PatchProductById, UpdateProductById, deleteProduct } = require("../controllers/productController")

router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/", createProduct)
router.patch("/:id", PatchProductById)
router.put("/:id", UpdateProductById)
router.delete("/:id", deleteProduct)

module.exports = router;
