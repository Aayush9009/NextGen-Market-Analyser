import React, { useState, useMemo, useRef, useEffect } from "react";
import stockImage from "./assets/STOCKANALYZERIMAGE.png";
import "./StockAnalyzer.css";

const stockSymbols = Array.from({ length: 100 }, (_, i) =>
  `STK${String(i + 1).padStart(3, "0")}`
);

function StockEvaluator() {
  const [selectedStock, setSelectedStock] = useState("");
  const [evaluationType, setEvaluationType] = useState("fundamental");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [fundamentalData, setFundamentalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stockSymbols;
    return stockSymbols.filter((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // New useEffect to handle scrolling after data is loaded
  useEffect(() => {
    if (fundamentalData) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [fundamentalData]);

  const handleSearchSelect = (sym) => {
    setSelectedStock(sym);
    setSearchQuery(sym);
    setShowDropdown(false);
  };

  const handleEvaluate = async () => {
    if (!selectedStock) {
      alert("Please select a stock!");
      return;
    }

    if (evaluationType === "fundamental") {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/stock/${selectedStock}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFundamentalData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching fundamental data:", err);
      } finally {
        setLoading(false);
      }
    } else if (evaluationType === "llm") {
      window.open("https://market-analyze.onrender.com", "_blank");
    }
  };

  return (
    <div className="stock-container">
      <div className="main-content">
        <div className="left-half">
          <img src={stockImage} alt="Stock Visual" className="stock-image" />
        </div>

        <div className="right-half">
          <div className="center-content-right">
            <div className="search-container" ref={searchRef}>
              <div className="search-label">Select Stock</div>
              <input
                type="text"
                placeholder="Search stock..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="stock-search-input"
              />
              {showDropdown && filteredStocks.length > 0 && (
                <ul className="stock-dropdown">
                  {filteredStocks.map((sym) => (
                    <li key={sym} onClick={() => handleSearchSelect(sym)}>
                      {sym}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="evaluation-dropdown-container">
              <label htmlFor="evaluation-type" className="search-label">
                Choose Analyzer
              </label>
              <select
                id="evaluation-type"
                className="evaluation-dropdown"
                value={evaluationType}
                onChange={(e) => setEvaluationType(e.target.value)}
              >
                <option value="fundamental">Fundamental Analysis</option>
                <option value="llm">Quantitative Analysis (AI)</option>
              </select>
            </div>

            <button className="evaluate-btn" onClick={handleEvaluate} disabled={loading}>
              {loading ? "Loading..." : "Evaluate"}
            </button>
            {error && (
              <div className="error-message">
                <h3>Error</h3>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {fundamentalData && (
        <div className="full-width-analysis-section">
          <h2>Analysis for {fundamentalData.stockSymbol}</h2>
          <div className="analysis-summary">
            <h4>Summary</h4>
            <p>{fundamentalData.summary}</p>
          </div>
          <div className="detailed-feedback">
            <h4>Detailed Analysis</h4>
            <div className="feedback-grid">
              {Object.entries(fundamentalData.feedback).map(([key, value]) => (
                <div key={key} className="feedback-item">
                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockEvaluator;