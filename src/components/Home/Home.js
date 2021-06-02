import './Home.css'
import React, {Component} from 'react';
import Speiseplan from "../Speiseplan/Speiseplan";
import {getUser, setUser} from '../ServicesAPI/UserAPI';
import {getGeolocationToLocalstore} from "../ServicesAPI/GeoAPI";

class Home extends Component{
    constructor(props) {
        super(props);
        if (getUser()){
            this.state = getUser();
            if (!this.state.geo){
                this.state.geo = getGeolocationToLocalstore();
                setUser(this.state)
            }
        }
    }

    render(){
        return(
            <Speiseplan />
        )
    }
}

export default React.memo(Home);