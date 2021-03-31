import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";

const HomePage = () => {
  // const [popularityByTotalIssues, setPopularityByTotalIssues] = useState([]);
  // const [popularityByMembers, setPopularityByMembers] = useState([]);
  const [bookName1, setBookName1] = useState([])
  const [distinctChartData, setDistinctChartData] = useState({})

  const fetchDistinctMemberChartData =  () => {

    let bookName = []
    let numberOfMembers = []

    axios.get("/report").then((res) => {
      // console.log(res.data);
      for(const dataObj of res.data.popularityByDistinctRents){
        bookName.push(dataObj.book_name)
        numberOfMembers.push(parseInt(dataObj.number_of_members))
        
      }
      setDistinctChartData({
        labels: bookName,
        datasets: [
          {
            label: 'Number of Members who rented',
            data: numberOfMembers,
            borderWidth: 4
          }
        ]
      })
      
    }).catch(err => console.log(err))

    console.log(bookName, numberOfMembers)

    
  };

  useEffect(() => {
    
    fetchDistinctMemberChartData();
  }, []);

  return (
    <div>
      <Bar data={distinctChartData}/>
    </div>
  );
};

export default HomePage;
