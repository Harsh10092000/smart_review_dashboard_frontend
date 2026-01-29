import React from "react";
import "./table.css";

const TableHead = ({theadArray, onSort}) => {
  const handleSortClick = (item) => {
    if (item.sortable && onSort) {
      onSort(item.field);
    }
  };

  const getSortIcon = (item) => {
    if (!item.sortable) return null;
    
    if (item.currentSort === 'asc') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '6px' }}>
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      );
    } else if (item.currentSort === 'desc') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '6px' }}>
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '6px', opacity: 0.3 }}>
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      );
    }
  };

  return (
      <div className="div-table-header">
        {theadArray.map((item, index) => (
        <div 
          key={index}
          className={`div-table-cell ${item.customClass ? item.customClass : ""} ${item.sortable ? 'sortable-header' : ''}`}
          onClick={() => handleSortClick(item)}
          style={{ cursor: item.sortable ? 'pointer' : 'default' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{item.value}</span>
            {getSortIcon(item)}
          </div>
        </div>
        ))}
      </div>
  );
};

export default TableHead;