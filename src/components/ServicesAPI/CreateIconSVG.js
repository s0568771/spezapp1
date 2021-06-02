import React from "react";
import SvgIcon from '@material-ui/core/SvgIcon';

import { ReactComponent as speiseangebot } from "../../icons/food-svgrepo-com.svg";
import { ReactComponent as mensen } from "../../icons/restaurant-svgrepo-com.svg";
import { ReactComponent as noSignal } from "../../icons/noSignal.svg";
import { ReactComponent as closed } from "../../icons/closed-svgrepo-com.svg";
import { ReactComponent as virus } from "../../icons/virus-svgrepo-com.svg";
import { ReactComponent as route } from "../../icons/route-svgrepo-com.svg";
import { ReactComponent as favFood} from "../../icons/favFood-svgrepo-com.svg";
import { ReactComponent as logo } from "../../logo.svg";


export function IconSpeiseangebot(props){
    return (
    	<SvgIcon {... props} component={speiseangebot} viewBox="0 0 300.167 300.167">
		</SvgIcon>
	);
}

export function IconMensen(props){
    return (
		<SvgIcon {... props} component={mensen} viewBox="0 0 451.938 451.938">
		</SvgIcon>
    );
}

export function IconNoSignal(props) {
	return (
		<SvgIcon {...props} component={noSignal} viewBox="0 0 56.008221 56.314415">
		</SvgIcon>
	);
}

export function IconClosed(props) {
	return (
		<SvgIcon {...props} component={closed}  viewBox="0 0 463 463">
		</SvgIcon>
	);
}

export function IconVirus(props) {
	return (
		<SvgIcon {...props} component={virus}  viewBox="0 0 511.999 511.999">
		</SvgIcon>
	);
	
}

export function IconRoute(props) {
	return (
		<SvgIcon {...props} component={route}  viewBox="0 0 490 490">
		</SvgIcon>
	);
	
}

export function IconFavFood(props) {
	return (
		<SvgIcon {...props} component={favFood}  viewBox="0 0 60 60">
		</SvgIcon>
	);
	
}

export function IconLogo(props) {
	return (
		<SvgIcon {...props} component={logo} viewBox="0 0 512 512" />
	);
	
}



export default function MyIconSVG() {

}




