import './Mensen.css';
import React, { Component } from 'react';
import {getMensen, setMensen} from "../ServicesAPI/MensenAPI";
import {distance, getGeolocationToLocalstore} from "../ServicesAPI/GeoAPI";
import formatDezimal, {splitAdressToStreet, splitAdressToPostcode, sortJSON} from "../ServicesAPI/functionAPI";
import getUser, {getFavMensen, delFavMensen, setFavMensen} from "../ServicesAPI/UserAPI";
import TextField from "@material-ui/core/TextField";
import {Divider} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MyScrollTrigger, {getRef} from "../ServicesAPI/CreateScrollTrigger";

class Mensen extends Component{

    constructor(props){
        super(props);
        this.state = {
        	mensen: getMensen(),
            geo: getGeolocationToLocalstore(),
            allRefFav: this.createRef(getMensen()),
            currentFav: getFavMensen(),
            icon: {
            	isfav: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
        		notfav: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
            	},
			query: '',
			results: [],
			isResults: false,
        }
		localStorage.setItem('count', 2);
		if (getGeolocationToLocalstore()){
			this.setState({
				geo: getGeolocationToLocalstore()
			})
		}

		this.state.mensen.map((mensa)=>{
			if (mensa.coordinates[0] != null){
				mensa.distance = formatDezimal(distance(this.state.geo.lat, this.state.geo.lng, mensa.coordinates[0], mensa.coordinates[1]))
			}
		})
		this.state.mensen = sortJSON(this.state.mensen, "distance")
		this.state.results = sortJSON(this.state.mensen, "distance")

		if (getUser()){
			this.state.user= getUser();
		}

        this.onClickToFavMensa = this.onClickToFavMensa.bind(this);
        this.onClickFavMensa = this.onClickFavMensa.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        console.log(this.state)
    }
    
    componentDidMount(){
    	
    }

	handleInputChange = (e) => {
    	const results = []
		this.isResults = false
		const search = e.target.value.toUpperCase().trim();

		this.state.mensen.map(mensa =>{
			const name = mensa.name.toUpperCase();
			const address = mensa.address.toUpperCase()
			if (name.indexOf(search) > 0 ||
				address.indexOf(search) > 0){
				this.isResults = true
				results.push(mensa)
			}
		})

		if (results.length === 0 && e.target.value.length === 0){
			this.setState({
				results: this.state.mensen
			})
		}else{
			this.setState({
				results: results
			})
		}
	}

	createRef(allMensen){
		const listRef = {};
		for (const i in allMensen) {
    		listRef[allMensen[i]["id"]] = React.createRef();
    	}
    	return listRef;
    }
    
    createFav(listFav) {
    	// for (const i in listFav) {
    	// 	if (this.state.allRefFav[i].current) {
        // 		this.state.allRefFav[i].current.childNodes[0].setAttribute("d",this.state.icon.isfav);
        // 	}
    	// }
    }
    
        
    onClickFavMensa(e, mensaId){
    	if (!this.state.currentFav) {
    		this.state.currentFav = [];
    	}
    	if (this.state.currentFav.includes(mensaId)) {
    		//delFavMensen(mensaId);
    		let index = this.state.currentFav.indexOf(mensaId);
    		this.state.currentFav.splice(index,1);
    		this.state.allRefFav[mensaId].current.childNodes[0].setAttribute("d",this.state.icon.notfav);
    	} else {
    		//setFavMensen(mensaId);
    		this.state.currentFav.push(mensaId);
    		this.state.allRefFav[mensaId].current.childNodes[0].setAttribute("d",this.state.icon.isfav);
    	}
    	console.log(this.state)
    }
    
    onClickToFavMensa(e){
        setFavMensen(e.target.value)
    }

    onClickDelFavMensa(e){
        delFavMensen(e.target.value)
    }

    setDistance(mensa, value){
    	return mensa.distance = value
	}

    render(){
		const isResults = this.state.isResults;
		const mensa_containerRef = getRef();
        return(
            <div className="mensa-container" ref={mensa_containerRef}>
	    		<div className = "mensa-search-container" id ="back-to-top-anchor">
	    			<div className="mensa-searchfield-container">
			            <TextField
			                className="searchFieldMensa" label="Suche"
							ref={input => this.search = input}
							onChange={e => this.handleInputChange(e)}
			            />
		            </div>
	            </div>
	            <div className="mensa-all-container">
					{isResults ? (
						this.state.results = this.state.mensen
					) : ('')}
	            	{this.state.results.map((mensa) => (
            			<div>
			            	<div className="mensa-card-container">
			            		<div className="mensa-institute-container">
			            			<div className="mensa-institute-name">
			            				<p>{mensa.name}</p>
			            			</div>
			            			<div className="mensa-institute-street">
										<p>{mensa.address}</p>
			            				{/*<p>{splitAdressToStreet(mensa.address)}</p>*/}
			            			</div>
			            			{/*<div className="mensa-institute-postcode">*/}
			            			{/*	<p>{splitAdressToPostcode(mensa.address)}</p>*/}
			            			{/*</div>*/}
			            		</div>
			            		<div className = "mensa-icon-container">
				            		<div className="mensa-chevro-icon">
					            		<IconButton href={'/?id=' + mensa.id} color="secondary" aria-label="add an alarm">
											<ChevronRightIcon color='primary'/>
										</IconButton>
				            		</div>
				            		<div className="mensa-location-icon">
					            		<IconButton href="/route" color="secondary" aria-label="add an alarm">
											<LocationOnIcon color='primary'/>
										</IconButton>
										<div className="mensa-location-distance" href="/route">
											{mensa.distance}&nbsp;km
										</div>
				            		</div>
				            		<div className="mensa-star-icon">
					            		<IconButton onClick={e => this.onClickFavMensa(e, mensa.id)} color="secondary" aria-label="add an alarm" >
				            				<StarBorderIcon ref = {this.state.allRefFav[mensa.id]} color="primary"/>
			        					</IconButton>
				            		</div>
			            		</div>
			            	</div>
			            	<div className="mensa-divider-container">
			            		<Divider />
		            		</div>
	            		</div>
            		))}´
	            </div>
	            {this.createFav(getFavMensen())}
	        	<MyScrollTrigger />
            </div>
        )
    }
}

export default React.memo(Mensen);