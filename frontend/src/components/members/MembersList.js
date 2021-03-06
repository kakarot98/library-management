import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import Member from "./Member";
import SearchBar from "material-ui-search-bar";
import AddMember from "./AddMember";

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
    // console.log(membersList);
  }, [membersList]);

  //function to delete the member
  const deleteMember = async (id) => {
    await axios
      .delete(`/api/members/${id}/delete`)
      .then((res) => {
        fetchMembersList();
        // setList(res.data.memberDetails);
        // console.log(res.data.memberDetails);
      })
      .catch((err) => {
        setErrMsg(
          `${err} - ${err.response.data.errorMessage}`
        );
        openAlert();
      });
    // console.log(id);
  };

  //update member function
  const updateMember = async (id, mname) => {
    await axios
      .post(`/api/members/${id}/update`, {
        memberName: mname,
      })
      .then((res) => {
        // console.log(res.data);
        fetchMembersList();
      })
      .catch((err) => {
        setErrMsg(
          `${err} - ${err.response.data.errorMessage}`
        );
        openAlert();
      });
  };

  const requestSearchMember = (searchVal) => {
    const filteredRows = list.filter((row) => {
      return row.member_name.toLowerCase().includes(searchVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearchMember = () => {
    setSearchMemberValue("");
    requestSearchMember(searchMemberValue);
  };

  return list.length ? (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <SearchBar
            placeholder="Search member..."
            value={searchMemberValue}
            onChange={(searchVal) => requestSearchMember(searchVal)}
            onCancelSearch={() => cancelSearchMember()}
          />
        </Grid>
        <Grid item xs={4}>
          <AddMember fetchMembersList={fetchMembersList} />
        </Grid>
      </Grid>

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
    </div>
  ) : (
    <div>
      <h1>Loading ...</h1>
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
    </div>
  );
};

export default MembersList;
