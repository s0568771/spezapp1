import './FavFood.css';
import React, { Component } from 'react';
import {Divider} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {IconFavFood} from "../ServicesAPI/CreateIconSVG";
import getUser, {changeFavFood} from "../ServicesAPI/UserAPI";
import MyScrollTrigger, {getRef} from "../ServicesAPI/CreateScrollTrigger";


class FavFood extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: getUser(),
            currentFav: [],
            isSearch: false,
            favFood_containerRef: getRef(),
        }
        localStorage.setItem('count', 0);
        if (getUser()){
            this.state.currentFav = this.state.user.favFood;
        }
    }
    
    componentDidMount() {
    	let elementToFocus = document.getElementById("searchFavFoodField");
    	if (elementToFocus) {
    		elementToFocus.focus();
    	}
    	this.setState({favFood_containerRef: this.state.favFood_containerRef});
    }
    
    handleInputChange = (e) => {
        let search = e.target.value.toUpperCase().trim();
        let results = [];
        this.state.results = [];
        getUser().favFood.map(food =>{
            let name = food.name.toUpperCase();
            let category = food.category.toUpperCase();
            if (name.indexOf(search) >= 0 ||
        		category.indexOf(search) >= 0){
                results.push(food);
            }
        })
        
        if (results.length === 0 && e.target.value.length === 0){
        	this.setState({ currentFav: getUser().favFood, isSearch: false});
        }else{
        	this.setState({ currentFav: results, isSearch: true});
        }

    }
    
    onClickChangeFav(dishName, dishNotes, dishCategory/*foodID*/){
		changeFavFood(dishName, dishNotes, dishCategory);
		this.setState({ user: getUser()});
		this.setState({ currentFav: getUser().favFood});
	}
    
    render(){
        return(
            <div className="favFood-container" ref={this.state.favFood_containerRef}>
            	{
		            (!getUser() || (!this.state.user.favFood || this.state.user.favFood.length == 0)) ? (
						<div className="notAvailable-container">
							<div className="foodNotText" id = "back-to-top-anchor">
								<p>Es sind noch keine Lieblingsspeisen vorhanden.</p>
							</div>
							<div className="iconError">
								<IconFavFood style={{"height": "auto", width: "auto"}}/>
							</div>
						</div>
					) : ( 
						<div className = "favFood-search-container">
							<div className="favFood-searchfield-container" id = "back-to-top-anchor">
				                <TextField
				                	id="searchFavFoodField"
				                    className="searchFieldFavFood" label="Suche"
				                    onChange={e => this.handleInputChange(e)}
				                />
				            </div>
			                <div className="containerFavFood">
				                <div className="s-12 favFoodNotFound">
				                	<br/>
				                	<p>
			                            {this.state.currentFav <= 0 ? (
		                                    "Es wurden keine Lieblingsspeisen gefunden."
			                            ) : (
		                            		this.state.isSearch ? (
	                            				"Deine Suchergebnisse:"
                            				) : (
                        						"Deine Lieblingsspeisen:"
                            				)
			                            )}
		                            </p>
                                    <Divider/>
		                        </div>
								{this.state.currentFav.map((food) => (
									<div className="favFoodField">
										<div className="favFoodTopDisplay">
											<div className='favFoodCat'>
												<p>{food.category}</p>
											</div>

											<div className='favFood-header'>
												<div className="favFoodName">
													{food.name}
												</div>
											</div>
											<div className="favFoodIcon">
												<IconButton onClick= {e => this.onClickChangeFav(food.name, food.notes, food.category)} color="secondary" aria-label="add an alarm" style={{"padding": 0}}>
													<FavoriteIcon color='primary'/>
												</IconButton>
											</div>
										</div>
										<Divider />
									</div>
								))}
							</div>
						</div>
					)
            	}
            	<MyScrollTrigger />
            </div>
        )
    }
}

export default React.memo(FavFood);