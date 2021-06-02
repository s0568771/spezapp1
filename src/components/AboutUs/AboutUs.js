import './AboutUs.css';
import '../../index.css'
import React, { Component } from 'react';
import stylePrimary900 from "../Style/Styles";
import { ThemeProvider } from '@material-ui/core/styles';
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
                    <p>Hinter Appeteria verbergen sich die Gründer:</p>
                    <br/>
                    <p>
                        <li>Karsten Saß</li>
                        <li>Marc Woelms</li>
                        <li>Duc Anh Tran</li>
                    </p>
                </div>
                <div className="text pt-24">
                    <p>
                        Aus einer Aufgabe während des Studiums heraus gründeten wir die Appeteria UG um allen Leuten eine Übersicht der Mensen deutschlandweit zu bieten.
                    </p>
                </div>
            </div>
        )
    }
}

export default React.memo(AboutUs);