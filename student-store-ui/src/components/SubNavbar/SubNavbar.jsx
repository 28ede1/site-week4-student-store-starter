import { Link } from "react-router-dom"
import "./SubNavbar.css"

function SubNavbar({
  activeCategory,
  setActiveCategory,
  searchInputValue,
  handleOnSearchInputChange,
  toggleSidebar,
  getTotalItemsInCart,
}) {
  const categories = ["All Categories", "Accessories", "Apparel", "Books", "Snacks", "Supplies"]
  const cartCount = getTotalItemsInCart ? getTotalItemsInCart() : 0

  return (
    <nav className="SubNavbar">
      {/* Top black bar */}
      <div className="top-bar">
        <Link to="/" className="logo">
          <span className="logo-text">student</span>
          <span className="logo-smile">.store</span>
        </Link>

        <div className="search-bar">
          <select
            aria-label="category filter"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            name="search"
            placeholder="Search the Student Store"
            value={searchInputValue}
            onChange={handleOnSearchInputChange}
          />
          <button className="search-btn" aria-label="search">
            <i className="material-icons">search</i>
          </button>
        </div>

        <button className="cart-btn" onClick={toggleSidebar} aria-label="open cart">
          <div className="cart-icon-wrap">
            <i className="material-icons">shopping_cart</i>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
          <span className="cart-label bold">Cart</span>
        </button>
      </div>

      {/* Category bar */}
      <div className="category-bar">
        <ul className="category-menu">
          {categories.map((cat) => (
            <li className={activeCategory === cat ? "is-active" : ""} key={cat}>
              <button onClick={() => setActiveCategory(cat)}>{cat}</button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default SubNavbar
