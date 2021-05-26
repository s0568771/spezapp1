import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Client from "./Client";

import './App.css';
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";

const Tech = ({match}) => {
  return <div>Current Route: {match.params.tech}</div>
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateToday: '',
      lastMensa: '',
      date: '',
      mensen : [],
      food: []
    };

    this.onChangeDate = this.onChangeDate.bind(this)
    this.onChangeMensa = this.onChangeMensa.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentDidMount() {

    // const currentDate = new Date();
    // this.state.dateToday =`${currentDate.getFullYear()}-${("00" + (currentDate.getMonth() + 1)).slice(-2)}-${("00" + currentDate.getDate()).slice(-2)}`;
    var date = new Date("Fri Oct 20 2017 16:50:33 GMT+0100 (BST)")
    var finaldate = date.getDate() + '-' +  (date.getMonth() + 1)  + '-' +  date.getFullYear()
    console.log(finaldate)

    //Openmensa init: Datenabruf
    this.iniDB();

    Client.getSummary(summary => {
      this.setState({
        title: summary.content
      });
    });
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
    if (this.state.lastMensa != '' && this.state.date != ''){
      const url = 'https://openmensa.org/api/v2/canteens/'+this.state.lastMensa+'/days/'+this.state.date+'/meals'
      axios.get(url)
        .then((res) => {
          this.state.food = res.data;
          // this.initFavFood();
          this.setState({ food: this.state.food });
          // this.setState({ onLoad: false });
        }).catch((error) => {
        // console.log(error)
        this.setState({ food: [], onLoad: false});
      });
    }
  }

  iniDB() {
    axios.get('https://openmensa.org/api/v2/canteens/').then(response => response.data)
      .then((data) => {
        this.setState({ mensen: data })
      })
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
      axios.post('http://localhost:9000/mensen', item, {
        headers: {
          'content-type': 'application/json'
        }
      });
    });
    this.iniDB();

  }

  render() {
    return (
      <Router>
        <div className="App">
          <h1>Welcome to Appeteria</h1>
          <div>
            <InputLabel>Mensen</InputLabel>
            <FormControl>
              <Select
                native
                onChange={(e) => this.onChangeMensa(e)}
              >
                {
                    this.state.mensen.map(mensa => (
                      <option value={mensa.id}

                      >
                        {mensa.name}</option>
                    ))}
                  }
              </Select>
            </FormControl>

            <form noValidate>

              <TextField
                className="dateText"
                id="date"
                label="Datum"
                type="date"
                defaultValue={this.state.dateToday}
                InputLabelProps={{
                  shrink: true,
                }}
                // formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                onChange={e => this.onChangeDate(e)}
              />
            </form>

            <div>
              {
                (this.state.food.length > 0) ? (
                    this.state.food.map((food) => (
                      <div className="dishField">
                        <div className="dishTopDisplay">
                          <div className='dishCat'>
                            {/*<p>{food.category}</p>*/}
                          </div>

                          <div className='dish-header'>
                            <div className="dishName">
                              {food.name}
                            </div>
                          </div>
                        </div>
                        <div className='dishPrices'>
                          <p>Student: {food.prices.students} € |&nbsp;
                          Angestellter: {food.prices.employees} € |&nbsp;
                          Other: {food.prices.others} € |&nbsp;</p>
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
                                // onClick={e => this.note(e, note)}
                                style={
                                  {
                                    // "backgroundColor": this.color(this.isAllergene(note), this.checkNoteInFilter(note))
                                  }
                                } />
                            </div>
                          ))}
                        </div>


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
      </Router>
    );
  }
}

export default React.memo(App);
