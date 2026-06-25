import ProductGrid from "../ProductGrid/ProductGrid"
import "./Home.css"

function Home({ isFetching, products, addToCart, removeFromCart, searchInputValue, getQuantityOfItemInCart, activeCategory }) {

  // Filters products by the active category if it is not 'All Categories'.
  const productsByCategory =
    Boolean(activeCategory) && activeCategory !== "All Categories"
      ? products.filter((p) => p.category === activeCategory)
      : products

  // Then further filters by the search input value if it is not empty.
  const productsToShow = Boolean(searchInputValue)
    ? productsByCategory.filter((p) => p.name.toLowerCase().indexOf(searchInputValue.toLowerCase()) !== -1)
    : productsByCategory

  const heading =
    activeCategory && activeCategory !== "All Categories" ? activeCategory : "Today's deals for students"

  return (
    <div className="Home">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to the Student Store</h1>
          <p>Everything you need for campus — apparel, books, supplies & snacks.</p>
        </div>
      </div>

      <div className="section-heading">
        <h2>{heading}</h2>
      </div>

      {isFetching ? (
        <div className="loading">Loading products…</div>
      ) : (
        <ProductGrid
          products={productsToShow}
          isFetching={isFetching}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          getQuantityOfItemInCart={getQuantityOfItemInCart}
        />
      )}
    </div>
  )
}

export default Home
