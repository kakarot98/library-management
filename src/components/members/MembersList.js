import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import Member from "./Member";
import SearchBar from "material-ui-search-bar";

const MembersList = ({ fetchMembersList, membersList }) => {
  const [rows, setRows] = useState(membersList);
  const [searchMemberValue, setSearchMemberValue] = useState("");

  const [list, setList] = useState([]);

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

  useEffect(() => {
    setList(membersList);
    console.log(membersList);
  }, []);

  //function to delete the member
  const deleteMember = async (id) => {
    await axios.delete(`/members/${id}/delete`).then((res) => {
      fetchMembersList();
      // setList(res.data.memberDetails);
      console.log(res.data.memberDetails);
    }).catch(err=> {setErrMsg(err); openAlert()})
    console.log(id);
  };

  //update member function
  const updateMember = async (id, mname) => {
    await axios
      .post(`/members/${id}/update`, {
        memberName: mname,
      })
      .then((res) => {
        console.log(res.data);
        fetchMembersList();
      }).catch(err=> {setErrMsg(err); openAlert()})
  };

  const requestSearchMember = (searchVal) => {
    const filteredRows = list.filter(row=>{
      return row.member_name.toLowerCase().includes(searchVal.toLowerCase())
    })
    setRows(filteredRows)
  };

  const cancelSearchMember = () => {
    setSearchMemberValue("")
    requestSearchMember(searchMemberValue)
  };

  return list.length ? (
    <Paper>
      <SearchBar
        placeholder="Search member..."
        value={searchMemberValue}
        onChange={(searchVal) => requestSearchMember(searchVal)}
        onCancelSearch={() => cancelSearchMember()}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Member Name</TableCell>
              <TableCell align="center">Outstanding Debt</TableCell>
              <TableCell align="center">Total Paid Till Date</TableCell>
              <TableCell align="center">
                Books in Possession Currently
              </TableCell>
              <TableCell align="center" colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((member) => (
              <Member
                member={member}
                deleteMember={deleteMember}
                updateMember={updateMember}
                key={member.member_id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Paper>
  ) : (
    <h1>Loading ...</h1>
  );
};

export default MembersList;
