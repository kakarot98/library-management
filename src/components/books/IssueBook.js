import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import axios from "axios";

const IssueBook = ({ bookDetails }) => {
  const [stocksLeft, setStocksLeft] = useState(bookDetails.stocks);
  const [issueDialog, setIssueDialoge] = useState(false);
  const [bookName, setBookName] = useState(bookDetails.book_name);
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState([]);

  const fetchTransactionsTable = async () => {
    await axios.get("/transactions").then((res) => console.log(res));
  };

  const openIssueDialog = () => {
    setIssueDialoge(true);
  };

  const closeIssueDialog = () => {
    setIssueDialoge(false);
  };

  return (
    <div>
      <Button disabled={stocksLeft} onClick={()=>{openIssueDialog()}}>Issue</Button>
      <Dialog
        open={issueDialog}
        onClose={() => closeIssueDialog()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Issue Book - {bookName}</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={() => closeIssueDialog()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => closeIssueDialog()} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IssueBook;
