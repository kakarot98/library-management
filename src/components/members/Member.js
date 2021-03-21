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

const Member = ({ member, deleteMember }) => {
  const [memberName, setMemberName] = useState(member.member_name);
  const [outstandingDebt, setOutstandingDebt] = useState(
    member.outstanding_debt
  );
  const [totalPaid, setTotalPaid] = useState(member.total_paid);
  const [booksInPossesion, setBooksInPossession] = useState(
    member.books_in_possession
  );

  return (
    <TableRow key={member.member_id}>
      <TableCell component="th" scope="row">
        {memberName}
      </TableCell>
      <TableCell align="right">{outstandingDebt}</TableCell>
      <TableCell align="right">{totalPaid}</TableCell>
      <TableCell align="right">{booksInPossesion}</TableCell>
      <TableCell align="right">
        <Button variant="contained" color="primary">
          Update
        </Button>
      </TableCell>
      <TableCell align="right">
        <Button variant="contained" color="secondary" onClick={()=>{deleteMember(member.member_id)}}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Member;
