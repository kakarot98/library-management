import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Tabs, Tab, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            <Link to="/">Library Management</Link>
          </Typography>
          <Typography variant="subtitle1" className={classes.title}>
            <Link to="/books">Books List</Link>
          </Typography>
          <Typography variant="subtitle1" className={classes.title}>
            <Link to="/members">Members List</Link>
          </Typography>
          <Typography variant="subtitle1" className={classes.title}>
            <Link to="/transactions">Report</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
