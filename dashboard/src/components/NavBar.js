import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    render() {
      return (
        <div className="mb-5">
          <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="navbar-brand">
              {/* <img src="../../public/logo192.png" width="30" height="30" class="d-inline-block align-top" alt="" /> */}
              Realtor Insights
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarToggler">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item"><Link to={'/'} className="nav-link">Home</Link></li>
                <li className="nav-item"><Link to={'/about'} className="nav-link">About</Link></li>
                <li className="nav-item"><Link to={'/tos'} className="nav-link">Terms of Service</Link></li>
                <li className="nav-item"><Link to={'/legal'} className="nav-link">Legal</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      );
    }
}

export default NavBar;
