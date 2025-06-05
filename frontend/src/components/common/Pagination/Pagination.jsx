import React from "react";

import "../Pagination/Pagination.css";

const Pagination = ({
  itemsCount,
  pageSize,
  currentPage,
  onPageChange,
  handleItemsPerPageChange,
}) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);

  return (
    <div className="pagination-controls">
      {pagesCount > 1 && (
        <React.Fragment>
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: pagesCount }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${
                currentPage === page ? "active" : "inactive"
              }`}
              disabled={currentPage === page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pagesCount}
          >
            Next
          </button>
        </React.Fragment>
      )}
      <select
        className="items-per-page-selector"
        value={pageSize}
        onChange={(e) => handleItemsPerPageChange(e)}
      >
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default Pagination;
