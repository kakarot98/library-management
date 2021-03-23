import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  InputLabel,
  Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";

const BookTransactions = ({book}) => {
    const [transactionDetails, setTransactionDetails] = useState()

    useEffect(()=>{
const getTransactions = async () => {
    axios.get(`/books/${book.book_id}/transactions`).then(res => console.log(res.data))
}
    },[])



    return (
        <div>
            
        </div>
    )
}

export default BookTransactions
