import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Client from "./Client";

import './App.css';
import axios from "axios";

const Tech = ({match}) => {
  return <div>Current Route: {match.params.tech}</div>
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mensen : []
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('mensen')){
      this.iniDB();
    }

    Client.getSummary(summary => {
      this.setState({
        title: summary.content
      });
    });
  }

  iniDB() {
    // console.log('abfrage')
    // this.state.mensen = []
    // localStorage.removeItem('mensen')

    // locale Abfrage, ob DB gefüllt ist

    axios.get('https://openmensa.org/api/v2/canteens/').then(response => response.data)
      .then((data) => {
        this.setState({ mensen: data })
        console.log(this.state.mensen)
        // localStorage.setItem('mensen', JSON.stringify(this.state.mensen));
      })
  }

  getDataANDSave(url, save) {
    axios.get(url).then(response => response.data)
      .then((data) => {
        this.state.mensen = data
        this.setState({ mensen: data })
        if (save){
          // this.saveData();
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
            <select name="mensen" id="mensen">
              {
                this.state.mensen.map(mensa => (
                  <option value="mensa">{mensa.name}</option>
                ))
              }
            </select>
          </div>
        </div>
      </Router>
    );
  }
}

export default React.memo(App);
