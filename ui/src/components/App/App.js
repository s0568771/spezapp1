import './App.css';
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import User from '../../components/User/User';
import Home from '../../components/Home/Home';
import Setting from '../Settings/Setting'
import FavFood from '../FavFood/FavFood'
import AboutUs from '../AboutUs/AboutUs'
import Impressum from '../Impressum/Impressum'
import Routen from "../../components/Route/Route"
import {getUser} from "../ServicesAPI/UserAPI";
import {openPopUp} from "../ServicesAPI/CreatePopUp";
import {getGeolocationToLocalstore} from "../ServicesAPI/GeoAPI";
import MensenChoose from "../Mensen/MensenChoose";

// import firebase from '../../firebase';

class App extends Component {


    constructor(props){
        super(props);
		// this.state = {
		// 	mensen: getMensen()
		// }
        getGeolocationToLocalstore();
        // for first start
        // localStorage.clear()

    }
    componentDidMount() {
		if (!localStorage.getItem('mensen')){
			this.iniDB();
		}
    }

    iniDB() {
      axios.get('https://openmensa.org/api/v2/canteens/').then(response => response.data)
        .then((data) => {
          this.setState({ mensen: data })
          this.state.mensen.map((mensa)=>{
            if (this.state.geo != null){
              try {
                mensa.distanz = this.formatDezimal(this.calcDistanz(this.state.geo.lat, this.state.geo.lng, mensa.coordinates[0], mensa.coordinates[1]))
              }catch{
                console.log('error')
              }
            }
          })
        })

    }

    triggerOnlineOffline() {
    	function updateOnlineStatus(event) {
    		var noSignalIcon = document.getElementById("noSignal");
    		var appOnline = navigator.onLine;

    		appOnline ? window.location.reload() : openPopUp("Es besteht aktuell keine Verbindung zum Internet.");

    		if (noSignalIcon) {
    			noSignalIcon.style.display = appOnline ? "none" : "inherit";
    		}
    	}
    	window.addEventListener('online',  updateOnlineStatus);
    	window.addEventListener('offline', updateOnlineStatus);
    }

    render(){
    	this.triggerOnlineOffline();//Nur wenn es richtig weitergeleitet wird

		if (getUser()){
			// User existiert und wird direkt auf die Home weitergeleitet
			return(
				<Router>
					<div className='app_container'>
						<Header />
						{/*switch case*/}
						<Route exact path="/" component={Home} />
						{/*<Route exact path="/speisen:id" component={Home}/>*/}
						<Route exact path="/user" component={User} />
						<Route exact path="/mensen" component={MensenChoose} />
						<Route exact path="/route" component={Routen} />

						<Route exact path="/settings" component={Setting} />
						<Route exact path="/favfood" component={FavFood} />
						<Route exact path="/aboutus" component={AboutUs} />
						<Route exact path="/impressum" component={Impressum} />

						<Footer />
					</div>
				</Router>
			)
		}else{
			// User soll erstellt werden
            return(
        		<Router>
                	<div className='app_container'>
                    	<Header />
                        <Route exact path="/" component={User} />
                        <Route exact path="/mensen" component={MensenChoose} />
                        {/*<Route exact path="/route" component={Routen} />*/}

                        <Route exact path="/settings" component={User} />
                        <Route exact path="/favfood" component={FavFood} />
                        <Route exact path="/aboutus" component={AboutUs} />
                        <Route exact path="/impressum" component={Impressum} />

                        <Footer />
                    </div>
                </Router>
            )
		}
    }
}

export default React.memo(App);
