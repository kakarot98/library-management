import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import axios from "axios";

const Member = ({ member, deleteMember, updateMember }) => {
  const [memberName, setMemberName] = useState(member.member_name);
  const [outstandingDebt, setOutstandingDebt] = useState(
    member.outstanding_debt
  );
  const [totalPaid, setTotalPaid] = useState(member.total_paid);
  const [booksInPossesion, setBooksInPossession] = useState(
    member.books_in_possession
  );

  const [tempName, setTempName] = useState(member.member_name);

  const [updateMemberDialog, setUpdateMemberDialog] = useState(false);

  const openUpdateMemberDialog = () => {
    setUpdateMemberDialog(true);
  };

  const closeUpdateMemberDialog = () => {
    setUpdateMemberDialog(false);
    setTempName(memberName);
  };

  return (
    <TableRow key={member.member_id}>
      <TableCell component="th" scope="row">
        {memberName}
      </TableCell>
      <TableCell align="right">{outstandingDebt}</TableCell>
      <TableCell align="right">{totalPaid}</TableCell>
      <TableCell align="right">{booksInPossesion}</TableCell>
      <TableCell align="right">
        <Button variant="contained" color="primary" onClick={()=>openUpdateMemberDialog()}>
          Update
        </Button>
        <Dialog
          open={updateMemberDialog}
          onClose={() => closeUpdateMemberDialog()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>Update Member</DialogTitle>
          <DialogContent>
            <TextField
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
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
            <Button onClick={() => closeUpdateMemberDialog()} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateMember(member.member_id, tempName);
                closeUpdateMemberDialog();
              }}
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            deleteMember(member.member_id);
          }}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Member;
