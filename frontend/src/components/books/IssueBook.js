import React, {  useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
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
    minWidth: 120,
    minHeight: 80,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const IssueBook = ({ bookDetails }) => {
  const classes = useStyles();
  let history = useHistory();
  const redirectToTransactions = () => {
    history.push("/transactions");
  };

  const stocksLeft = bookDetails.stocks_left
  //const [stocksLeft, setStocksLeft] = useState(bookDetails.stocks);

  const [issueDialog, setIssueDialoge] = useState(false);

  const bookName = bookDetails.book_name
  // const [bookName, setBookName] = useState(bookDetails.book_name);

  const [memberName, setMemberName] = useState(``);
  const [membersList, setMembersList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [errMsg, setErrMsg] = useState(``);

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

  const fetchMembers = async () => {
    await axios
      .get("/api/members")
      .then((res) => {
        setMembersList(res.data.memberDetails);
        // console.log(res.data.memberDetails);
      })
      .catch((err) => {
        setErrMsg(err);
        openAlert();
      });
  };


  const openIssueDialog = () => {
    setMemberName(``);
    setMembersList([]);
    setIssueDialoge(true);
    fetchMembers();
  };

  const closeIssueDialog = () => {
    setIssueDialoge(false);
    setMemberName(``);
    setMembersList([]);
  };

  const issueBook = async (bookID, memberID) => {
    if (!memberID) {
      setErrMsg("Cannot proceed without member name");
      openAlert();
      return;
    }

    await axios
      .post("/api/transactions/issue-book", {
        book: bookID,
        member: memberID,
      })
      .then((res) => {
        closeIssueDialog();
      })
      .then(() => redirectToTransactions())
      .catch((err) => {
        console.log(err.response.data.errorMessage);
        setErrMsg(
          `${err} - ${err.response.data.errorMessage}`
        );
        openAlert();
      });
  };

  return (
    <div>
      <Button
        disabled={stocksLeft ? false:true}
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
        {membersList.length ? (
          <DialogContent>
            {" "}
            <FormControl className={classes.formControl}>
              <InputLabel margin="dense">Member Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              >
                {membersList.map((member) => (
                  <MenuItem value={member.member_id} key={member.member_id}>
                    {member.member_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
        ) : (
          <DialogContent>Loading</DialogContent>
        )}
        {/* <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel margin="dense">Member Name</InputLabel>
           
          </FormControl>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={() => closeIssueDialog()} color="primary">
            Cancel
          </Button>
          {membersList.length ? (
            <Button
              onClick={() => {
                issueBook(bookDetails.book_id, memberName);
              }}
              color="primary"
            >
              Issue
            </Button>
          ) : (
            <div></div>
          )}
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

export default IssueBook;
