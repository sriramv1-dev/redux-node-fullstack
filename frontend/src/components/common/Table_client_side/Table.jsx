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
      onChange={handleSearchInputChange}
    />
  </div>
);

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
    if (searchTerm && searchTerm.trim() === "") return data;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    // nested properties:
    const getValue = (obj, path) => {
      return path.split(".").reduce((acc, part) => acc?.[part], obj);
    };

    return [...filteredData].sort((a, b) => {
      const aVal = getValue(a, sortColumn) ?? "";
      const bVal = getValue(b, sortColumn) ?? "";

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

  return (
    <div className="table-container">
      {data.length === 0 ? (
        <h4>No Data</h4>
      ) : (
        <div className="table-card">
          <h2 className="table-title">User Data Table</h2>

          <Search handleSearchInputChange={handleSearchInputChange} />

          <div className="table-body-scroll">
            <table className="data-table">
              <TableHeader
                columns={columns}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                handleSort={handleSort}
              />
              <TableBody columns={columns} data={paginatedData} />
            </table>
          </div>

          <Pagination
            itemsCount={sortedData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;

/**
 *
 * Movie management app:
 * Display the movies
 * Each movie has director, genre, music,production, releaseYear, title
 * in future there will new objects for director, genre, music, production, hero, heroine, cinematography, etc.
 * Need scope to expand the movie to include these future connections
 * My data is currently in Google firebase. Do you suggest any other database?
 * If yes, then which one?
 * If no then how to design the database efficiently?
 *
 * I want to implement below features:
 * View all movies, CRUD operations on each movie.
 * Scope to expand this for future new objects.
 *
 * Center of the app is the playground:
 * where we play dumbcharades.
 * These movies are in Telugu language.
 * when the play starts, we randomly select a movie, for the user to enact it.
 * Having a timer is optional, they can play as their wish.
 *
 * the crux of the thing is we need to be able to rate the movie based on enactment.
 * The app should be able to learn and update the rating (how to design that??/)
 *
 * we can have the settings app to control the time of play,
 * Difficulty rating
 * Provide a hint on how to enact.
 * More features to come.
 *
 *
 * Add different roles to the app:
 * Admin, AuthenticatedPlayer,  Player mode:
 * Admin: Logged in with previlages who can perform all the operations
 * AuthenticatedPlayer: can view all the movies, (future objects like music, production, etc.)
 * Player: has access only to the playground.
 *
 *
 */
