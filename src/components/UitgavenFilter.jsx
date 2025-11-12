import React from 'react';

export default function UitgavenFilter({ filters, setFilters }) {
  const categorieën = [
    'alle',
    'boodschappen',
    'transport',
    'entertainment',
    'wonen',
    'overig'
  ];

  const handleMonthChange = (e) => {
    setFilters(prev => ({
      ...prev,
      maand: e.target.value === 'alle' ? 'alle' : parseInt(e.target.value)
    }));
  };

  const handleYearChange = (e) => {
    setFilters(prev => ({
      ...prev,
      jaar: parseInt(e.target.value)
    }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({
      ...prev,
      categorie: e.target.value
    }));
  };

  const resetFilters = () => {
    setFilters({
      maand: new Date().getMonth() + 1,
      jaar: new Date().getFullYear(),
      categorie: 'alle'
    });
  };

  return (
    <div className="uitgaven-filters">
      <div className="filter-group">
        <label htmlFor="maand">Maand:</label>
        <select 
          id="maand" 
          value={filters.maand} 
          onChange={handleMonthChange}
        >
          <option value="alle">Alle maanden</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(maand => (
            <option key={maand} value={maand}>
              {new Date(2024, maand - 1).toLocaleString('nl-NL', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="jaar">Jaar:</label>
        <select 
          id="jaar" 
          value={filters.jaar} 
          onChange={handleYearChange}
        >
          {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map(jaar => (
            <option key={jaar} value={jaar}>{jaar}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="categorie">Categorie:</label>
        <select 
          id="categorie" 
          value={filters.categorie} 
          onChange={handleCategoryChange}
        >
          {categorieën.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button 
        onClick={resetFilters}
        className="reset-filters-button"
        type="button"
      >
        Reset Filters
      </button>
    </div>
  );
}