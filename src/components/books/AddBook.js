import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const AddBook = ({ fetchBookList }) => {
  const [addBookDialog, setAddBookDialog] = useState(false); //dialog box to add book

  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rentPrice, setRentPrice] = useState(60);
  const [stocks, setStocks] = useState(1);

  const openAddBookDialog = () => {
    setAddBookDialog(true);
  };

  const closeAddBookDialog = () => {
    setBookName("");
    setAuthorName("");
    setRentPrice(60);
    setStocks(0);
    setAddBookDialog(false);
  };

  const addBook = async (bname, aname, rprice, stocks) => {
    await axios
      .post("/books", {
        bookName: bname,
        authorName: aname,
        rentPrice: rprice,
        stocks: stocks,
      })
      .then((res) => {
        console.log(res);
        fetchBookList();
        closeAddBookDialog();
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={() => openAddBookDialog()}>
        Add New Book
      </Button>
      <Dialog
        open={addBookDialog}
        onClose={() => closeAddBookDialog()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <TextField
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            autoFocus
            margin="dense"
            id="bookName"
            name="bookName"
            label="Book Name"
            type="string"
            fullWidth
          />
          <TextField
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            autoFocus
            margin="dense"
            name="authorName"
            id="authorName"
            label="Author Name"
            type="string"
            fullWidth
          />
          <TextField
            value={rentPrice}
            onChange={(e) => setRentPrice(e.target.value)}
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
            value={stocks}
            onChange={(e) => setStocks(e.target.value)}
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
          <Button onClick={() => closeAddBookDialog()} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              addBook(bookName, authorName, rentPrice, stocks);
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBook;
