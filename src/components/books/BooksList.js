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
import SearchBar from "material-ui-search-bar";

const BooksList = ({ booksList, fetchBookList }) => {
  const [list, setList] = useState([]);
  const [searchBookValue, setSearchBookValue] = useState("");
  const [searchAuthorValue, setSearchAuthorValue] = useState("");
  const [rows, setRows] = useState(booksList);

  const requestSearchByBookName = (searchVal) => {
    const filteredRows = list.filter((row) => {
      return row.book_name.toLowerCase().includes(searchVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearchByBookName = () => {
    setSearchBookValue("");
    requestSearchByBookName(searchBookValue);
  };

  const requestSearchByAuthorName = (searchVal) => {
    const filteredRows = list.filter((row) => {
      return row.author_name.toLowerCase().includes(searchVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearchByAuthorName = () => {
    setSearchAuthorValue("");
    requestSearchByAuthorName(searchAuthorValue);
  };

  useEffect(() => {
    setList(booksList);
    console.log(booksList);
  }, []);

  //delete book function
  const deleteBook = (id) => {
    axios
      .delete(`/books/${id}/delete`)
      .then((res) => {
        fetchBookList();
        setList(res.data.bookDetails);
        console.log(res.data.bookDetails);
      })
      .catch((error) => {});
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
    <Paper>
      <SearchBar
        placeholder="Search by book name"
        value={searchBookValue}
        onChange={(searchVal) => requestSearchByBookName(searchVal)}
        onCancelSearch={() => cancelSearchByBookName()}
      />
      <SearchBar
        placeholder="Search by author name"
        value={searchAuthorValue}
        onChange={(searchVal) => requestSearchByAuthorName(searchVal)}
        onCancelSearch={() => cancelSearchByAuthorName()}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Name</TableCell>
              <TableCell>Author Name</TableCell>
              <TableCell>In Circulation</TableCell>
              <TableCell>Rent Price</TableCell>
              <TableCell>Stocks Left</TableCell>
              <TableCell align="center" colSpan={3}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((book) => (
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
    </Paper>
  ) : (
    <h2>Loading</h2>
  );
};

export default BooksList;
