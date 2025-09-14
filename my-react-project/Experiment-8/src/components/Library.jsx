import React, { useState } from "react";

function Library() {
  const [books, setBooks] = useState([
    { title: "1984", author: "George Orwell" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
  ]);

  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  // Add new book
  const addBook = () => {
    if (newTitle.trim() === "" || newAuthor.trim() === "") return;
    setBooks([...books, { title: newTitle, author: newAuthor }]);
    setNewTitle("");
    setNewAuthor("");
  };

  // Remove book
  const removeBook = (index) => {
    const updatedBooks = [...books];
    updatedBooks.splice(index, 1);
    setBooks(updatedBooks);
  };

  return (
    <div className="library-container">
      <h2>Library Management</h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {/* Add Book Form */}
      <div className="add-form">
        <input
          type="text"
          placeholder="New book title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="New book author"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      {/* Book List */}
      <div className="book-list">
        {filteredBooks.map((book, index) => (
          <div key={index} className="book-item">
            <span>
              <strong>{book.title}</strong> by {book.author}
            </span>
            <button onClick={() => removeBook(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
