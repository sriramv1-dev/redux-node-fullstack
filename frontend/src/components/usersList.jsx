import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMultipleUsers, fetchUsers } from "../reducers/usersSlice";
import AddUserForm from "./AddUser/AddUserForm";
import Table from "./common/Table/Table";

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

  const columns = [
    { path: "name", label: "Name", sortable: true },
    { path: "username", label: "Username", sortable: true },
    { path: "email", label: "Email", sortable: true },
    { path: "phone", label: "Phone", sortable: true },
    { key: "delete" },
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
