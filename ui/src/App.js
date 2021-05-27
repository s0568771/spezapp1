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

// const Tech = ({match}) => {
//   return <div>Current Route: {match.params.tech}</div>
// };


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateToday: '',
      lastMensa: '',
      date: '',
      mensen : [],
      food: [],
      checked: false
    };

    this.onChangeDate = this.onChangeDate.bind(this)
    this.onChangeMensa = this.onChangeMensa.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentDidMount() {

    // const currentDate = new Date();
    // this.state.dateToday =`${currentDate.getFullYear()}-${("00" + (currentDate.getMonth() + 1)).slice(-2)}-${("00" + currentDate.getDate()).slice(-2)}`;
    // var date = new Date()
    // var finaldate = date.getDate() + '-' +  (date.getMonth() + 1)  + '-' +  date.getFullYear()
    // var finaldate1 = date.getFullYear() + '-' +  (date.getMonth() + 1)  + '-' +  date.getDate()
    // this.state.dateToday = finaldate1;
    // console.log(finaldate1)

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
    if (this.state.lastMensa !== '' && this.state.date !== ''){
      const url = 'https://openmensa.org/api/v2/canteens/'+this.state.lastMensa+'/days/'+this.state.date+'/meals'
      axios.get(url)
        .then((res) => {
          this.state.food = res.data;
          this.setState({ food: this.state.food });
        }).catch((error) => {
        this.setState({ food: [], onLoad: false});
      });
    }
  }

  iniDB() {
    axios.get('https://openmensa.org/api/v2/canteens/').then(response => response.data)
      .then((data) => {
        this.setState({ mensen: data })
        // this.save()
      })

  }

  save(e) {
    console.log('save')
    console.log(e.target.value)
    // var food = new Food("1", "test")



    // this.state.mensen.forEach(item => {
    //   axios.post('http://localhost:9000/api/insert', item, {
    //     headers: {
    //       'content-type': 'application/json'
    //     }
    //   });
    // });

  }

  del(e) {
    console.log('del')
    console.log(e.target.value)
    // this.state.mensen.forEach(item => {
    //   axios.post('http://localhost:9000/api/insert', item, {
    //     headers: {
    //       'content-type': 'application/json'
    //     }
    //   });
    // });

  }

  handleChange(event) {
    this.state.food.forEach( f => {
      const id = f.id.toString();
      if (id === event.target.value){
        let body = {
          "id": f.id.toString(),
          "name": f.name
        }
        console.log(body)
        axios.post('http://localhost:9000/api/insertFood', body);
      }
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
      axios.post('http://localhost:9000/api/insert', item, {
        headers: {
          'content-type': 'application/json'
        }
      });
    });
    this.iniDB();

  }

  render() {
    return (
      // <Router>
        <div className="App">
          <h1>Welcome to Appeteria</h1>
          <div>

            <div>
              {/*<InputLabel>Mensen</InputLabel>*/}
              <FormControl className="dateText">
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
              <br/>
              <br/>
              <form noValidate>
                <TextField
                  className="dateText"
                  id="date"
                  // label="Datum"
                  type="date"
                  // defaultValue={new Date()}
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
                            set to Fav
                            <Checkbox
                              value={food.id}
                              // checked={this.state.checked}
                              onChange={e => this.handleChange(e)}
                              inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
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
