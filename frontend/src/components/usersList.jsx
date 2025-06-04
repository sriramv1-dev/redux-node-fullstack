import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMultipleUsers, fetchUsers } from "../reducers/usersSlice";
import AddUserForm from "./AddUser/AddUserForm";

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

  return (
    <div>
      {/* <button onClick={handleBulkExport}>Bulk Export</button> */}
      <AddUserForm />
      <br />
      {users.map(({ id, name, username, email }) => {
        return (
          <div key={id}>
            {name}: {username}: {email}
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
