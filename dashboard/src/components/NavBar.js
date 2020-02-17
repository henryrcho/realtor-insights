import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    render() {
      return (
        <div className="mb-5">
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-brand">
                    {/* <img src="../../public/logo192.png" width="30" height="30" class="d-inline-block align-top" alt="" /> */}
                    Realtor Insights
                    </li>
                    <li><Link to={'/'} className="nav-link"> Home </Link></li>
                    <li><Link to={'/about'} className="nav-link">About</Link></li>
                    <li><Link to={'/tos'} className="nav-link">Terms of Service</Link></li>
                    <li><Link to={'/legal'} className="nav-link">Legal</Link></li>
                </ul>
            </nav>
        </div>
      );
    }
}

export default NavBar;
