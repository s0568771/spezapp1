import './User.css';
import React, { Component } from 'react';
import stylePrimary900 from "../Style/Styles";
import { ThemeProvider } from '@material-ui/core/styles';
import {
    getRolle,
    setModel,
    setUser
} from "../ServicesAPI/UserAPI";
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from "@material-ui/core/InputLabel";
import {getGeolocationToLocalstore} from "../ServicesAPI/GeoAPI";

class User extends Component{

    constructor(prop){
        super(prop);
        this.state = setModel();
        localStorage.setItem('count', -1)
        this.onChangeRolle = this.onChangeRolle.bind(this)
        this.setUser = this.setUser.bind(this)
    }

    componentDidMount() {
        this.state.rolle = getRolle()[0]
        this.state.geo = getGeolocationToLocalstore();
    }

    onChangeRolle(e){
        this.state.rolle = e.target.value
    }

    setUser(){
        setUser(this.state)
    }

    render(){
        return(
        	<div className="container">
        		<div className="welcomeTitle"><p>Willkommen bei Appeteria!</p></div>
        		<div className="welcomeText"><p>Um dir den bestmöglichen Service bieten zu können, benötigen wir lediglich nur eine Information.</p></div>
        		<div  className = "containerRole">
	                <FormControl className="roleField">
	                	<InputLabel>Rolle</InputLabel>
		                <Select native defaultValue="" onChange={(event) => this.onChangeRolle(event)}>
                            {getRolle().map(rolle => <option value={rolle}>{rolle}</option> )}

		                </Select>
	                </FormControl>
                </div>

                <div className = "containerContinue">
                	<ThemeProvider theme={stylePrimary900()}>
						<Button className="continue" variant="contained" color="primary" href='/' onClick={this.setUser}>Weiter</Button>
                	</ThemeProvider>
                </div>
            </div>
        )
    }
}

export default React.memo(User);