import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../NotFound/NotFound";
import { formatPrice } from "../../utils/format";
import { API_BASE_URL } from "../../config";
import "./ProductDetail.css";

function ProductDetail({ addToCart, removeFromCart, getQuantityOfItemInCart }) {
  
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        setProduct(response.data.product);   // note: .product — matches your API shape
        setError(null);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (error) {
    return <NotFound />;
  }

  if (isFetching || !product) {
    return <h1>Loading...</h1>;
  }

  const quantity = getQuantityOfItemInCart(product);

  const handleAddToCart = () => {
    if (product.id) {
      addToCart(product)
    }
  };

  const handleRemoveFromCart = () => {
    if (product.id) {
      removeFromCart(product);
    }
  };

  return (
    <div className="ProductDetail">
      <div className="product-card">
        <div className="media">
          <img src={product.image_url || "/placeholder.png"} alt={product.name} />
        </div>
        <div className="product-info">
          <p className="product-name">{product.name}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>
          <div className="actions">
            <button onClick={handleAddToCart}>Add to Cart</button>
            {quantity > 0 && <button onClick={handleRemoveFromCart}>Remove from Cart</button>}
            {quantity > 0 && <span className="quantity">Quantity: {quantity}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


export default ProductDetail;