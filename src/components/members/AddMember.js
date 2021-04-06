import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import axios from "axios";

const AddMember = ({ fetchMembersList }) => {
  const [addMemberDialog, setAddMemberDialog] = useState(false); //dialog box to add book

  const [memberName, setMemberName] = useState("");

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


  const openAddMemberDialog = () => {
    setAddMemberDialog(true);
  };


  const closeAddMemberDialog = () => {
    setMemberName("");
    setAddMemberDialog(false);
  };


  const addBook = async (mname) => {

    if(!mname){
      setErrMsg("Fill the name")
      openAlert()
      return
    }

    await axios
      .post("/members", {
        memberName: mname,
      })
      .then((res) => {
        console.log(res);
        fetchMembersList();
        closeAddMemberDialog();
      }).catch((err) => {
        setErrMsg(err);
        openAlert();
      })
  };


  return (
    <div>
      <Button variant="contained" onClick={() => openAddMemberDialog()} startIcon={<AddCircleIcon/>}>
        Add New Member
      </Button>
      <Dialog
        open={addMemberDialog}
        onClose={() => closeAddMemberDialog()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            autoFocus
            margin="dense"
            id="memberName"
            name="memberName"
            label="Member Name"
            type="string"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeAddMemberDialog()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => addBook(memberName)} color="primary">
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

export default AddMember;
