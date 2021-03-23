import React, { useEffect, useState, useNavigate } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";



const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
      minHeight:100,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));





const ReturnBook = ({ member }) => {

    const classes = useStyles();


  const [booksInPossession, setbooksInPossession] = useState(
    member.books_in_possession
  );
  const [returnDialog, setReturnDialoge] = useState(false);
  const [booksList, setBooksList] = useState([]);
  const [book, setBook] = useState(``);
  const [payment, setPayment] = useState(``)

  const fetchTransactionsTable = async () => {
    await axios.get("/books").then((res) => {
      setBooksList(res.data.bookDetails);
      console.log(res.data.bookDetails);
    });
  };

  const openReturnDialog = () => {
    setBook(``);
    setPayment(``)
    setBooksList([]);
    fetchTransactionsTable();
    setReturnDialoge(true);
  };

  const closeReturnDialog = () => {
    setReturnDialoge(false);
    setBook(``);
    setPayment(``)
    setBooksList([]);
  };

  //   useEffect(() => {
  //     fetchTransactionsTable();
  //   }, []);

  const returnBook = async (bookID, memberID, payemnt) => {
    await axios.post('/transactions/return-book',{
        book: bookID,
        member: memberID,
        payment: payemnt
      }).then(res=>{console.log(res); closeReturnDialog()})
  }

  return (
    <div>
      <Button
        disabled={!booksInPossession}
        onClick={() => {
          openReturnDialog();
        }}
      >
        Return Book
      </Button>

      <Dialog
        open={returnDialog}
        onClose={() => closeReturnDialog()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Return Book for {member.member_name}</DialogTitle>

        {booksList.length ? (
          <DialogContent>
            <FormControl className={classes.formControl}>
              <InputLabel margin="dense">Book Name</InputLabel>
              <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={book}
              onChange={(e)=>setBook(e.target.value)}
            >
             {booksList.map(books=><MenuItem value={books.book_id}>{books.book_name}</MenuItem>)}
            </Select>
            <TextField
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              autoFocus
              margin="dense"
              name="payemnt"
              id="payment"
              label="Payment for the rent charged"
              type="number"
              fullWidth
            />
            </FormControl>
          </DialogContent>
        ) : (
          <DialogContent>Loading</DialogContent>
        )}
        {/* {membersList.length ? (<DialogContent> <FormControl className={classes.formControl}>
            <InputLabel margin="dense">Member Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={memberName}
              onChange={(e)=>setMemberName(e.target.value)}
            >
             {membersList.map(member=><MenuItem value={member.member_id}>{member.member_name}</MenuItem>)}
            </Select>
           
          </FormControl></DialogContent>):(<DialogContent>Loading</DialogContent>)} */}
        {/* <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel margin="dense">Member Name</InputLabel>
           
          </FormControl>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={() => closeReturnDialog()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => returnBook(book,member.member_id,parseInt(payment))} color="primary">
            Return
          </Button>

          {/* {membersList.length ? (<Button onClick={()=>{issueBook(bookDetails.book_id,memberName);}} color="primary">Issue</Button>):(<div></div>)}
           */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReturnBook;
