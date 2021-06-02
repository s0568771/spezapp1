import './AboutUs.css';
import '../../index.css'
import React, {Component} from 'react';
import {Divider} from "@material-ui/core";


class AboutUs extends Component{
    constructor(props) {
        super(props);
        localStorage.setItem('count', -1);
    }

    render(){
        return(
            <div className="container">
                <div className="personal-title-container"><p>Wer steckt hinter Appeteria?</p></div>
                <Divider />
                <div className="text pt-24">
                    <p>Hinter Appeteria verbirbt sich der Gründer:</p>
                    <br/>
                    <p>
                        <li>Karsten Saß</li>
                    </p>
                </div>
                <div className="text pt-24">
                    <p>
                        Aus einer Aufgabe während des Studiums heraus enstand die Appeteria UG um allen Leuten eine Übersicht der Mensen deutschlandweit zu bieten.
                    </p>
                </div>
            </div>
        )
    }
}

export default React.memo(AboutUs);
