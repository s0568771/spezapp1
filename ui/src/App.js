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
      checked: false,
      favfood: []
    };

    this.onChangeDate = this.onChangeDate.bind(this)
    this.onChangeMensa = this.onChangeMensa.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentDidMount() {

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

      axios.get('http://localhost:3000/api/getAllFood')
        .then((res) => {
          this.state.favfood = res.data;
          this.setState({ favfood: this.state.favfood });
          console.log(this.state)
        })

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
    const options = {
      headers: {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": [".herokuapp.com", "localhost:9000", "localhost:3000"],
        "Access-Control-Allow-Methods": "GET,POST"
      }
    };

    this.state.food.forEach( f => {
      const fid = f.id.toString();
      const fname = f.name
      if (fid === event.target.value){
        let body = {
          "id": fid,
          "name": fname
        }
        console.log(body)
        axios.post('http://localhost:3000/api/insertFood', body, options);
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

                          </div>
                          <div className="dish-favIcon">
                            <IconButton onClick={e => this.handleChange(e)} color="secondary" aria-label="add an alarm" style={{"padding": 0}}>
                              {(food.fav === true) ? (
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                  {console.log(food)}
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
