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
import axios from "axios";
import Member from "./Member";
import SearchBar from "material-ui-search-bar";

const MembersList = ({ fetchMembersList, membersList }) => {
  const [rows, setRows] = useState(membersList);
  const [searchMemberValue, setSearchMemberValue] = useState("");

  const [list, setList] = useState([]);

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
    });
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
      });
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
    </Paper>
  ) : (
    <h1>Loading ...</h1>
  );
};

export default MembersList;
