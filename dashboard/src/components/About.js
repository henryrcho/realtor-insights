import React, { Component } from 'react';


class About extends Component {
  render() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col pt-5">
                    <h2>About</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8 px-0">
                    <h4 className="text-left">Realtor Insights</h4>
                    <p className="lead my-3 text-left">
                        Realtor insights provides tools to help individuals make more informed purchasing decisions when looking for their next home.
                        Created as part of ESC472 - Electrical and Computer Capstone Design course at the University of Toronto, this application provides 
                        an opportunity to integrate and apply the technical knowledge gained during the team's undergraduate education to the solution 
                        of a given real-world engineering design challenge. 
                    </p>
                    <h4 className="text-left">The Assessor Research Tool</h4>
                    <p className="lead my-3 text-left">
                        Assessor aims to provide a research tool for individuals interested in finding a new home that considers an individual’s wants and needs 
                        at a level of granularity down to the neighborhood or district level. The tool is build on three machine learning models: Personal Fit, 
                        which classifies the individual with respect to demographics of each district; Public Perception, which determines the general 
                        sentiment about each district based on news and social media; and Financial Opportunity, which provides a forecasted valuation of the district 
                        based on historical data.
                    </p>
                    <h4 className="text-left">Team</h4>
                    <p className="lead my-3 text-left mb-5">
                        Realtor Insights was created by a team of four University of Toronto Undergraduate Engineering Students in Engineering 
                        Science (Electrical and Computer Engineering Stream). For more information about the University of Toronto and the Engineering 
                        Science program, please visit the Division's 
                        <a target="_blank" rel="noopener noreferrer" href="https://engsci.utoronto.ca/explore_our_program/about_engsci/"> webpage</a>.
                    </p>
                </div>
            </div>
        </div>
    );
  }
}

export default About;
