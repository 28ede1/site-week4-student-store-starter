import { Link } from "react-router-dom"
import codepath from "../../assets/codepath.svg"
import { formatPrice } from "../../utils/format"
import "./ProductCard.css"

function ProductCard({ product, quantity, addToCart, removeFromCart }) {
  return (
    <div className="ProductCard">
      <Link to={`/${product.id}`} className="media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <img src={codepath} alt={product.name} />
        )}
      </Link>

      <div className="product-info">
        <Link to={`/${product.id}`} className="product-name">
          {product.name}
        </Link>

        <span className="category-tag">{product.category}</span>

        <div className="price">
          <span className="price-symbol">$</span>
          <span className="price-whole">{formatPrice(product.price).replace("$", "")}</span>
        </div>

        <div className="actions">
          {quantity ? (
            <div className="stepper">
              <button className="step minus" onClick={removeFromCart} aria-label="remove one">
                <i className="material-icons">remove</i>
              </button>
              <span className="qty">{quantity}</span>
              <button className="step plus" onClick={addToCart} aria-label="add one">
                <i className="material-icons">add</i>
              </button>
            </div>
          ) : (
            <button className="add-btn" onClick={addToCart}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
