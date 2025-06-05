import { useMemo, useState } from "react";
import Pagination from "../Pagination/Pagination";
import "../Table/Table.css";
import { paginate } from "../../../utils/paginate";

const TableHeader = ({ columns, sortColumn, sortOrder, handleSort }) => {
  return (
    <thead>
      <tr>
        {columns.map(({ key, path, label, sortable = false }) => (
          <th
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
};

const Table = ({ data = [], columns = [] }) => {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setPageSize(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (columId) => {
    if (columId === sortColumn) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columId);
      setSortOrder("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (searchTerm && searchTerm.trim === "") {
      return data;
    }

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a?.[sortColumn] ?? "";
      const bVal = b?.[sortColumn] ?? "";
      const isString = typeof aVal === "string" && typeof bVal === "string";

      return sortOrder === "asc"
        ? isString
          ? aVal.localeCompare(bVal)
          : aVal - bVal
        : isString
        ? bVal.localeCompare(aVal)
        : bVal - aVal;
    });
  }, [filteredData, sortColumn, sortOrder]);

  const paginatedData = paginate(sortedData, currentPage, pageSize);

  if (data.length === 0) return <div className="table-container">No Data</div>;

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <h2 className="table-title">User Data Table</h2>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by any field..."
            className="search-input"
            onChange={handleSearchInputChange}
          />
        </div>
        <table className="data-table">
          <TableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            handleSort={handleSort}
          />
          <tbody>
            {paginatedData.map(({ _id, name, username, email, phone }) => {
              return (
                <tr key={`tr_${_id}`}>
                  <td>{name}</td>
                  <td>{username}</td>
                  <td>{email}</td>
                  <td>{phone}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination
          itemsCount={sortedData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default Table;
