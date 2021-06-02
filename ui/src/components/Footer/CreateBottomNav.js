import React from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {IconMensen, IconSpeiseangebot} from "../ServicesAPI/CreateIconSVG";
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(
	{
		root: {
			background: "rgb(13, 71, 161)",
			height: "100%",
		},
	});


export default function MyBottomNav() {
	const classes = useStyles();
	const getInitialState = () => {
		if (window.localStorage.getItem('count')){
			return Number(window.localStorage.getItem('count'))
		}else{
			return 1
		}
	}

	const [value, setValue] = React.useState(getInitialState);
	const MyNav = withStyles({
		root: {
			color: 'rgba(255, 255, 255, 0.74)',
			maxWidth: "none",
			"&$selected": {
				color: "rgb(255,255,255)",
			},
		},
		selected: {//muss leer sein, nicht entfernen
		},
	})(BottomNavigationAction);

	return (
	    <BottomNavigation showLabels className={classes.root} value={value} onChange={(event, newValue) => {
	    	console.log(newValue);
	    	setValue(newValue);
			localStorage.setItem('count', newValue)
	    }}>
			{/*<MyNav href='/route' label="Route" icon={<LocationOnIcon />} />*/}
			<MyNav href='/favFood' label="Lieblingsspeisen" icon={<FavoriteIcon />} />
			<MyNav href='/' label="Speiseangebote" icon={<IconSpeiseangebot />}/>
		    <MyNav href='/mensen' label="Mensen" icon={<IconMensen />} />
	    </BottomNavigation>
	);
}
