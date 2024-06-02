/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import useGetBooks from "./hooks/useGetBooks";
import { useState } from "react";
import { checkFormValidity } from "./utils/checkFormValidity";

const baseUrl = "http://127.0.0.1:8000/books";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [addBookClicked, setAddBookClicked] = useState(false);
  const [editBookClicked, setEditBookClicked] = useState(false);
  const [formData, setFormData] = useState({
    id: new Date().getTime(),
    title: "",
    author: "",
    year: "",
  });

  const { books, loading } = useGetBooks(refresh);

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearForm = () => {
    setFormData({
      id: new Date().getTime(),
      title: "",
      author: "",
      year: "",
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isValid = checkFormValidity(formData);
    if (!isValid) {
      alert("Please fill in all fields.");
      return;
    }
    if (editBookClicked) {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      };
      await fetch(`${baseUrl}/${formData.id}`, requestOptions);
      setEditBookClicked(!editBookClicked);
      setRefresh(!refresh);
      setAddBookClicked(!addBookClicked);
      handleClearForm();
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };
    await fetch(baseUrl, requestOptions);
    setAddBookClicked(!addBookClicked);
    setRefresh(!refresh);
    handleClearForm();
  };

  const handleDelete = async (id: number) => {
    const requestOptions = {
      method: "DELETE",
    };
    await fetch(`${baseUrl}/${id}`, requestOptions);
    setRefresh(!refresh);
  };

  const handleEdit = async (id: number) => {
    setEditBookClicked(!editBookClicked);
    const formData = books.find((book) => book.id === id);
    setFormData(formData as any);
    setAddBookClicked(true);
  };

  return (
    <div className="app">
      <h1>Books</h1>
      {loading && <p>Loading...</p>}
      {!loading && books.length > 0 && (
        <ul>
          {books.map((book) => (
            <li key={book.id} className="li-list">
              {book.title} by {book.author} ({book.year})
              <button onClick={() => handleDelete(book.id)}>Delete</button>
              <button onClick={() => handleEdit(book.id)}>Edit</button>
            </li>
          ))}
        </ul>
      )}
      {addBookClicked && (
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="add-book-form"
        >
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="text"
            placeholder="Author"
            name="author"
            value={formData.author}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="number"
            placeholder="Year"
            name="year"
            value={formData.year}
            onChange={(e) => handleInputChange(e)}
          />{" "}
          <button type="submit">
            {editBookClicked ? "Edit Book" : "Add Book"}
          </button>
        </form>
      )}
      <button onClick={() => setAddBookClicked(!addBookClicked)}>
        Add Book
      </button>
    </div>
  );
}

export default App;
