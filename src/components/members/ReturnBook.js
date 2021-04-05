import React, { useEffect, useState } from "react";
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
  FormControl,
  Checkbox,
  FormControlLabel,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    minHeight: 100,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ReturnBook = ({ member }) => {
  let history = useHistory();
  const redirectToTransactions = () => {
    history.push("/transactions");
  };

  const classes = useStyles();

  const [booksInPossession, setbooksInPossession] = useState(
    member.books_in_possession
  );
  const [returnDialog, setReturnDialoge] = useState(false);
  const [booksList, setBooksList] = useState([]);
  const [book, setBook] = useState(``);
  const [payment, setPayment] = useState(false);
  const [alert, setAlert] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const tempList = [];

  const fetchBooksInPossessionList = async (id) => {
    await axios
      .get(`/members/${member.member_id}/books-in-possession`)
      .then((res) => {
        console.log(res.data.transactions);
        res.data.transactions.map((transaction) => {
          if (transaction.balance > 0) {
            tempList.push(transaction);
          }
          return transaction;
        });
        console.log(tempList);
        setBooksList(tempList);
      })
      .catch((err) => {
        setErrMsg(err);
        openAlert();
      });
  };

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

  const handleCheckChange = (event) => {
    setPayment(event.target.checked);
  };

  const fetchTransactionsTable = async () => {
    fetchBooksInPossessionList();
    // await axios.get("/books").then((res) => {
    //   setBooksList(res.data.bookDetails);
    //   console.log(res.data.bookDetails);
    // });
  };

  const openReturnDialog = () => {
    setBook(``);
    setPayment(false);
    setBooksList([]);
    fetchTransactionsTable();
    setReturnDialoge(true);
  };

  const closeReturnDialog = () => {
    setReturnDialoge(false);
    setBook(``);
    setPayment(false);
    setBooksList([]);
  };

  //   useEffect(() => {
  //     fetchTransactionsTable();
  //   }, []);

  const returnBook = async (bookID, memberID, payemnt) => {
    if (!payment & !bookID) {
      setErrMsg("Fill all the details");
      openAlert();
      return;
    }
    if (!payment) {
      setErrMsg("Cannot Proceed Without Payment");
      openAlert();
      return;
    }
    if (!bookID) {
      setErrMsg("Cannot Proceed Without Book Name");
      openAlert();
      return;
    }
    await axios
      .post("/transactions/return-book", {
        book: bookID,
        member: memberID,
      })
      .then((res) => {
        console.log(res);
        closeReturnDialog();
      })
      .then(() => redirectToTransactions());
  };

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
              <InputLabel margin="dense">Book Name and Charge</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                }}
              >
                {booksList.map((books) => (
                  <MenuItem value={books.book_id} key={books.book_id}>
                    {books.book_name} (Rent-{books.rent_price})
                  </MenuItem>
                ))}
              </Select>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={payment}
                    onChange={handleCheckChange}
                    name="checknox"
                  />
                }
                label="Rent Paid"
              />
              {/* <TextField
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                autoFocus
                margin="dense"
                name="payemnt"
                id="payment"
                label="Payment for the rent charged"
                type="number"
                fullWidth
              /> */}
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
          <Button
            onClick={() =>
              returnBook(book, member.member_id, parseInt(payment))
            }
            color="primary"
          >
            Return
          </Button>

          {/* {membersList.length ? (<Button onClick={()=>{issueBook(bookDetails.book_id,memberName);}} color="primary">Issue</Button>):(<div></div>)}
           */}
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

export default ReturnBook;
