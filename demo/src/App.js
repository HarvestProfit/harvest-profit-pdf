import React, { Component } from 'react';
import generate from './generate';
import logo from './green-icon-padded-450.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Harvest Profit PDF Demo</h1>
        </header>
        <p className="App-intro">
          To get started, click the button below:
        </p>
        <p>
          <button onClick={() => generate()}>Generate PDF</button>
        </p>
      </div>
    );
  }
}

export default App;
