import './Mensen.css';
import React, {Component} from 'react';
import {getMensen} from "../ServicesAPI/MensenAPI";
import {distance, getGeolocationToLocalstore} from "../ServicesAPI/GeoAPI";
import formatDezimal, {sortJSON} from "../ServicesAPI/functionAPI";
import getUser, {delFavMensen, setFavMensen} from "../ServicesAPI/UserAPI";
import TextField from "@material-ui/core/TextField";
import {Divider} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MyScrollTrigger, {getRef} from "../ServicesAPI/CreateScrollTrigger";

class Mensen extends Component{

    constructor(props){
        super(props);
        this.state = {
            user: getUser(),
            mensen: getMensen(),
            geo: getGeolocationToLocalstore(),
            icon: {
                isfav: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
                notfav: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
            },
            query: '',
            results: [],
            isResults: false,
            listMensen:[],
            favMensen: [],
            isFav: false,
            mensa_containerRef: getRef(),
        }
        localStorage.setItem('count', 2);
        if (getGeolocationToLocalstore()){
            this.setState({
                geo: getGeolocationToLocalstore()
            })
        }
        console.log(this.state)
        this.state.mensen.map((mensa)=>{

            if (getGeolocationToLocalstore() && mensa.coordinates != null){
                mensa.distance = formatDezimal(distance(this.state.geo.lat, this.state.geo.lng, mensa.coordinates[0], mensa.coordinates[1]))
            }
        })
        
        this.initListen();

        // this.initListen = this.initListen.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onClickFavMensa = this.onClickFavMensa.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        // console.log(this.state)
        
        /*
    	 * https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    	 * Die anonyme Funktion window.mobileCheck wurde aus einer Lösung aus Stackoverflow übernommen
    	 * Die Funktion überprüft, ob das genutzte Gerät vom User einn mobiles Gerät ist oder nicht.
    	 * return: mobiles Gerät = true 
    	 */
    	window.mobileCheck = function() {
    		  let check = false;
    		  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    		  return check;
		};
		this.state.isMobile = window.mobileCheck();
    }
    
    componentDidMount() {
		if(!this.state.isMobile) {
			document.getElementById("searchMensaField").focus();
	    	this.setState({mensa_containerRef: this.state.mensa_containerRef});
		}
    }

    initListen(){
        this.state.results = []
        this.state.favMensen = []
        this.state.listMensen = []
        if (getUser()){
            this.state.user = getUser()
        }


        this.setState({
            isFav: false
        })

        // console.log(this.state)

        this.state.mensen.map((mensa)=>{
            if (getUser()){
                if (this.state.user.favMensen.indexOf(mensa.id) > -1){
                    mensa.isFav = true
                    this.state.favMensen.push(mensa)
                    this.setState({
                        isFav: true
                    })
                }else{
                    mensa.isFav = false
                    this.state.listMensen.push(mensa)
                }
            }else{
                this.state.listMensen = this.state.mensen
            }

        })
        this.state.mensen = sortJSON(this.state.mensen, "distance")

        this.state.results.push(sortJSON(this.state.favMensen, "distance"))
        this.state.results.push(sortJSON(this.state.listMensen, "distance"))

        this.state.favMensen.display = 'Deine Favoriten'
        this.state.listMensen.display = 'Mensen'

    }

    handleInputChange = (e) => {
        const search = e.target.value.toUpperCase().trim();
        const results = []
        this.state.results = []
        this.state.isResults = false

        this.state.mensen.map(mensa =>{
            const name = mensa.name.toUpperCase();
            const address = mensa.address.toUpperCase()
            if (name.indexOf(search) > 0 ||
                address.indexOf(search) > 0){
                this.state.isResults = true
                results.push(mensa)
            }
        })

        if (results.length === 0 && e.target.value.length === 0){
            this.state.results.push(sortJSON(this.state.favMensen, "distance"))
            this.state.results.push(sortJSON(this.state.listMensen, "distance"))
        }else{
            results.display = 'Deine Suchergebnisse'
            this.state.results[0] = results
        }

        this.setState({
            isResults: true
        })
    }

    onClickFavMensa(e, mensaId){
        if (!setFavMensen(mensaId)){
            delFavMensen(mensaId)
        }else{
            setFavMensen(mensaId)
        }
        this.initListen();
    }

    setDistance(mensa, value){
        return mensa.distance = value
    }

