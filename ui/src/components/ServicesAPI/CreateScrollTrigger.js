import React from "react";

import stylePrimary900 from "../Style/Styles";
import { ThemeProvider } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';


const fenster = React.createRef();

function ScrollToTop() {
	var currentWindow = fenster.current;
	if (!currentWindow) {
		currentWindow = undefined;
	}
	const trigger = useScrollTrigger({
		target: currentWindow,
	    disableHysteresis: true,
	    threshold: 175,
	});
	
	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
	    if (anchor) {
	    	anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
	    }
	};
	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} className="dishBtnBackTop">
	        	<Fab color="primary" size="small" aria-label="scroll back to top">
		    		<KeyboardArrowUpIcon />
				</Fab>
        	</div>
	    </Zoom>
	);
}
export function getRef(){
	return fenster;
}
export default function MyScrollTrigger() {
	return (
		<ThemeProvider theme={stylePrimary900()}>
			<ScrollToTop />
		</ThemeProvider>
	);
}
