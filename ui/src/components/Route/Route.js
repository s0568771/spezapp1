import React, {Component} from 'react';
import './Route.css';

import MyPopUp, {openPopUp} from "../ServicesAPI/CreatePopUp";
import {IconRoute, IconFavFood} from "../ServicesAPI/CreateIconSVG";

class Routen extends Component{

    constructor(prop){
        super(prop);
    }
    
    componentDidMount() {
    	openPopUp("Demnächst Verfügbar");
	}
    
    render() {
    	return (
			<div className="route-container">
				<MyPopUp />
				<div className="notAvailable-container">
					<div className="mensaChoosedText">
						<p>Demnächst Verfügbar.</p>
					</div>
					<div className="iconError">
						<IconRoute style={{"height": "auto", width: "auto"}}/>
					</div>
				</div>
				
				
				<div className="notAvailable-container">
					<div className="mensaChoosedText">
						<p>Demnächst Verfügbar.</p>
					</div>
					<div className="iconError">
						<IconFavFood style={{"height": "auto", width: "auto"}}/>
					</div>
				</div>
			</div>
		);
    }
}

export default React.memo(Routen);