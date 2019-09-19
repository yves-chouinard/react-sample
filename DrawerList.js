import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  list: {
  },
  item: {
    '&:hover': {
      backgroundColor: '#444',
    },
  },
  activeItem: {
    backgroundColor: '#888 !important',
    '&:hover': {
      backgroundColor: '#999 !important',
    },
  },
  itemText: {
    padding: 0,
  },
});

export const DrawerItem = withStyles(styles)(({ classes, icon, label, onClick, to, active, collapsed }) => (
  <ListItem
    classes={{  }}
    button onClick={onClick}
    component={Link} to={to}
    selected={active}
    classes={{
      root: classes.item,
      selected: classes.activeItem,
    }}
  >
    <Grid container direction="column" alignItems="center">
      {collapsed &&
        <Tooltip title={label} aria-label={label}>
          {icon}
        </Tooltip>
      }
      {!collapsed &&
        icon
      }
      {!collapsed &&
        <ListItemText
          classes={{ root: classes.itemText }}
          primary={label}
        />        
      }
    </Grid>
  </ListItem>
));

DrawerItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string.isRequired,
  active: PropTypes.bool,
  collapsed: PropTypes.bool,
};

export const DrawerList = withStyles(styles)(({ children, classes, collapsed }) => (
  <List classes={{ root: classes.list }}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { collapsed })
    )}
  </List>
));

DrawerList.propTypes = {
  collapsed: PropTypes.bool,
};
