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

const AddMember = () => {
    const [addMemberDialog, setAddMemberDialog] = useState(false); //dialog box to add book

    const [memberName, setMemberName] = useState("");
    const [outstandingDebt, setOutstandingDebt] = useState("");
    const [rentPrice, setRentPrice] = useState(60);
    const [stocks, setStocks] = useState(1);

    return (
        <div>
            
        </div>
    )
}

export default AddMember
