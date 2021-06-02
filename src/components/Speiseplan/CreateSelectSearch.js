import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';


export default function MySelectSearch(props) {
	const useStyles = makeStyles({
		  paper: {
			  left: "2%",
			  right: "2%",
			  "&::-webkit-scrollbar": {
				  "display": "none",
			  },
			  "z-index": 1000,
		  },
		});
	
	return (
		<Select {... props} MenuProps={{ classes: {paper: useStyles().paper}}}/>
	);
}