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

  const maxVisible = 6;
  const currentChunk = Math.floor((currentPage - 1) / maxVisible);
  const start = currentChunk * maxVisible + 1;
  const end = Math.min(start + maxVisible - 1, pagesCount);

  console.log({
    currentChunk,
    start,
    end,
  });

  return (
    <div className="pagination-controls">
      {pagesCount > 1 && (
        <React.Fragment>
          {/* First Page */}
          <button
            className="pagination-button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First Page
          </button>

          {/* Jump back 6 */}
          <button
            className="pagination-button"
            onClick={() => onPageChange(Math.max(start - maxVisible, 1))}
            disabled={start <= 1}
          >
            &lt;&lt;
          </button>

          {/* Page Numbers */}
          {Array.from({ length: end - start + 1 }, (_, i) => i + start).map(
            (page) => (
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
            )
          )}

          {/* Jump forward 6 */}
          <button
            className="pagination-button"
            onClick={() => onPageChange(Math.min(end + 1, pagesCount))}
            disabled={end >= pagesCount}
          >
            &gt;&gt;
          </button>

          <button
            className="pagination-button"
            onClick={() => onPageChange(pagesCount)}
            disabled={currentPage === pagesCount}
          >
            Last Page
          </button>
        </React.Fragment>
      )}
      {/* Items per Page */}
      <select
        className="items-per-page-selector"
        value={pageSize}
        onChange={(e) => handleItemsPerPageChange(e)}
      >
        {[10, 15, 20, 25, 50, 100].map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
