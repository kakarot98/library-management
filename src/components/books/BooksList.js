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


  const [searchValue, setSearchValue] = useState("")
  const [rows, setRows] = useState(booksList)

  const requestSearch = (searchVal)=>{
    const filteredRows = list.filter(row => {
      return row.book_name.toLowerCase().includes(searchVal.toLowerCase())
    })
    setRows(filteredRows)
  }

  const cancelSearch = ()=>{
    setSearchValue("")
    requestSearch(searchValue)
  }


  const [list, setList] = useState([]);



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
        <SearchBar placeholder="Search by book name" value={searchValue} onChange={searchVal => requestSearch(searchVal)} onCancelSearch={()=>cancelSearch()}/>
        
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Name</TableCell>
              <TableCell >Author Name</TableCell>
              <TableCell >Issued</TableCell>
              <TableCell >Rent Price</TableCell>
              <TableCell >Stocks Left</TableCell>
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
