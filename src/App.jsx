import { useState, useEffect } from 'react';
import './App.css';
const App = () => {
  const [data, setData] = useState({
    cameras: [],
    headphones: [],
    laptops: [],
    smartphones: [],
    Scanners: [],
    smartwatches: [],
    iPads: [],
    Printers: [],
    GPUs: [],
    speakers: [],
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [activeSection, setActiveSection] = useState('cameras');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection, search, filter]);

  useEffect(() => {
    const sections = ['cameras', 'headphones', 'laptops', 'smartphones', 'smartwatches', 'iPads', 'GPUs', 'Printers', 'speakers', 'Scanners'];
    sections.forEach(section => {
      fetch(`/${section}.json`)
        .then((res) => res.json())
        .then((items) => setData(prev => ({ ...prev, [section]: items })));
    });
  }, []);

  const currentData = data[activeSection]
    .filter((item) =>
      search
        ? item.Title.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((item) =>
      filter ? item.BrandName?.toLowerCase().includes(filter.toLowerCase()) : true
    );

  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const getPaginationRange = (totalPages, currentPage) => {
    const range = [];
    const totalVisible = 5; 
  
    if (totalPages <= totalVisible) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const left = Math.max(currentPage - 2, 1);
      const right = Math.min(currentPage + 2, totalPages);
  
      for (let i = left; i <= right; i++) {
        range.push(i);
      }
  

    }
  
    return range;
  };
  
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>TechStore</h1>
          <div className="search-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <input
                type="text"
                placeholder="Filter by brand..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        {Object.keys(data).map((section) => (
          <button
            key={section}
            className={`tab-button ${activeSection === section ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      <main className="main-content">
        <div className="product-grid">
          {paginatedData.map((item, index) => (
            <div key={index} className="product-card">
              <div className="product-image-container">
                <img
                  src={item['Image URL']}
                  alt={item.Title}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <h3 className="product-title">{item.Title}</h3>
                <p className="product-brand">Brand: {item['Brand Name']}</p>
                <p className="product-brand">Total Reviews: {item['Total Reviews']}</p>
                <p className="product-price">{item.Price}</p>
                <div className="product-rating">
                  <span className="rating-stars">
                    {'★'.repeat(Math.floor(item.Rating))}
                    {'☆'.repeat(5 - Math.floor(item.Rating))}
                  </span>
                  <span className="rating-number">{item.Rating}/5</span>
                </div>
                <a
                  href={item.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  View Product
                </a>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
  <div className="pagination">
    <button
      className="pagination-button"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {getPaginationRange(totalPages, currentPage).map((page, index) =>
      page === "..." ? (
        <span key={index} className="pagination-dots">
          ...
        </span>
      ) : (
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      )
    )}

    <button
      className="pagination-button"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}
      </main>

      <footer className="footer">
        <p>© 2025 TechStore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;