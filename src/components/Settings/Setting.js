import './Setting.css';
import '../../index.css';
import React, { Component } from 'react';
import {Divider} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import getUser, {
	getRolle,
	getListAllergene,
	setAllergene,
	delAllergene,
	setRolle
} from "../ServicesAPI/UserAPI";
import Switch from "@material-ui/core/Switch";
import MyNotiForm from "./CreateNotiForm";

class Setting extends Component{
    constructor(props) {
        super(props);
        this.state = getUser();
		localStorage.setItem('count', -1);
        this.onChangeRolle = this.onChangeRolle.bind(this)
    }

    onChangeRolle(e){
        setRolle(e.target.value);
    }

    onChangeSwitch(e){
    	if (e.target.checked){
    		setAllergene(e.target.value)
		}else{
			delAllergene(e.target.value)
		}
    }

    isAllergene(index){
    	let bool = false;
		this.state.allergene.map(allergene => {
			if (index == allergene){
				return bool = true
			}
		})
		return bool
	}
    
    render(){    	
    	return(
            <div className="setting-container">
        		<div className="personal-container">
	                <div className="personal-title-container">
		            	<p>Persönliche Einstellungen</p>
		        	</div>
		        	<Divider />
	                <div  className = "personal-role-container">
	                    <FormControl className="roleFieldSetting">
	                        <InputLabel>Rolle</InputLabel>
	                        <Select
	                            native defaultValue={this.state.rolle}
	                            onChange={(event) => this.onChangeRolle(event)}>
	                            	{getRolle().map(rolle => <option value={rolle}>{rolle}</option> )}
	                        </Select>
	                    </FormControl>
	                </div>
                </div>
                
                <div className="noti-container">
		            <div className="noti-title-container">
		                <p>Benachrichtigung</p>
		            </div>
		            <Divider />
		            <div className="noti-form-container">
		            	<MyNotiForm />
		            </div>
	            </div>
	            <div className="allergene-container">
	            	<div className="allergene-title-container">
	                	<p>Allergien</p>
                	</div>
                	<Divider />
                	<div className="allergene-select-container">
                		{getListAllergene().map((allergeneName, index) => (
            				<div className="allergene-row-container">
                    			<div className="allergene-switch-container">
    	                			<Switch
    	                				size="small"
    		                	        defaultChecked= {this.isAllergene(index)}
    		                	        onChange={(event) => this.onChangeSwitch(event)}
    	                				onClick= {null}
    		                	        name={allergeneName}
    		                	        value = {index}
    		                	        inputProps={{ 'aria-label': 'secondary checkbox' }}
    	                			/>
                    			</div>
                    			<div className="allergene-name-container">
                    				<p>{allergeneName}</p>
                    			</div>
                    		</div>
                		))}
                	</div>
	            </div>
            </div>
    	)
    }
}

export default React.memo(Setting);