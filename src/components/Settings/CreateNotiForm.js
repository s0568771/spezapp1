import React from "react";

import { makeStyles, styled } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsOffOutlinedIcon from '@material-ui/icons/NotificationsOffOutlined';
import getUser, {getNotification, setNotification, setNotificationDateTime} from "../ServicesAPI/UserAPI";
import MyPopUp, {openPopUp} from "../ServicesAPI/CreatePopUp";


export default function MyNotiForm() {
	const currentNoti = getNotification();
	const [state, setState] = React.useState({
		notiOn: currentNoti ? "block" : "none",
		notiOff: currentNoti ? "none" : "block",
	});
	
	const handleDateChange = (e) => {
		return setNotificationDateTime(e.target.value)
	}

	const clickNoti = (on) => (e) => {
		setNotification(on);
		on ? setState({ ...state, ["notiOn"]: "block", ["notiOff"]: "none"}) : setState({ ...state, ["notiOn"]: "none", ["notiOff"]: "block"});
		//on ? openPopUp("Die Benachrichtigung wurde angeschaltet") : openPopUp("Die Benachrichtigunge wurde abgeschaltet");
		//openPopUp("Demnächst Verfügbar!");
		if (on) {
			openPopUp("Demnächst Verfügbar!");
		}
	}
	
	return (
		<form noValidate>
        	<TextField
        		className = "notiFieldSetting"
        		label="Uhrzeit"
				type="time"
				defaultValue={getUser().notificationDateTime}
				onChange={e => handleDateChange(e)}
        		InputLabelProps={{
        			shrink: true,
        		}}
        		inputProps={{
        			step: 300, // 5 min
        		}}
            	InputProps={{
            		endAdornment: (
        				<InputAdornment position="end">
							<IconButton style={{"display": state.notiOn, color: "rgb(13, 71, 161)"}} onClick={clickNoti(false)}><NotificationsIcon /></IconButton>
                      		<IconButton style={{"display": state.notiOff, color: "rgb(176, 0, 32)"}} onClick={clickNoti(true)}><NotificationsOffOutlinedIcon /></IconButton>
                  		</InputAdornment>
        			),
            	}}
        	/>
			<MyPopUp />
    	</form>
	);
}
