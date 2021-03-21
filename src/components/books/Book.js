import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import axios from "axios";

const Book = ({ book, deleteBook, updateBook }) => {
  const [bookName, setBookName] = useState(book.book_name);
  const [tempBook, setTempBook] = useState(book.book_name);
  const [authorName, setAuthorName] = useState(book.author_name);
  const [tempAuth, setTempAuth] = useState(book.author_name);
  const [rentPrice, setRentPrice] = useState(book.rent_price);
  const [tempRent, setTempRent] = useState(book.rent_price);
  const [stocks, setStocks] = useState(book.stocks_left);
  const [tempStocks, setTempStocks] = useState(book.stocks_left);
  const [updateBookDialog, setUpdateBookDialog] = useState(false);

  const openUpdateBookDialog = () => {
    setUpdateBookDialog(true);
  };

  const closeUpdateBookDialog = () => {
    setUpdateBookDialog(false);
    setTempBook(bookName);
    setTempAuth(authorName);
    setTempRent(rentPrice);
    setTempStocks(stocks);
  };

  return (
    <TableRow key={book.book_id}>
      <TableCell component="th" scope="row">
        {bookName}
      </TableCell>
      <TableCell align="right">{authorName}</TableCell>
      <TableCell align="right">{rentPrice}</TableCell>
      <TableCell align="right">{stocks}</TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => openUpdateBookDialog()}
        >
          Update
        </Button>

        <Dialog
          open={updateBookDialog}
          onClose={() => closeUpdateBookDialog()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>Update Book</DialogTitle>
          <DialogContent>
            <TextField
              value={tempBook}
              onChange={(e) => setTempBook(e.target.value)}
              autoFocus
              margin="dense"
              id="bookName"
              name="bookName"
              label="Book Name"
              type="string"
              fullWidth
            />
            <TextField
              value={tempAuth}
              onChange={(e) => setTempAuth(e.target.value)}
              autoFocus
              margin="dense"
              name="authorName"
              id="authorName"
              label="Author Name"
              type="string"
              fullWidth
            />
            <TextField
              value={tempRent}
              onChange={(e) => setTempRent(e.target.value)}
              autoFocus
              margin="dense"
              name="rentPrice"
              id="rentPrice"
              label="Price for rent"
              type="number"
              fullWidth
              defaultValue="60"
            />
            <TextField
              value={tempStocks}
              onChange={(e) => setTempStocks(e.target.value)}
              autoFocus
              margin="dense"
              name="stocks"
              id="stocks"
              label="Number of books to add"
              type="number"
              fullWidth
              defaultValue="1"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeUpdateBookDialog()} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateBook(
                  book.book_id,
                  tempBook,
                  tempAuth,
                  tempRent,
                  tempStocks
                );
                closeUpdateBookDialog();
              }}
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            console.log(book.book_id);
            deleteBook(book.book_id);
          }}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Book;
