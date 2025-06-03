import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../reducers/usersSlice";

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

  return (
    <div>
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
