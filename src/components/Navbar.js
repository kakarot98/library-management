import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    fontWeight: "normal",
    color: "rgb(255,255,255)",
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: "#2c2f30" }}>
        <Toolbar>
          <Typography variant="h4" className={classes.title} color="secondary">
            <Link to="/" style={{ textDecoration: "none", color: "#dceff5" }}>
              Home
            </Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link
              to="/books"
              style={{ textDecoration: "none", color: "#dceff5" }}
            >
              Books List
            </Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link
              to="/members"
              style={{ textDecoration: "none", color: "#dceff5" }}
            >
              Members List
            </Link>
          </Typography>
          <Typography variant="subtitle1" className={classes.title}>
            <Link
              to="/transactions"
              style={{ textDecoration: "none", color: "#dceff5" }}
            >
              All Transactions
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
