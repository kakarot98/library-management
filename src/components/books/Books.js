import React, { useState, useEffect } from "react";
import axios from "axios";
import BookList from "./BooksList";
import AddBook from "./AddBook";

const Books = () => {
  const [booksList, setBooksList] = useState([]); //to store book details

  //function will be used to fetch bookdetails and then store it again freshly
  const fetchBookList = async () => {
    
    await axios.get("/books").then((res) => {
      setBooksList([]);
      setBooksList(res.data.bookDetails);
      console.log(res.data.bookDetails);
      console.log("fetching books from parent component");
    });
  };

  useEffect(() => {
    fetchBookList();
  }, []);

  return booksList.length ? (
    <div>
      <BookList booksList={booksList} fetchBookList={fetchBookList} />
      <AddBook fetchBookList={fetchBookList} />
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};

export default Books;
