import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';



const useStyles = makeStyles((theme) => ({
	root: {
		"marginTop": "10vh",
		color: '#1a90ff',
	    animationDuration: '500ms',
	},
	circle: {
		strokeLinecap: 'round',
	},
}));

export default function MyLoad() {
	const classes = useStyles();
	
	return (
        <CircularProgress
	        variant="indeterminate"
	        disableShrink
	        className={classes.root}
	        classes={{
	        	circle: classes.circle,
        	}}
	        size="15vh"
	        thickness={2}
        />
	);
}
