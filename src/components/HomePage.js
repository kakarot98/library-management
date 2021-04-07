import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, HorizontalBar, Doughnut, Pie } from "react-chartjs-2";
import {
  Card,
  Paper,
  CardContent,
  Typography,
  Grid,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(6),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  control: {
    padding: theme.spacing(2),
  },
  card: {
    minWidth: 275,
  },
}));

const HomePage = () => {
  const classes = useStyles();

  const [quantityChartData, setQuantityChartData] = useState({});
  const [membersRentedChartData, setMembersRentedChartData] = useState({});
  const [mostPaidChartData, setMostPaidChartData] = useState({});
  const [alert, setAlert] = useState(false);
  const [errMsg, setErrMsg] = useState(``);

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

  //to generate a random color
  const colorGenerate = () => {
    var rgb = [];
    for (var i = 0; i < 3; i++) {
      rgb.push(Math.floor(Math.random() * 255));
    }
    return "rgb(" + rgb.join(",") + ")";
  };

  const fetchDistinctMemberChartData = () => {
    let bookNameForPieChart = [];
    let numberOfMembers = [];

    let bookNameForQuantChart = [];
    let totalQuant = [];
    let quantLeftInLib = [];

    let colors = [];

    let membersWhoPaid = [];
    let membersPayment = [];

    axios
      .get("/report")
      .then((res) => {
        console.log(res.data);
        for (const dataObj of res.data.bookRankingDetails) {
          bookNameForQuantChart.push(dataObj.book_name);
          totalQuant.push(parseInt(dataObj.total));
          quantLeftInLib.push(parseInt(dataObj.stocks_left));
        }

        for (const dataObj of res.data.bookRankingDetails) {
          if (parseInt(dataObj.number_of_members) === 0) {
            continue;
          }
          bookNameForPieChart.push(dataObj.book_name);
          numberOfMembers.push(parseInt(dataObj.number_of_members));
          colors.push(colorGenerate());
        }

        for (const dataObj2 of res.data.memberRankingDetails) {
          if (parseInt(dataObj2.total_paid) === 0) {
            continue;
          }
          membersPayment.push(dataObj2.total_paid);
          membersWhoPaid.push(dataObj2.member_name);
        }

        // console.log(totalRents, bookName2);

        setMembersRentedChartData({
          labels: bookNameForPieChart,
          datasets: [
            {
              label: "Number of Members who rented",
              data: numberOfMembers,
              borderWidth: 0.5,
              backgroundColor: colors,
            },
          ],
        });

        setQuantityChartData({
          labels: bookNameForQuantChart,
          datasets: [
            {
              label: "Total quantity",
              data: totalQuant,
              backgroundColor: "rgb(217, 53, 48)",
            },
            {
              label: "Quantity left in library",
              data: quantLeftInLib,
              backgroundColor: "rgb(42, 107, 219)",
            },
          ],
        });

        setMostPaidChartData({
          labels: membersWhoPaid,
          datasets: [
            {
              label: "Total to the library",
              data: membersPayment,
              borderWidth: 1,
              backgroundColor: "rgba(52, 138, 237)",
            },
          ],
        });
      })
      .catch((err) => {
        setErrMsg(err);
        openAlert();
      });
  };

  useEffect(() => {
    fetchDistinctMemberChartData();
  }, []);

  return (
    <div>
      <Card className={classes.card} elevation={3}>
        <CardContent>
          <Pie
            data={membersRentedChartData}
            height={75}
            options={{
              responsive: true,
              title: {
                text: "Popularity by members who rented",
                display: true,
              },
            }}
          />
        </CardContent>
      </Card>
      <Grid container>
        <Grid item md={6}>
          <Paper className={classes.paper} elevation={3}>
            <Bar
              height={500}
              data={quantityChartData}
              options={{
                responsive: true,
                title: {
                  text: "Quantity of books",
                  display: true,
                },
                maintainAspectRatio: false,
              }}
            />
          </Paper>
        </Grid>

        <Grid item md={6}>
          <Paper className={classes.paper} elevation={3}>
            <Bar
              data={mostPaidChartData}
              height={500}
              options={{
                maintainAspectRatio: false,
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

export default HomePage;
