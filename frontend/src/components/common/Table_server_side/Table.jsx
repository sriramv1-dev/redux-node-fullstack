import { useMemo, useState } from "react";
import Pagination from "../Pagination/Pagination";
import "./Table.css";
import { paginate } from "../../../utils/paginate";

const TableHeader = ({ columns, sortColumn, sortOrder, handleSort }) => (
  <thead>
    <tr>
      {columns.map(({ key, path, label, sortable = false }) => (
        <th
          role="button"
          tabIndex={0}
          key={path || key}
          onClick={sortable ? () => handleSort(path) : undefined}
        >
          {label}
          {sortColumn === path && (
            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
      ))}
    </tr>
  </thead>
);

const TableBody = ({ data, columns }) => {
  const getNestedValue = (item, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], item);

  const renderCell = (item, { path, content }) =>
    content ? content(item) : getNestedValue(item, path);

  const createKey = (item, { path, key }) => item._id + (path || key);

  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {columns.map((col) => (
            <td key={createKey(item, col)}>{renderCell(item, col)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const Search = ({ handleSearchInputChange }) => (
  <div className="search-input-container">
    <input
      type="text"
      placeholder="Search by any field..."
      className="search-input"
      onChange={(e) => handleSearchInputChange(e.target.value)}
    />
  </div>
);

const ServerSideTable = ({
  title = "Table Data",
  data = [],
  columns = [],
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  sortColumn,
  sortOrder,
  onPageChange,
  onItemsPerPageChange,
  onSearchChange,
  onSortChange,
}) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const handleSort = (columnId) => {
    let newSortOrder = "asc";
    if (columnId === sortColumn) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    onSortChange({ sCol: columnId, sOrder: newSortOrder });
  };

  return (
    <div className="table-container">
      <div className="table-card">
        <h2>{title}</h2>

        <div>
          <Search handleSearchInputChange={onSearchChange} />
        </div>

        <div className="table-body-scroll">
          {data.length === 0 ? (
            <h4>No Data</h4>
          ) : (
            <table className="data-table">
              <TableHeader
                columns={columns}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                handleSort={handleSort}
              />
              <TableBody columns={columns} data={data} />
            </table>
          )}
        </div>

        <Pagination
          itemsCount={totalItems}
          pageSize={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          handleItemsPerPageChange={(e) =>
            onItemsPerPageChange(Number(e.target.value))
          }
        />
      </div>
    </div>
  );
};

export default ServerSideTable;
