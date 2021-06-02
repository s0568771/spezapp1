import './Speiseplan.css';
import React, {Component} from 'react';

import FormControl from '@material-ui/core/FormControl';
import MySelectSearch from "./CreateSelectSearch";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';
import getMensen from "../ServicesAPI/MensenAPI";
import getUser, {
	getAllergenByIndex,
	getRolle,
	lastSetMensaIDundName,
	changeFavFood,
	compareFavFood
} from "../ServicesAPI/UserAPI";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import formatDezimal, {checkNull} from "../ServicesAPI/functionAPI";
import {getGeolocationToLocalstore} from "../ServicesAPI/GeoAPI";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from "@material-ui/core/IconButton";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import MyScrollTrigger, {getRef} from "../ServicesAPI/CreateScrollTrigger";
import MensenChoose from "../Mensen/MensenChoose";
import MyPopUp, {openPopUp} from "../ServicesAPI/CreatePopUp";
import MyLoad from "../ServicesAPI/CreateLoad";
import {IconClosed, IconMensen, IconNoSignal, IconVirus} from "../ServicesAPI/CreateIconSVG";
import MensenSelectSpeiseangebot from './MensenSelectSpeiseangebot';

class Speiseplan extends Component{

    constructor(prop){
        super(prop);
		this.state = {
			user: getUser(),
			geo: getGeolocationToLocalstore(),
			mensen: getMensen(),
			isFav: false,
			isFavFood: false,
			currentMensaID: Number,
			date: String,
			food: [],
            icon: {
            	isfav: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
            	notfav: "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
            },
			onLoad: true,
			dateToday: String,
			notesAll: [],
            notesFilter: [],
		}
		localStorage.setItem('count', 1);

		if (!this.state.user.lastSetMensaID) {
			this.state.onLoad = false;
		}

		const currentDate = new Date();
		this.state.dateToday =`${currentDate.getFullYear()}-${("00" + (currentDate.getMonth() + 1)).slice(-2)}-${("00" + currentDate.getDate()).slice(-2)}`;
		
		this.onChangeDate = this.onChangeDate.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.isAllergene = this.isAllergene.bind(this)
		
		this.getIDFromURL(); //zum Vorladen der zuletzt ausgewählten Mensen
    }

    componentDidMount() {
    	this.state.date = this.state.dateToday;
		this.loadFoodDependingOnConnection(false);
	}
    
    loadFoodDependingOnConnection(causeFromChangeDate) {
    	let appOnline = navigator.onLine;
    	let resultDataAccessible = this.getIDFromURL();
    	
    	if (resultDataAccessible) {
	    	appOnline ? this.onSubmit() : this.onSubmitOffline();
    	} else {
    		this.setState({onLoad: false});
    		if (causeFromChangeDate) {
        		openPopUp("Bitte wählen Sie zunächst eine Mensa aus, bevor Sie das Datum anpassen.");
        	}
    	}
    }
    
	getIDFromURL(){
		let dataAccessible = false; 
		if (this.getQueryVariable('id') && this.getQueryVariable('name')) {
			lastSetMensaIDundName(this.getQueryVariable('id'), this.getQueryVariable('name'));
			dataAccessible = true;
		}else if (this.state.user.lastSetMensaID){
			dataAccessible = true;
		}
		this.state.user = getUser();
		return dataAccessible;
	}

	getQueryVariable(variable)
	{
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}

	cleanName(name){
		return decodeURI(name)
	}
	
	onChangeDate(e){
    	this.state.notesFilter = []
		this.state.date = e.target.value
		this.loadFoodDependingOnConnection(true);
	}
	onSubmit() {
		const url = 'https://openmensa.org/api/v2/canteens/'+this.state.user.lastSetMensaID+'/days/'+this.state.date+'/meals'
		axios.get(url)
			.then((res) => {
				this.state.food = res.data;
				this.initFavFood();
				this.setState({ food: this.state.food });
				this.setState({ onLoad: false });
			}).catch((error) => {
			// console.log(error)
			this.setState({ food: null, onLoad: false});
		});

	}

	initFavFood(){
		this.state.food.map((food)=>{
			food.isFav = false
			getUser().favFood.map(favFood =>{
				if ( compareFavFood(food, favFood) ) {
					food.isFav = true
				}
			})
		})
	}
	
