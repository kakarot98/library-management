import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const BooksList = () => {
  const [booksList, setBopoksList] = useState([]);

  useEffect(() => {
    const fetchBookList = async () => {
      await axios.get("/books").then((res) => {
        setBopoksList(res.data);
        console.log(res.data);
      });
    };
    fetchBookList();
  }, []);

  return (
    <TableContainer component="paper">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Book Name</TableCell>
            <TableCell align="right">Author Name</TableCell>
            <TableCell align="right">Issued</TableCell>
            <TableCell align="right">Rent Price</TableCell>
            <TableCell align="right">Stocks Left</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BooksList;
