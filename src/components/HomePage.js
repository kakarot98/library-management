import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, HorizontalBar, Doughnut } from "react-chartjs-2";
import { Card, CardContent, Typography, Grid, rgbToHex } from "@material-ui/core";

const HomePage = () => {
  
  const [bookName1, setBookName1] = useState([])
  const [membersRentedChartData, setMembersRentedChartData] = useState({})
  const [totalIssueChartData, setTotalIssueChartData] = useState({}) 
  const [mostPaidChartData, setMostPaidChartData] = useState({})
  
  //to generate a random color
  const colorGenerate = () => {
    var rgb = []
    for(var i = 0; i < 3; i++){
    rgb.push(Math.floor(Math.random() * 255));}
    return 'rgb('+ rgb.join(',') +')'
  }

  const fetchDistinctMemberChartData =  () => {

    let bookName = []
    let numberOfMembers = []
    let colors = []
    let bookName2 = []
    let totalRents = []

    let membersWhoPaid = []
    let membersPayment = []

    axios.get("/report").then((res) => {
      console.log(res.data);
      for(const dataObj of res.data.bookRankingDetails){
        bookName.push(dataObj.book_name)
        numberOfMembers.push(parseInt(dataObj.number_of_members))
      }

      for(const dataObj of res.data.bookRankingDetails){
        if((dataObj.popularity) == 0){continue;}
        totalRents.push(parseInt(dataObj.popularity))
        bookName2.push(dataObj.book_name)
        colors.push(colorGenerate())        
      }

      for(const dataObj2 of res.data.memberRankingDetails){
        if(parseInt(dataObj2.total_paid)==0){continue;}
        membersPayment.push(dataObj2.total_paid)
        membersWhoPaid.push(dataObj2.member_name)
      }

      console.log(totalRents, bookName2)
      setMembersRentedChartData({
        labels: bookName,
        datasets: [
          {
            label: 'Number of Members who rented',
            data: numberOfMembers,
            borderWidth: 4,
            backgroundColor: 'rgba(230, 46, 30)'
          }
        ]        
      })

      setTotalIssueChartData({
        labels: bookName2,
        datasets: [
          {
            label: 'Total issues',
            data: totalRents,
            borderWidth: 4,
            backgroundColor: colors//'rgba(52, 138, 237)',
          }
        ]
      })


      setMostPaidChartData({
        labels: membersWhoPaid,
        datasets: [
          {
            label: 'Total to the library',
            data: membersPayment,
            borderWidth: 4,
            backgroundColor: 'rgba(52, 138, 237)',
          }
        ]
      })
      
    }).catch(err => console.log(err))

        
  };

  

  useEffect(() => {
    
    fetchDistinctMemberChartData();
  }, []);

  return (
    <div>
      <HorizontalBar data={membersRentedChartData} options={{
        responsive: true,
        title: {text: 'Popularity by number of members', display:true},        
      }}/>
      <br/><br/>
      {/* <HorizontalBar data={totalIssueChartData} options={{
        responsive: true,
        title: {text: 'Popularity by total rents', display:true},  
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }     
      }}/> */}
      <Doughnut data={totalIssueChartData} />
      <HorizontalBar data={mostPaidChartData} options={{
        responsive: true,
        title: {text: 'Most paid to the library', display:true},  
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }     
      }}/>
    </div>
  );
};

export default HomePage;
