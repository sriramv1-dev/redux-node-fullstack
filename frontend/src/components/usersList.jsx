import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMultipleUsers,
  deleteUser,
  fetchUsers,
} from "../reducers/usersSlice";
import AddUserForm from "./AddUser/AddUserForm";
import Table from "./common/Table_client_side/Table";

const UsersList = () => {
  const users = useSelector((state) => state.ur.users);
  const userStatus = useSelector((state) => state.ur.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  if (users && users.length === 0) {
    return <h1>No Users found</h1>;
  }

  const handleBulkExport = () => {
    dispatch(addMultipleUsers(users));
  };

  const handleDeleteUser = (user) => {
    dispatch(deleteUser(user._id));
  };

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

  return (
    <div>
      {/* <button onClick={handleBulkExport}>Bulk Export</button> */}
      {/* <AddUserForm /> */}
      <br />
      <Table data={users} columns={columns} />
    </div>
  );
};

export default UsersList;
