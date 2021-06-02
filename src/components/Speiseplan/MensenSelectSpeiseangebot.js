import React, {Component} from "react";
import MensenChoose from "../Mensen/MensenChoose"

class MensenSelectSpeiseangebot extends Component{

    constructor(prop){
        super(prop);
    }
    
    render() {
    	return (
			<div className="mensenChoose-container">
				<MensenChoose/>
			</div>
		)
    }
}

export default React.memo(MensenSelectSpeiseangebot);