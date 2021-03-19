import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const BooksList = () => {
  const [booksList, setBopoksList] = useState([]);
  // const [addBookModal, setOpenAddBookModal] = useState(false)
  

  useEffect(() => {
    const fetchBookList = async () => {
      await axios.get("/books").then((res) => {
        setBopoksList(res.data.bookDetails);
        console.log(res.data.bookDetails);
      });
    };
    fetchBookList();
  }, []);
  
const deleteBook = async (id)=>{
  await axios.delete(`/books/${id}/delete`).then(res => console.log(res)).then(window.location.reload())
  console.log(id)
}


  return booksList ? (
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
              <TableCell align="center" colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booksList.map((book) => (
              <TableRow key={book.book_id}>
                <TableCell component="th" scope="row">
                  {book.book_name}
                </TableCell>
                <TableCell align="right">{book.author_name}</TableCell>
                <TableCell align="right">{book.issued}</TableCell>
                <TableCell align="right">{book.rent_price}</TableCell>
                <TableCell align="right">{book.stocks_left}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="secondary">
                    Update
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="primary" onClick={()=>deleteBook(book.book_id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained">Add New Book</Button>
      
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};

export default BooksList;