	onSubmitOffline() {
		if (this.state.user.lastSavePointDate == this.state.date && this.state.user.lastSetMensaIDOffline == this.state.user.lastSetMensaID) {
			this.state.food =  this.state.user.lastSetDishesOffline;
			this.initFavFood();
			this.setState({ food: this.state.food });
		} else {
			this.state.food=[];
		}
		this.setState({ onLoad: false });
	}

	startsWithCapital(word){
		return word.charAt(0) === word.charAt(0).toUpperCase()
	}

	checkNoteInFilter(note){
		// console.log(this.state)
		const notesFilter = this.state.notesFilter
		if (notesFilter.indexOf(note) <= -1){
			//Nicht drin
			return false
		}else{
			//drin
			return true
		}
	}

	note(e, note){
		// console.log(e)
		const notesFilter = this.state.notesFilter
		if (notesFilter.indexOf(note) <= -1){
			//add
			notesFilter.push(note)
		}else{
			//del
			notesFilter.splice(notesFilter.indexOf(note), 1);
		}
		this.state.notesFilter = notesFilter
		this.setState({notesFilter: notesFilter})
		// console.log(this.state)
		// console.log(note)
	}

	color(isAllergene, isFilter){
    	if (isAllergene && isFilter){
			return 'rgb(228,52,92, 1)' // 'rgb(100,1000,0)'
		}
		if (isAllergene && !isFilter){
			return 'rgb(228,52,92, 0.5)' // 'rgb(100,1000,0)'
		}
		if (!isAllergene && isFilter){
			return 'rgb(13,71,161, 1)' // 'rgb(100,1000,0)'
		}
		if (!isAllergene && !isFilter){
			return 'rgb(13,71,161, 0.5)' // 'rgb(100,1000,0)'
		}
	}

	isSetFilter(food){
    	let bool = true
    	if (this.state.notesFilter.length > 0){
			this.state.notesFilter.map(filter=>{
				if (food.notes.indexOf(filter) <= -1){
					bool = false
				}
			})
		}else{
    		bool = true
		}
		return bool
	}

	isAllergene(note){
		let bool = false;
		this.addNote(note)
    	let notes_split = note.split(' ')
		notes_split.map(note_split=>{
			if (this.startsWithCapital(note_split)){
				let myAllergene = this.state.user.allergene;
				myAllergene.map( allergen => {
					const myAllergene = getAllergenByIndex(allergen)
					if (myAllergene.indexOf(note_split) > -1){
						bool = true
					}
				})
			}
		})
		return bool
	}

	addNote(note){
    	if (this.state.notesAll.indexOf(note) <= -1){
			this.state.notesAll.push(note)
		}
    	// console.log(this.state)
	}

	onClickChangeFav(dishName, dishNotes, dishCategory/*foodID*/){
		changeFavFood(dishName, dishNotes, dishCategory);
		/*let mensaID = this.state.user.lastSetMensaID
		if (!setFavFood(mensaID, foodID)){
			// console.log('del foodID')
			delFavFood(mensaID, foodID)
		}else{
			// console.log('set foodID')
			setFavFood(mensaID, foodID)
		}*/
		this.initFavFood();
		this.setState({ food: this.state.food });
	}
	
