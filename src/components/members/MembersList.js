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

const MembersList = ({ fetchMembersList, membersList }) => {
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

  return list.length ? (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member Name</TableCell>
              <TableCell align="right">Outstanding Debt</TableCell>
              <TableCell align="right">Total Paid Till Date</TableCell>
              <TableCell align="right">Books in Possession Currently</TableCell>
              <TableCell align="center" colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((member) => (
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
    </div>
  ) : (
    <h1>Loading ...</h1>
  );
};

export default MembersList;
