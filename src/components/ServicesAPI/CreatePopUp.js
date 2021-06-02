import React from "react";

import Paper from "@material-ui/core/Paper";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const myPopUpRef = React.createRef();
const buttonRef = React.createRef();

const useStyles = makeStyles((theme) => ({
	rootDiv: {
		display: "none",
		position: "fixed",
		width: "100%",
		height: "100%",
		top: "0%",
		left: "0%",
		"backgroundColor": "rgba(0, 0, 0, 0.5)",
		"zIndex": 1100,
	},
	rootPaper: {
		position: "absolute",
	    width: "75%",
	    height: "25%",
	    top: "37.5%",
	    left: "12.5%"
	},
	rootText: {
		margin: "7%",
		"font-style": "normal",
		"font-weight": "normal",
		"font-size": "14px",
		"line-height": "143%",
	
		"letter-spacing": "0.25px",
		color: "rgba(0, 0, 0, 0.6)",
	},
	rootButton: {
		position: "absolute",
		"bottom": "5%",
		"right": "5%",
		
		"font-style": "normal",
		"font-weight": 500,
		"font-size": "14px",
		"line-height": "114%",	
		"letter-spacing": "1.25px",
		"text-transform": "uppercase",
		color: "#2196F3",
	},
}));

function closePopUp() {
	let popUpWindow = myPopUpRef.current;
	if (popUpWindow) {
		popUpWindow.style.display = "none";
	}
}

export function openPopUp(inputText){
	if (!inputText) {
		inputText = ""
	}
	let popUpWindow = myPopUpRef.current;
	if (popUpWindow) {
		popUpWindow.childNodes[0].childNodes[0].childNodes[0].innerHTML = inputText;
		popUpWindow.style.display = "inherit";
	}
	buttonRef.current.focus();
}

export default function MyPopUp() {
	const classes = useStyles();

	return (
		<div ref={myPopUpRef} className={classes.rootDiv}>
			<Paper className={classes.rootPaper} elevation={24}>
				<div className={classes.rootText}>
					<p style = {{"margin": 0}}>
						Achtung es ist ein Fehler unterlaufen. Bitte starten Sie die App neu.
					</p>
				</div>
				<Button className={classes.rootButton} onClick={closePopUp} ref={buttonRef}>Okay</Button>
			</Paper>
	    </div>
	);
}