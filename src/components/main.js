/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";

/**
 * Main index page.
 */
export class MainIndex extends React.Component
{
    /**
     * Render the form.
     *
     * @return  {string}   
     */
    render() 
    {
        return (
            <div className="intro">
                <Helmet>
                    <title>Weight Training Metrics</title>
                    <meta name="description" content="Calculate Wilks score, one-rep maximums, allometric and Siff scores. Useful for weight training and powerlifting." />
                </Helmet>
                <ul>
                    <li><Link to="/onerm">One-Rep Maximum</Link>: Calculate your one-rep maximum from weights lifted at 2-15 reps.</li>
                    <li><Link to="/wilks">Wilks Score</Link>: Calculate your Wilks score from weights lifted in the squat, bench press and deadlift. Also calculates Siff and allometric scores.</li>
                </ul>
            </div>
        );
    }
}
