import React, { useState, useEffect } from "react";
import axios from "axios";
import MembersList from "./MembersList";


const Members = () => {
  const [membersList, setMembersList] = useState([]); //used to store member details

  //function to fetch member details and then store them afresh in the list to render properly
  const fetchMembersList = async () => {
    await axios.get("/members").then((res) => {
      setMembersList([]);
      setMembersList(res.data.memberDetails);
      console.log(res.data.memberDetails);
      console.log("fetching members from parent component");
    });
  };

  useEffect(() => {
    fetchMembersList();
  }, []);

  return membersList.length ? (
    <div>
      {/* <AddMember fetchMembersList={fetchMembersList} /> */}
      <MembersList
        fetchMembersList={fetchMembersList}
        membersList={membersList}
      />
      
    </div>
  ) : (
    <h1>Loading ...</h1>
  );
};

export default Members;
