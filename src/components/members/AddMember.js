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

const AddMember = ({ fetchMembersList }) => {
  const [addMemberDialog, setAddMemberDialog] = useState(false); //dialog box to add book

  const [memberName, setMemberName] = useState("");

  
  const openAddMemberDialog = () => {
    setAddMemberDialog(true);
  };

  const closeAddMemberDialog = () => {
    setMemberName("");
    setAddMemberDialog(false);
  };

  const addBook = async (mname) => {
    await axios
      .post("/members", {
        memberName: mname,
      })
      .then((res) => {
        console.log(res);
        fetchMembersList();
        closeAddMemberDialog();
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={() => openAddMemberDialog()}>
        Add New Book
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
    </div>
  );
};

export default AddMember;
