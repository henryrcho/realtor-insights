import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col pt-5">
                    <h1>Welcome to Realtor Insights!</h1>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col pt-5 mt-5">
                    <Link to={'/search'} class="btn btn-primary btn-lg">
                        Find a neighbourhood!
                    </Link>
                </div>
            </div>
        </div>
    );
  }
}

export default Home;