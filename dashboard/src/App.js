import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/home';
import About from './components/about';
import TOS from './components/tos';
import Legal from './components/legal'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-brand">
              {/* <img src="../../public/logo192.png" width="30" height="30" class="d-inline-block align-top" alt="" /> */}
              Realtor Insights
            </li>
            <li><Link to={'/'} className="nav-link"> Home </Link></li>
            <li><Link to={'/tos'} className="nav-link">Terms of Service</Link></li>
            <li><Link to={'/about'} className="nav-link">About</Link></li>
            <li><Link to={'/legal'} className="nav-link">Legal</Link></li>
          </ul>
          </nav>
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/tos' component={TOS} />
              <Route path='/about' component={About} />
              <Route path='/legal' component={Legal} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
