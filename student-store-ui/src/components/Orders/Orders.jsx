import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatPrice, formatDate } from "../../utils/format";
import { API_BASE_URL } from "../../config";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // email filter: `emailInput` is the live text field, `activeFilter` is the
  // email that's currently applied (drives the API query + UI messaging).
  const [emailInput, setEmailInput] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsFetching(true);
      try {
        // pass ?email=... when a filter is active — the API filters server-side
        const response = await axios.get(`${API_BASE_URL}/orders`, {
          params: activeFilter ? { email: activeFilter } : {},
        });
        setOrders(response.data.orders);   // note: .orders — matches the API shape
        setError(null);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchOrders();
  }, [activeFilter]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setActiveFilter(emailInput.trim());
  };

  const handleClearFilter = () => {
    setEmailInput("");
    setActiveFilter("");
  };

  if (isFetching) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="Orders">
      <div className="orders-inner">
        <h1 className="orders-title">Your Orders</h1>

        <form className="orders-filter" onSubmit={handleFilterSubmit}>
          <input
            type="email"
            className="orders-filter-input"
            placeholder="Filter by email"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
          />
          <button type="submit" className="orders-filter-btn">
            Filter
          </button>
          {activeFilter && (
            <button
              type="button"
              className="orders-filter-clear"
              onClick={handleClearFilter}
            >
              Show all orders
            </button>
          )}
        </form>

        {activeFilter && (
          <p className="orders-filter-status">
            Showing orders for <strong>{activeFilter}</strong>
          </p>
        )}

        {error && <p className="orders-error">{error}</p>}

        {!error && orders.length === 0 && (
          <p className="orders-empty">
            {activeFilter
              ? `No orders found for "${activeFilter}".`
              : "You haven't placed any orders yet."}
          </p>
        )}

        <ul className="order-list">
          {orders.map((order) => {
            const itemCount = (order.order_items || []).reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <li key={order.order_id} className="order-row">
                <Link to={`/orders/${order.order_id}`} className="order-link">
                  <div className="order-summary">
                    <div className="order-meta">
                      <span className="meta-label">Order placed</span>
                      <span className="meta-value">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="order-meta">
                      <span className="meta-label">Total</span>
                      <span className="meta-value">{formatPrice(order.total_price)}</span>
                    </div>
                    <div className="order-meta">
                      <span className="meta-label">Ship to</span>
                      <span className="meta-value">{order.email}</span>
                    </div>
                    <div className="order-meta">
                      <span className="meta-label">Order #</span>
                      <span className="meta-value">{order.order_id}</span>
                    </div>
                  </div>
                  <div className="order-aside">
                    <span className={`order-status status-${order.status}`}>
                      {order.status}
                    </span>
                    <span className="order-items-count">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                    <span className="order-view">View details &rsaquo;</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Orders;
