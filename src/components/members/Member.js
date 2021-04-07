import React, { useState } from "react";
import {
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
import ReturnBook from "./ReturnBook";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const Member = ({ member, deleteMember, updateMember }) => {
  const classes = useStyles();

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
      <TableCell align="center">{outstandingDebt}</TableCell>
      <TableCell align="center">{totalPaid}</TableCell>
      <TableCell align="center">{booksInPossesion}</TableCell>
      <TableCell align="center">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => openUpdateMemberDialog()}
          startIcon={<EditTwoToneIcon />}
        >
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
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => {
            deleteMember(member.member_id);
          }}
          startIcon={<DeleteForeverTwoToneIcon />}
        >
          Delete
        </Button>
      </TableCell>

      <TableCell>
        <ReturnBook member={member} />
      </TableCell>
    </TableRow>
  );
};

export default Member;
