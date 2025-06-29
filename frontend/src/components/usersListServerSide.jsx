import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // addMultipleUsers,
  deleteUser,
  fetchUsersWithPagination,
  setItemsPerPage,
  setPage,
  setSearchTerm,
  setSort,
} from "../reducers/usersSlice";
import AddUserForm from "./AddUser/AddUserForm";
import ServerSideTable from "./common/Table_server_side/Table";

const UsersListServerSide = () => {
  const {
    users,
    totalUsers,
    totalPages,
    currentPage,
    itemsPerPage,
    sortColumn,
    sortOrder,
    searchTerm,
  } = useSelector((state) => state.ur);

  const [showForm, setShowForm] = useState(false);

  // const userStatus = useSelector((state) => state.ur.status);
  const dispatch = useDispatch();

  // const handleBulkExport = () => {
  //   dispatch(addMultipleUsers(users));
  // };

  const handleDeleteUser = (user) => {
    dispatch(deleteUser(user._id));
  };

  useEffect(() => {
    dispatch(
      fetchUsersWithPagination({
        page: currentPage,
        limit: itemsPerPage,
        searchText: searchTerm,
        sortColumn,
        sortOrder,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, searchTerm, sortColumn, sortOrder]);

  const columns = [
    { path: "name", label: "Name", sortable: true },
    { path: "username", label: "Username", sortable: true },
    { path: "email", label: "Email", sortable: true },
    { path: "phone", label: "Phone", sortable: true },
    { path: "address.city", label: "City", sortable: true },
    {
      key: "delete",
      content: (user) => (
        <button
          onClick={() => handleDeleteUser(user)}
          className="delete-button"
        >
          Delete
        </button>
      ),
    },
  ];

  const handleAddUser = () => {
    setShowForm(true);
  };

  return (
    <div>
      {/* <button onClick={handleBulkExport}>Bulk Export</button> */}
      <button onClick={handleAddUser}>Add User</button>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddUserForm closeModal={() => setShowForm(false)} />
          </div>
        </div>
      )}
      <ServerSideTable
        title="User Data Table"
        data={users}
        columns={columns}
        totalItems={totalUsers}
        totalPages={totalPages} // check this ones.
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onPageChange={(page) => dispatch(setPage(page))}
        onItemsPerPageChange={(limit) => dispatch(setItemsPerPage(limit))}
        onSearchChange={(term) => dispatch(setSearchTerm(term))}
        onSortChange={({ sCol, sOrder }) =>
          dispatch(setSort({ sortColumn: sCol, sortOrder: sOrder }))
        }
      />
    </div>
  );
};

export default UsersListServerSide;