    openNav(e, address){
        // console.log('address');
        // var win = window.open('https://www.google.com/maps/search/?api=1&query='+address, '_blank');
        // win.focus();
    }

    NewTab(e, search) {
        window.open(
            'https://www.google.com/maps/search/?api=1&query=' + search, "_blank");
    }

    render(){
        return(
            <div className="mensa-container" ref={this.state.mensa_containerRef}>
                <div className = "mensa-search-container" id ="back-to-top-anchor">
                    <div className="mensa-searchfield-container">
                        <TextField
                        	id="searchMensaField"
                            className="searchFieldMensa" label="Suche"
                            ref={input => this.search = input}
                            onChange={e => this.handleInputChange(e)}
                        />
                    </div>
                </div>
                <div className="mensa-all-container">
                    {this.state.results.map((mensenCat) => (
                        <div>
                            <div className="mensa-divider-container s-12">
                                <div className="mensa-institute-name">
                                    {/*{console.log(this.state.isFav)}*/}
                                    {mensenCat.length > 0 ? (
                                        <div>
                                            <br/>
                                            <p>{mensenCat.display}</p>
                                            <Divider/>
                                        </div>
                                    ) : ('')}
                                </div>
                            </div>

                            {mensenCat.map((mensa)=>(
                                <div>
                                    <div className="mensa-card-container">
                                        <div className="mensa-institute-container">
                                            {(window.location.pathname == '/mensen') ? (
                                                <div>
                                                    <div className="mensa-institute-name">
                                                        <a className='withoutHyperlink' href={'/?id=' + mensa.id + '&name=' + mensa.name}>
                                                            <p>{mensa.name}</p>
                                                        </a>
                                                        {/*<p>{mensa.name}</p>*/}
                                                    </div>

                                                    <div className="mensa-institute-street">
                                                        <p>{mensa.address}</p>
                                                        {/*<p>{splitAdressToStreet(mensa.address)}</p>*/}
                                                    </div>
                                                </div>

                                            ) : (
                                                <div>
                                                    <div className="mensa-institute-name" style={{'margin-top': 10}}>
                                                        <a className='withoutHyperlink' href={'/?id=' + mensa.id + '&name=' + mensa.name}>
                                                            <p>{mensa.name}</p>
                                                        </a>
                                                    </div>

                                                    <div className="mensa-institute-street" style={{'font-size': '9px'}}>
                                                        <p>{mensa.address}</p>
                                                        {/*<p>{splitAdressToStreet(mensa.address)}</p>*/}
                                                    </div>
                                                </div>
                                            )}
                                            {/*<div className="mensa-institute-street">*/}
                                            {/*    <p>{mensa.address}</p>*/}
                                            {/*    /!*<p>{splitAdressToStreet(mensa.address)}</p>*!/*/}
                                            {/*</div>*/}
                                            {/*<div className="mensa-institute-postcode">*/}
                                            {/*	<p>{splitAdressToPostcode(mensa.address)}</p>*/}
                                            {/*</div>*/}
                                        </div>
                                        <div className = "mensa-icon-container">
                                            <div className="mensa-chevro-icon">
                                                <IconButton href={'/?id=' + mensa.id + '&name=' + mensa.name} color="secondary" aria-label="add an alarm">
                                                    <ChevronRightIcon color='primary'/>
                                                </IconButton>
                                            </div>
                                            <div className="mensa-location-icon">
                                                {/*<IconButton href={'https://www.google.com/maps/search/?api=1&query=' + mensa.name + ',' + mensa.address } color="secondary" aria-label="add an alarm">*/}
                                                <IconButton onClick={e => this.NewTab(e, mensa.name + ',' + mensa.address)} color="secondary" aria-label="add an alarm">
                                                    <LocationOnIcon color='primary'/>
                                                </IconButton>
                                                <div className="mensa-location-distance">
                                                    {mensa.distance}&nbsp;km
                                                </div>
                                            </div>
                                            <div className="mensa-star-icon">
                                                <IconButton onClick={e => this.onClickFavMensa(e, mensa.id)} color="primary" aria-label="add an alarm" >
                                                    {mensa.isFav === true ? (
                                                            <StarIcon color="primary"/>
                                                        ) : (
                                                            <StarBorderIcon color="primary"/>
                                                        )}
                                                    {/*<StarBorderIcon ref = {this.state.allRefFav[mensa.id]} color="primary"/>*/}
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    ))}
                </div>
                <MyScrollTrigger />
            </div>
        )
    }
}

export default React.memo(Mensen);