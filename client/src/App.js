import React, { Component } from 'react';
import './App.css';
import SignIn from './components/SignIn/SignIn';
import SingUp from './components/SignUp/SingUp';
import NoteList from './components/NoteList/NoteList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SignIn />
        <SingUp />
        <NoteList />
      </div>
    );
  }
}

export default App;
