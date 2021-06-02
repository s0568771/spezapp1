import React, {Component} from 'react';
import Client from "./Client";

import './App.css';
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from '@material-ui/core/Divider';
import IconButton from "@material-ui/core/IconButton";


class App extends Component {
  options;
  constructor(props) {
    super(props);
    this.state = {
      lastMensa: '7',
      date: '',
      mensen : [],
      food: [],
      checked: false,
      favfood: [],
      geo: this.updateGeolocationToLocalstore()
    };

    const currentDate = new Date();
    this.state.date =`${currentDate.getFullYear()}-${("00" + (currentDate.getMonth() + 1)).slice(-2)}-${("00" + currentDate.getDate()).slice(-2)}`;


    // if (this.getGeolocationToLocalstore()){
    //   this.setState({
    //     geo: this.getGeolocationToLocalstore()
    //   })
    // }

    // navigator.geolocation.getCurrentPosition(function(position) {
    //   let geo = {
    //     lat: 0,
    //     lng: 0
    //   }
    //   geo.lat = position.coords.latitude
    //   geo.lng = position.coords.longitude
    //   localStorage.setItem('geo', JSON.stringify(geo));
    //
    //   console.log(localStorage.getItem('geo').lat)
    // });

    //Openmensa init: Datenabruf
    this.iniDB();

    this.onSubmit()

    this.onChangeDate = this.onChangeDate.bind(this)
    this.onChangeMensa = this.onChangeMensa.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentDidMount() {
    Client.getSummary(summary => {
      this.setState({
        title: summary.content
      });
    });
    // this.setGeo()
  }

  getGeolocationToLocalstore(){
    // localStorage.clear()
    if (!localStorage.getItem('geo')){
      return this.updateGeolocationToLocalstore();
    }else{
      return JSON.parse(localStorage.getItem('geo'));
    }

  }

  updateGeolocationToLocalstore(){
    let state = {
      lat: 0,
      lng: 0
    }
    // console.log('update startet')
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        state.lat = lat;
        state.lng = lng;
        localStorage.setItem('geo', JSON.stringify(state));
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );
    return JSON.parse(localStorage.getItem('geo'));
  }

  // Quelle von: https://spectrum.chat/react-native/help/geolocation-and-calculating-distances~4afd885f-e51c-4f87-8e20-8675017f254d
  // return Entfernung in Km
  calcDistanz(coordinate1_lat, coordinate1_lng, coordinate2_lat, coordinate2_lng){
    const toRadian = n => (n * Math.PI) / 180
    let lat2 = coordinate2_lat
    let lon2 = coordinate2_lng
    let lat1 = coordinate1_lat
    let lon1 = coordinate1_lng
    let R = 6371 // km
    let x1 = lat2 - lat1
    let dLat = toRadian(x1)
    let x2 = lon2 - lon1
    let dLon = toRadian(x2)
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return d // in km
  }

  onChangeMensa(e){
    this.state.lastMensa = e.target.value;
    this.setState({
      lastMensa: e.target.value
    });
  this.onSubmit()
  }

  onChangeDate(e){
    this.state.date = e.target.value;
    this.setState({
      date: e.target.value
    });
    this.onSubmit()
  }

  onSubmit() {
    if (this.state.lastMensa !== '' && this.state.date !== ''){

      // Favoriten aus DB abrufen
      this.favFood()

      // Speisen aus Mensa X am Tag Y abrufen, und anschließend prüfen,
      // ob eine Speise in Favoriten ist, setze dann Fav=true
      this.state.food = []
      const url = 'https://openmensa.org/api/v2/canteens/'+this.state.lastMensa+'/days/'+this.state.date+'/meals'
      axios.get(url)
        .then((res) => {
          this.state.food = res.data;
          this.state.food.forEach(item => {
            let id = item.id
            if (this.state.favfood.indexOf(id) > -1){
              item.fav = true
            }else{
              item.fav = false
            }
          })
          this.setState({ food: this.state.food });
        })

    }
  }

