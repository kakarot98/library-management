import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import axios from "axios";

const AddBook = ({ fetchBookList }) => {
  const [addBookDialog, setAddBookDialog] = useState(false); //dialog box to add book

  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rentPrice, setRentPrice] = useState(60);
  const [stocks, setStocks] = useState(1);

  const [alert, setAlert] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const openAlert = () => {
    setAlert(true);
  };

  const closeAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
    setErrMsg("");
  };

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
    if (!bname || !aname || !rprice || !stocks) {
      setErrMsg("Need to all details to be filled and not empty");
      openAlert();
      return;
    }
    if (rprice === 0) {
      rprice = 60;
    }
    if (stocks === 0) {
      stocks = 1;
    }

    await axios
      .post("/books", {
        bookName: bname,
        authorName: aname,
        rentPrice: rprice,
        stocks: stocks,
      })
      .then((res) => {
        // console.log(res);
        fetchBookList();
        closeAddBookDialog();
      })
      .catch((err) => {
        setErrMsg(err);
        openAlert();
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => openAddBookDialog()}
        startIcon={<AddCircleIcon />}
        style={{ backgroundColor: "#aec9f5" }}
      >
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          Add New Book
        </Typography>
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
            label="Price for rent (Default will be 60)"
            type="number"
            fullWidth
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
      <Snackbar
        open={alert}
        autoHideDuration={3500}
        onClose={closeAlert}
        message={errMsg}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeAlert}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default AddBook;
