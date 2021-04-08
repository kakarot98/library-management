import React, { useState } from "react";
import {
  Typography,
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import IssueBook from "./IssueBook";
import {  Link } from "react-router-dom";
// import BookTransactions from './BookTransactions'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const Book = ({ book, deleteBook, updateBook }) => {
  const classes = useStyles();

  const bookDetails = book
  const bookName = book.book_name
  //const [bookDetails, setBookDetails] = useState(book);
  //const [bookName, setBookName] = useState(book.book_name);
  const [tempBook, setTempBook] = useState(book.book_name);

  const authorName = book.author_name
  //const [authorName, setAuthorName] = useState(book.author_name);
  const [tempAuth, setTempAuth] = useState(book.author_name);

  const rentPrice = book.rent_price
  //const [rentPrice, setRentPrice] = useState(book.rent_price);
  const [tempRent, setTempRent] = useState(book.rent_price);

  const stocks = book.stocks_left
  //const [stocks, setStocks] = useState(book.stocks_left);
  const [tempStocks, setTempStocks] = useState(book.stocks_left);
  const [updateBookDialog, setUpdateBookDialog] = useState(false);

  
  // const redirectBookTransaction = () => {
  //   // history.push(`/books/${bookDetails.book_id}/transactions`);

  //   return <Redirect to={`/books/${bookDetails.book_id}/transactions`} />;
  // };

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
      <TableCell>{authorName}</TableCell>
      <TableCell>{book.issued}</TableCell>
      <TableCell>{rentPrice}</TableCell>
      <TableCell>{stocks}</TableCell>
      <TableCell>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => openUpdateBookDialog()}
          startIcon={<EditTwoToneIcon />}
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
              label="Price for rent - Default will be 60"
              type="number"
              fullWidth
            />
            <TextField
              value={tempStocks}
              onChange={(e) => setTempStocks(e.target.value)}
              autoFocus
              margin="dense"
              name="stocks"
              id="stocks"
              label="Number of books to add - Default will be 1"
              type="number"
              fullWidth
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
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => {
            // console.log(book.book_id);
            deleteBook(book.book_id);
          }}
          startIcon={<DeleteForeverTwoToneIcon />}
        >
          Delete
        </Button>
      </TableCell>

      <TableCell>
        <IssueBook bookDetails={bookDetails} />
      </TableCell>
      <TableCell>
        <Typography variant="subtitle1">
          <Link to={`books/${bookDetails.book_id}/transactions`} style={{textDecoration: "none", color: "#000"}}>
            <Typography variant="button" style={{padding:"6px", border:"2px solid #fc2c03", borderRadius: "3px", backgroundColor:"rgba(252, 50, 74, 0.25)"}}>Related Transactions</Typography>
            
          </Link>
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default Book;
