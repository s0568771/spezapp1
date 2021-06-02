import './App.css';
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import User from '../../components/User/User';
import Home from '../../components/Home/Home';
import Mensen from '../Mensen/Mensen'
import Setting from '../Settings/Setting'
import FavFood from '../FavFood/FavFood'
import AboutUs from '../AboutUs/AboutUs'
import Impressum from '../Impressum/Impressum'
//import OSM from '../../components/Maps/OSM/OSM';
import Routen from "../../components/Route/Route"
import {getUser} from "../ServicesAPI/UserAPI";
import {openPopUp} from "../ServicesAPI/CreatePopUp";
import {getGeolocationToLocalstore} from "../ServicesAPI/GeoAPI";
import MensenChoose from "../Mensen/MensenChoose";
import getMensen from "../ServicesAPI/MensenAPI";
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
		// console.log('abfrage')
		// this.state.mensen = []
		// localStorage.removeItem('mensen')

    	// locale Abfrage, ob DB gefüllt ist
		console.log('inirDB')
		axios.get('http://localhost:5000/mensen').then(response => response.data)
    		.then((data) => {
    			this.setState({ mensen: data })
    			if (this.state.mensen.length === 0){
    				this.getDataANDSave('https://openmensa.org/api/v2/canteens', true);
    			}
				localStorage.setItem('mensen', JSON.stringify(this.state.mensen));

		}).catch((error) => {
			// localStorage.removeItem('mensen')

			axios.get('https://openmensa.org/api/v2/canteens').then(response => response.data)
				.then((data) => {
					this.setState({ mensen: data })
					// console.log(data)
					// console.log(this.state.mensen)
					localStorage.setItem('mensen', JSON.stringify(this.state.mensen));
					// this.state.mensen = data
					// if (save){
					// 	this.saveData();
					// }
				});
		});

    }

	getDataANDSave(url, save) {
    	axios.get(url).then(response => response.data)
    		.then((data) => {
				this.state.mensen = data
				this.setState({ mensen: data })
				if (save){
					this.saveData();
				}

    		});
    }

    saveData() {
    	this.state.mensen.forEach(item => {
    		axios.post('http://localhost:5000/mensen', item, {
    			headers: {
    				'content-type': 'application/json'
    			}
    		});
    	});
		this.iniDB();

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
