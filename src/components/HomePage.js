import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, HorizontalBar, Doughnut } from "react-chartjs-2";
import {
  Card,
  Paper,
  CardContent,
  Typography,
  Grid,
  rgbToHex,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(10),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  control: {
    padding: theme.spacing(2),
  },
  card: {
    minWidth: 275,
  }
}));



const HomePage = () => {

  const classes = useStyles();

  const [bookName1, setBookName1] = useState([]);
  const [membersRentedChartData, setMembersRentedChartData] = useState({});
  const [totalIssueChartData, setTotalIssueChartData] = useState({});
  const [mostPaidChartData, setMostPaidChartData] = useState({});

  //to generate a random color
  const colorGenerate = () => {
    var rgb = [];
    for (var i = 0; i < 3; i++) {
      rgb.push(Math.floor(Math.random() * 255));
    }
    return "rgb(" + rgb.join(",") + ")";
  };

  const fetchDistinctMemberChartData = () => {
    let bookName = [];
    let numberOfMembers = [];
    let colors = [];
    let bookName2 = [];
    let totalRents = [];

    let membersWhoPaid = [];
    let membersPayment = [];

    axios
      .get("/report")
      .then((res) => {
        console.log(res.data);
        for (const dataObj of res.data.bookRankingDetails) {
          bookName.push(dataObj.book_name);
          numberOfMembers.push(parseInt(dataObj.number_of_members));
        }

        for (const dataObj of res.data.bookRankingDetails) {
          if (dataObj.popularity == 0) {
            continue;
          }
          totalRents.push(parseInt(dataObj.popularity));
          bookName2.push(dataObj.book_name);
          colors.push(colorGenerate());
        }

        for (const dataObj2 of res.data.memberRankingDetails) {
          if (parseInt(dataObj2.total_paid) == 0) {
            continue;
          }
          membersPayment.push(dataObj2.total_paid);
          membersWhoPaid.push(dataObj2.member_name);
        }

        console.log(totalRents, bookName2);
        setMembersRentedChartData({
          labels: bookName,
          datasets: [
            {
              label: "Number of Members who rented",
              data: numberOfMembers,
              borderWidth: 4,
              backgroundColor: "rgba(230, 46, 30)",
            },
            {
              label: "Total issues",
              data: totalRents,
              borderWidth: 4,
              backgroundColor: "rgba(52, 138, 237)",
            },
          ],
        });

        setTotalIssueChartData({
          labels: bookName2,
          datasets: [
            {
              label: "Total issues",
              data: totalRents,
              borderWidth: 4,
              backgroundColor: colors, //'rgba(52, 138, 237)',
            },
          ],
        });

        setMostPaidChartData({
          labels: membersWhoPaid,
          datasets: [
            {
              label: "Total to the library",
              data: membersPayment,
              borderWidth: 4,
              backgroundColor: "rgba(52, 138, 237)",
            },
          ],
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchDistinctMemberChartData();
  }, []);

  return (
    <div>
      <Card className={classes.card} elevation={3}>
        <CardContent>
        <Doughnut data={totalIssueChartData} height={75} />
        </CardContent>
      </Card>
      <Grid container >
        <Grid item md={6}>
          <Paper className={classes.paper} elevation={3}>
          <Bar
          height={300}
            data={membersRentedChartData}
            options={{
              responsive: true,
              title: { text: "Popularity by number of members", display: true },
              maintainAspectRatio:false
            }}
          />
          </Paper>
        </Grid>
        
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

        <Grid item md={6}>
          <Paper className={classes.paper} elevation={3}>
          <Bar
            data={mostPaidChartData}
            height={300}
            options={{
              maintainAspectRatio:false,
              responsive: true,
              title: { text: "Most paid to the library", display: true },
              scales: {
                xAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
