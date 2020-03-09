import React, { Component } from 'react';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {
              name: '',
              age: '',
              race: '',
              gender: '',
              skills: [],
              about: ''
      
            },
        }
    }
    render() {
        return (
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col pt-5">
                        <h1>This is a table placeholder.</h1>
                        {this.props.location.results}
                    </div>
                </div>
            </div>
        );
  }
}

export default Home;