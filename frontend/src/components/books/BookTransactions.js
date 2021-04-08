import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@material-ui/core";
import axios from "axios";

const BookTransactions = (props) => {
  const [transactionDetails, setTransactionDetails] = useState([]);
  const id = props.match.params.id;
  // const [id, setId] = useState(props.match.params.id);

  useEffect(() => {
    const getTransactions = async () => {
      const res = await axios.get(`/books/${id}/transactions`);
      setTransactionDetails(res.data.transactions);
    };
    getTransactions();
  }, [id]);

  return transactionDetails.length ? (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Name</TableCell>
              <TableCell align="right">Member Name</TableCell>
              <TableCell align="right">Transaction Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody key={transactionDetails.transaction_id}>
            {transactionDetails.map((transaction) => (
              <TableRow key={transaction.transaction_id}>
                <TableCell component="th" scope="row">
                  {transaction.books.book_name}
                </TableCell>
                <TableCell align="right">
                  {transaction.members.member_name}
                </TableCell>
                <TableCell align="right">
                  {transaction.transaction_type}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : (
    <Typography variant="h6">No Transaction Yet</Typography>
  );
};

export default BookTransactions;
