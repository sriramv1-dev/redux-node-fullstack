import "./App.css";
import BookList from "./components/booksList";
import UsersList from "./components/usersList";

function App() {
  return (
    <div className="App">
      Users and Books
      {/*      <BookList />*/}
      <UsersList />
    </div>
  );
}

export default App;
