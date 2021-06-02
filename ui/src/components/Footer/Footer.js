import './Footer.css';
import '../../index.css'
import React, {Component} from 'react';
import stylePrimary900 from "../Style/Styles";
import MyBottomNav from './CreateBottomNav'
import {ThemeProvider} from '@material-ui/core/styles';

;


class Footer extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className='footer-container'>
            	<ThemeProvider theme={stylePrimary900()}>
            		<MyBottomNav className="bottom-nav"/>
	            </ThemeProvider>
            </div>
        )
    }
}

export default React.memo(Footer);
