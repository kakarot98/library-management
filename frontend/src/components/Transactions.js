import axios from "axios";
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from "@material-ui/core";

const Transactions = () => {

    const [transactions, setTransactions] = useState([])


  useEffect(() => {
      const fetchTransactions = async () => {
          await axios.get('/api/transactions').then(res=>{ setTransactions(res.data.transactions)}).catch(err=>console.log(err))
      }
      fetchTransactions()

  }, []);

  return transactions.length ? (
    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Book Name</TableCell>
          <TableCell>Member Name</TableCell>
          <TableCell>Transaction Type</TableCell>        
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((transaction) => (<TableRow key={transaction.transaction_id}>
            <TableCell>{transaction.books.book_name}</TableCell>
            <TableCell>{transaction.members.member_name}</TableCell>
            <TableCell>{transaction.transaction_type}</TableCell>
        </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  ):(<h1>Loading</h1>);
};

export default Transactions;
