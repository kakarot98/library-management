import React, { useState, useEffect } from "react";
import axios from "axios";
import BookList from "./BooksList";

const Books = () => {
  const [booksList, setBooksList] = useState([]); //to store book details

  //function will be used to fetch bookdetails and then store it again freshly
  const fetchBookList = async () => {
    await axios.get("/api/books").then((res) => {
      setBooksList([]);
      setBooksList(res.data.bookDetails);
      // console.log(res.data.bookDetails);
      // console.log("fetching books from parent component");
    }).catch(err => console.log(err));
  };

  useEffect(() => {
    fetchBookList();
  }, []);

  return booksList.length ? (
    <div>
      {/* <AddBook fetchBookList={fetchBookList} /> */}
      <BookList booksList={booksList} fetchBookList={fetchBookList} />
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};

export default Books;