    render(){
		const plan_containerRef = getRef();
		//pointer-events: none;
        return(
        	<div className="plan-container" ref={plan_containerRef}>
        		<div className = "containerInstitute" id ="back-to-top-anchor">
					<FormControl className="instituteField">
						<InputLabel id="demo-customized-select-label">Mensen</InputLabel>
						<MySelectSearch
							value='nameMensa'
						>
							<option value = "nameMensa" style = {{"display": "none"}}>{this.cleanName(this.state.user.lastSetMensaName)}</option>
							<div className="closeSearch-container">
								<IconButton>
									<CloseRoundedIcon style={{"width": "3.5vh"}}/>
								</IconButton>
							</div>
							<MensenSelectSpeiseangebot />
						</MySelectSearch>
					</FormControl>
            	</div>
            	<div className="containerDate">
            		<form className="dateField" noValidate>
		                <TextField
							className="dateText"
							label="Datum"
							type="date"
							defaultValue={this.state.dateToday}
							InputLabelProps={{ shrink: true }}
							onChange={(event) => this.onChangeDate(event)}/>
	                </form>
                </div>

				<div className="containerDish">
					{
						this.state.onLoad ? (
							<div className="load-container">
								<MyLoad />
							</div>
						):(
							(!this.state.food || this.state.food.length == 0) ? (
								this.state.user.lastSetMensaID ? (
									navigator.onLine ? (
										!this.state.food ? (
											<div className="notAvailable-container">
												<div className="mensaChoosedText">
													<p>Diese Mensa ist heute geschlossen.</p>
												</div>
												<div className="iconError">
													<IconClosed style={{"height": "auto", width: "auto"}}/>
												</div>
											</div>
										) : (
											<div className="notAvailable-container">
												<div className="mensaChoosedText">
													<p>Auf Grund von Covid-19 bietet diese Mensa aktuell kein Speiseangebot an.</p>
												</div>
												<div className="iconError iconVirus">
													<IconVirus style={{"height": "auto", width: "auto"}}/>
												</div>
											</div>	
										)
									) : (
										<div className="notAvailable-container">
											<div className="mensaChoosedText">
												<p>Zurzeit gibt es keine Internetverbindung.</p>
											</div>
											<div className="iconError">
												<IconNoSignal style={{"height": "auto", width: "auto"}}	/>
											</div>
										</div>
									)
								) : (
									<div className="notAvailable-container">
										<div className="mensaNotChoosenText">
											<p>Wir Bitten Sie, sich eine Mensa auszuwählen.</p>
										</div>
										<div className="iconError">
											<IconMensen style={{"height": "auto", width: "auto"}}/>
										</div>
										<MyPopUp />
									</div>
								)
							) : (
								this.state.food.map((food) => (

									(this.isSetFilter(food) === true)?(
										<div className="dishField">
											<div className="dishTopDisplay">
												<div className='dishCat'>
													<p>{food.category}</p>
												</div>

												<div className='dish-header'>
													<div className="dishName">
														{food.name}
													</div>
												</div>
												<div className="dish-favIcon">
													<IconButton onClick= {e => this.onClickChangeFav(food.name, food.notes, food.category)} color="secondary" aria-label="add an alarm" style={{"padding": 0}}>
														{(food.isFav) ? (
															<FavoriteIcon color='primary'/>
														) : (
															<FavoriteBorderIcon color='primary'/>
														)}
													</IconButton>
												</div>
											</div>
											<div className='dishPrices'>
												{
													(food.prices.students != null || food.prices.employees != null || food.prices.others != null )?(
														<div>
															<div className={this.state.user.rolle === getRolle()[0] ? "fett" : ""}>
																<p>{getRolle()[0]}: {checkNull(formatDezimal(food.prices.students))} € |&nbsp;</p>
															</div>
															<div className={this.state.user.rolle === getRolle()[1] ? "fett" : ""}>
																<p>{getRolle()[1]}: {checkNull(formatDezimal(food.prices.employees))} € |&nbsp;</p>
															</div>
															<div className={this.state.user.rolle === getRolle()[2] ? "fett" : ""}>
																<p>{getRolle()[2]}: {checkNull(formatDezimal(food.prices.others))} €</p>
															</div>
														</div>
													):(
														''
													)
												}
												{/*<div className={this.state.user.rolle === getRolle()[0] ? "fett" : ""}>*/}
												{/*	<p>{getRolle()[0]}: {formatDezimal(food.prices.students)} € |&nbsp;</p>*/}
												{/*</div>*/}
												{/*<div className={this.state.user.rolle === getRolle()[1] ? "fett" : ""}>*/}
												{/*	<p>{getRolle()[1]}: {formatDezimal(food.prices.employees)} € |&nbsp;</p>*/}
												{/*</div>*/}
												{/*<div className={this.state.user.rolle === getRolle()[2] ? "fett" : ""}>*/}
												{/*	<p>{getRolle()[2]}: {formatDezimal(food.prices.others)} €</p>*/}
												{/*</div>*/}
											</div>

											<div className="dishChips">
												{food.notes.map((note) => (
													<div className="chip">
														<Chip
															className='notes'
															value={'false'}
															size="small"
															disabled={false}
															label={note}
															onClick={e => this.note(e, note)}
															style={
																{
																	"backgroundColor": this.color(this.isAllergene(note), this.checkNoteInFilter(note))
																}
															} />
													</div>
												))}
											</div>
											<Divider />
										</div>
									):(
										''
									)
								))
							)
						)
					}
				</div>
				<MyScrollTrigger />
            </div>
        )
    }
}

export default React.memo(Speiseplan);