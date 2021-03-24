import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import Book from "./Book";

const BooksList = ({ booksList, fetchBookList }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(booksList);
    console.log(booksList);
  }, []);

  //delete book function
  const deleteBook = async (id) => {
    await axios.delete(`/books/${id}/delete`).then((res) => {
      fetchBookList();
      setList(res.data.bookDetails);
      console.log(res.data.bookDetails);
    });
    console.log(id);
  };

  //update book function
  const updateBook = async (id, bname, aname, rprice, stock) => {
    await axios
      .post(`/books/${id}/update`, {
        bookName: bname,
        authorName: aname,
        rentPrice: rprice,
        stocks: stock,
      })
      .then((res) => {
        console.log(res.data);
        fetchBookList();
      });
  };

  return list.length ? (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Name</TableCell>
              <TableCell align="right">Author Name</TableCell>
              <TableCell align="right">Issued</TableCell>
              <TableCell align="right">Rent Price</TableCell>
              <TableCell align="right">Stocks Left</TableCell>
              <TableCell align="center" colSpan={4}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((book) => (
              <Book
                book={book}
                updateBook={updateBook}
                deleteBook={deleteBook}
                key={book.book_id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : (
    <h2>Loading</h2>
  );
};

export default BooksList;
