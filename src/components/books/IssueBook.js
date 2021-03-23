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
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {BrowserRouter as Router, Route,Redirect} from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    minHeight:80,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));




const IssueBook = ({ bookDetails }) => {
  const classes = useStyles();


  const [stocksLeft, setStocksLeft] = useState(bookDetails.stocks);
  const [issueDialog, setIssueDialoge] = useState(false);
  const [bookName, setBookName] = useState(bookDetails.book_name);
  const [memberName, setMemberName] = useState(``);
  const [membersList, setMembersList] = useState([]);

  const fetchTransactionsTable = async () => {
    await axios.get("/members").then((res) => {
      setMembersList(res.data.memberDetails);
      console.log(res.data.memberDetails);
    });
  };

  //   useEffect(()=>{
  // fetchTransactionsTable()
  //   },[])

  const openIssueDialog = () => {
    // console.log(typeof bookDetails.book_id)
    setMemberName(``)
    setMembersList([]);
    setIssueDialoge(true);
    fetchTransactionsTable();
  };

  const closeIssueDialog = () => {
    // membersList.map(member=>console.log(member.member_name))
    // console.log(typeof memberName)
    setIssueDialoge(false);
    setMemberName(``)
    setMembersList([]);
  };

  const issueBook = async (bookID, memberID) => {
    await axios.post('/transactions/issue-book',{
      book: bookID,
      member: memberID
    }).then(res=>{console.log(res); closeIssueDialog()})
  };

  return (
    <div>
      <Button
        disabled={stocksLeft}
        onClick={() => {
          openIssueDialog();
        }}
      >
        Issue
      </Button>
      <Dialog
        open={issueDialog}
        onClose={() => closeIssueDialog()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Issue Book - {bookName}</DialogTitle>
        {membersList.length ? (<DialogContent> <FormControl className={classes.formControl}>
            <InputLabel margin="dense">Member Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={memberName}
              onChange={(e)=>setMemberName(e.target.value)}
            >
             {membersList.map(member=><MenuItem value={member.member_id}>{member.member_name}</MenuItem>)}
            </Select>
           
          </FormControl></DialogContent>):(<DialogContent>Loading</DialogContent>)}
        {/* <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel margin="dense">Member Name</InputLabel>
           
          </FormControl>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={() => closeIssueDialog()} color="primary">
            Cancel
          </Button>
          {membersList.length ? (<Button onClick={()=>{issueBook(bookDetails.book_id,memberName);}} color="primary">Issue</Button>):(<div></div>)}
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IssueBook;
