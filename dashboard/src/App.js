import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './components/Home';
import About from './components/About';
import FormContainer from './components/Form/FormContainer';
import TableContainer from './components/Table/TableContainer';


function App() {
  return (
    <div className="App"> 
        <Router>
          <NavBar />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/about' component={About} />
              <Route path='/search' component={FormContainer} />
              <Route path='/results' component={TableContainer} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