  favFood() {
    axios.get('http://localhost:9000/api/getAllFood')
      .then((res) => {
        this.state.favfood = res.data;
        this.setState({ favfood: this.state.favfood });
      })
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

  formatDezimal(price){
    var value = price;
    if (value !== null){
      value = value.toFixed(2);
    }else{
      // value = ''
    }
    return value
  }

  handleChange(event) {
    this.state.food.forEach( f => {
      const fid = f.id.toString();
      const fname = f.name
      if (fid === event.target.value){
        let body = {
          "id": fid,
          "name": fname
        }
        // console.log(body)
        axios.post('http://localhost:9000/api/insertFood', body);
        this.favFood()
      }
    })

  }

  // getDataANDSave(url, save) {
  //   axios.get(url).then(response => response.data)
  //     .then((data) => {
  //       this.state.mensen = data
  //       this.setState({ mensen: data })
  //       if (save){
  //         this.saveData();
  //       }
  //
  //     });
  // }
  //
  // saveData() {
  //   this.state.mensen.forEach(item => {
  //     axios.post('http://localhost:9000/api/insert', item, {
  //       headers: {
  //         'content-type': 'application/json'
  //       }
  //     });
  //   });
  //   this.iniDB();
  //
  // }

  // isFav(foodID, foodName){
  //   let bool = false
  //   let str = this.state.favfood;
  //
  //   if (str.indexOf(foodID) > -1 ) {// || str.indexOf(foodName) > -1){
  //     bool = true
  //     return true
  //     console.log("gefunden")
  //   }else{
  //     console.log("nicht gefunden")
  //   }
  //   return false
  // }

  render() {
    console.log(this.state)
    return (
      // <Router>
        <div className="App">
          <div className="Header">
            <h1>Welcome to Appeteria</h1>
          </div>

          <div>
            <div>
              <Chip
                size={"small"}
                label='SortByName'
                disabled={false}
                // defaultChecked={true}
                onClick={e => this.handleChange(e)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <Chip
                size={"small"}
                label='SortByLocation'
                disabled={false}
                // defaultChecked={true}
                onClick={e => this.handleChange(e)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>

            <div>
              <FormControl className="dateText">
                <Select
                  native
                  value={this.state.lastMensa}
                  onChange={(e) => this.onChangeMensa(e)}
                >
                  {
                    this.state.mensen.map(mensa => (
                      <div>

                        <div className="mensenChoose-container">
                          <option value={mensa.id}
                          >
                            {mensa.distanz} km | {mensa.name}</option>
                        </div>
                      </div>


                    ))}
                  }
                </Select>
              </FormControl>

              {/*<InputLabel>Mensen</InputLabel>*/}
              {/*<FormControl className="dateText">*/}
              {/*  <Select*/}
              {/*    native*/}
              {/*    value={this.state.lastMensa}*/}
              {/*    onChange={(e) => this.onChangeMensa(e)}*/}
              {/*  >*/}
              {/*    {*/}
              {/*      this.state.mensen.map(mensa => (*/}
              {/*        <option value={mensa.id}*/}
              {/*        >*/}
              {/*          {mensa.distanz} km | {mensa.name}</option>*/}
              {/*      ))}*/}
              {/*    }*/}
              {/*  </Select>*/}
              {/*</FormControl>*/}
              <br/>
              <br/>
              <form noValidate>
                <TextField
                  className="dateText"
                  id="date"
                  // label="Datum"
                  type="date"
                  value={this.state.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                  onChange={e => this.onChangeDate(e)}
                />
              </form>

            </div>


            <div className="containerDish">
              {
                (this.state.food.length > 0) ? (
                    this.state.food.map((food) => (
                      <div className="dishField">
                        <div className="dishTopDisplay">
                          <div className='dishCat'>
                            {/*<p>{food.category}</p>*/}
                          </div>

                          <div className='dish-header'>
                            <div className="dishName fett700">
                              {food.name}
                            </div>

                          </div>
                          <div className="dish-favIcon">
                            <IconButton onClick={e => this.handleChange(e)} color="secondary" aria-label="add an alarm" style={{"padding": 0}}>
                              {(food.fav === true) ? (
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                  {/*{console.log(food)}*/}
                                  <Checkbox
                                    value={food.id}
                                    defaultChecked={true}
                                    // onChange={e => this.handleChange(e)}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
                                  <Checkbox
                                    value={food.id}
                                    defaultChecked={false}
                                    // onChange={e => this.handleChange(e)}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                  />
                                </div>
                              )}
                            </IconButton>
                          </div>
                        </div>
                        <div className='dishPrices'>
                          <p>Student: {food.prices.students} € |&nbsp;
                          Angestellter: {food.prices.employees} € |&nbsp;
                          Other: {food.prices.others} € |&nbsp;</p>
                        </div>
                        <br/><br/>
                        <div className="dishChips">
                          {food.notes.map((note) => (
                            <div className="chip">
                              <Chip
                                className='notes'
                                value={'false'}
                                size="small"
                                disabled={false}
                                label={note}
                                // onClick={e => this.note(e, note)}
                                style={
                                  {
                                    // "backgroundColor": this.color(this.isAllergene(note), this.checkNoteInFilter(note))
                                  }
                                } />
                            </div>
                          ))}
                        </div>
                        <br/>
                        <Divider />

                      </div>
                    ))
                ):(
                  <div>
                    <div>
                      <p>Diese Mensa ist heute geschlossen oder es fehlen noch Angaben.</p>
                    </div>
                    <div className="iconError">
                      {/*<IconClosed style={{"height": "auto", width: "auto"}}/>*/}
                    </div>
                  </div>
                )
              }
            </div>


          </div>
        </div>
      // </Router>
    );
  }
}

export default React.memo(App);
