import ShoppingCart from "../ShoppingCart/ShoppingCart"
import "./Sidebar.css"

function Sidebar({ cart, isOpen, products, userInfo, setUserInfo, toggleSidebar, handleOnCheckout, isCheckingOut, order, setOrder, error }) {
  return (
    <section className={`Sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="drawer-header">
        <div className="title">
          <i className="material-icons">shopping_cart</i>
          <span>Your Cart</span>
        </div>
        <button className="close-button" onClick={toggleSidebar} aria-label="close cart">
          <i className="material-icons">close</i>
        </button>
      </div>

      <div className="wrapper">
        <ShoppingCart
          isOpen={isOpen}
          cart={cart}
          products={products}
          toggleSidebar={toggleSidebar}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          handleOnCheckout={handleOnCheckout}
          isCheckingOut={isCheckingOut}
          error={error}
          order={order}
          setOrder={setOrder}
        />
      </div>
    </section>
  )
}

export default Sidebar
