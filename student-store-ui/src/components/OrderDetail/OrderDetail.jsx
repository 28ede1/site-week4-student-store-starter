import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NotFound from "../NotFound/NotFound";
import { formatPrice, formatDate } from "../../utils/format";
import { API_BASE_URL } from "../../config";
import "./OrderDetail.css";

function OrderDetail({ products = [] }) {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${order_id}`);
        setOrder(response.data.order);   // note: .order — matches the API shape
        setError(null);
      } catch (err) {
        setError("Failed to load order.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchOrder();
  }, [order_id]);

  if (error) {
    return <NotFound />;
  }

  if (isFetching || !order) {
    return <h1>Loading...</h1>;
  }

  // Resolve product details for each line item from the products already loaded in App
  const productById = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});

  const items = order.order_items || [];

  return (
    <div className="OrderDetail">
      <div className="order-detail-inner">
        <Link to="/orders" className="back-link">
          &lsaquo; Back to your orders
        </Link>

        <div className="order-header">
          <div>
            <h1 className="order-detail-title">Order #{order.order_id}</h1>
            <p className="order-detail-date">Placed on {formatDate(order.created_at)}</p>
          </div>
          <span className={`order-status status-${order.status}`}>{order.status}</span>
        </div>

        <div className="order-detail-grid">
          <section className="order-items-card">
            <h2 className="section-title">Items</h2>
            <ul className="item-list">
              {items.map((item) => {
                const product = productById[item.product_id];
                return (
                  <li key={item.order_item_id} className="item-row">
                    <div className="item-media">
                      <img
                        src={product?.image_url || "/placeholder.png"}
                        alt={product?.name || `Product #${item.product_id}`}
                      />
                    </div>
                    <div className="item-info">
                      {product ? (
                        <Link to={`/${product.id}`} className="item-name">
                          {product.name}
                        </Link>
                      ) : (
                        <span className="item-name">Product #{item.product_id}</span>
                      )}
                      <span className="item-qty">Quantity: {item.quantity}</span>
                    </div>
                    <div className="item-price">{formatPrice(item.price)}</div>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="order-info-card">
            <h2 className="section-title">Order summary</h2>
            <dl className="summary-list">
              <div className="summary-row">
                <dt>Status</dt>
                <dd className="capitalize">{order.status}</dd>
              </div>
              <div className="summary-row">
                <dt>Email</dt>
                <dd>{order.email}</dd>
              </div>
              <div className="summary-row">
                <dt>Customer ID</dt>
                <dd>{order.customer_id}</dd>
              </div>
              <div className="summary-row total">
                <dt>Total</dt>
                <dd>{formatPrice(order.total_price)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
