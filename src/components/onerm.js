import React from 'react';
import OnermRenderer from '../renderers/onermRenderer';


/**
 * Onerm form.
 */
export class OnermForm extends React.Component
{
    /**
     * Constructor.
     *
     * @param   {object}  props  Form properties.
     *
     * @return  {OnermForm}
     */
    constructor(props) 
    {
        super(props);

        let liftedWeight = window.localStorage.getItem('onerm-liftedWeight') || 90; 
        let reps = window.localStorage.getItem('onerm-reps') || 2; 
        let rounding = window.localStorage.getItem('onerm-rounding') || 2.5; 

        if (isNaN(liftedWeight)) liftedWeight = 90;
        if (isNaN(reps)) reps = 2;
        if (isNaN(rounding)) rounding = 2.5;

        this.state = {
            liftedWeight: parseFloat(liftedWeight),
            reps: parseInt(reps),
            rounding: parseFloat(rounding),
            error: null,
        };

        this.results = '';
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Save the state.
     * 
     * @return  {void}
     */
    saveState()
    {
        window.localStorage.setItem("onerm-liftedWeight", this.state.liftedWeight);
        window.localStorage.setItem("onerm-reps", this.state.reps);
        window.localStorage.setItem("onerm-rounding", this.state.rounding);
    }
    
    /**
     * Handle changes.
     *
     * @param   {object}     event  Form event that triggered change.
     *
     * @return  {void}   
     */
    handleChange(event) 
    {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    /**
     * Check for errors.
     * 
     * @return  {boolean}
     */
    validate()
    {
        let tmp = null;
        if (!this.state.liftedWeight) {
            tmp = "You must enter the weight.";
        } else if (!this.state.reps) {
            tmp = "You must enter the reps.";
        } else if (!this.state.rounding) {
            tmp = "You must enter the rounding.";
        }        
        
        this.setState({error: tmp});
        return (null === tmp);
    }

    /**
     * Render the results.
     * 
     * @return  {string}
     */
    renderResults()
    {
        return this.results;
    }
    
    /**
     * Handle submissions.
     *
     * @param   {object}     event  Form event that triggered change.
     *
     * @return  {void}   
     */
    handleSubmit(event) 
    {
        event.preventDefault();
        if (this.validate()) {
            let opts = {};
            for (let item in this.state) {
                if (['liftedWeight', 'reps', 'rounding'].includes(item)) {
                    opts[item] = this.state[item];
                }
            }
            let results = new OnermRenderer(opts);
            this.results = results.render();

            this.saveState();

        } else {
            this.results = '';
        }
    }
    
    /**
     * Render the form.
     *
     * @return  {string}   
     */
    render() 
    {
        return (
            <div>
                <div className="form-container">
                    <div className="form-box">
                        <form id="onermForm" onSubmit={this.handleSubmit}>
                            <div name="errors" className="error" id="errors">{this.state.error}</div>
                            <div name="row1" className="three-columns-always">
                                <fieldset name="weightfieldset">
                                    <label htmlFor="liftedWeight">Weight</label>
                                    <input name="liftedWeight" placeholder="Weight" step="any" min="0.5" type="number" 
                                        title="Enter the weight you lifted (0.5-9999.99)."  
                                        value={this.state.liftedWeight} onChange={this.handleChange} />
                                </fieldset>
                                <fieldset name="repsfieldset">
                                    <label htmlFor="reps">Reps</label>
                                    <input name="reps" step="1" min="1" max="15" type="number" style={{'max-width': "4em"}} 
                                        title="Enter the number of reps you performed (1-15)."        
                                        value={this.state.reps} onChange={this.handleChange} />
                                </fieldset>
                                <fieldset name="roundingfieldset">
                                    <label htmlFor="rounding">Rounding</label>
                                    <input name="rounding" step="any" min="0.25" max="20" type="number" style={{'max-width': "5em"}}
                                        title="Enter the rounding value (0.25 - 20). This will typically be twice the smallest weight plate you have."                                    
                                        value={this.state.rounding} onChange={this.handleChange} />
                                </fieldset>
                            </div>
                            <fieldset name="submitfieldset">
                                <button name="submit" type="submit" id="submit">Submit</button>
                            </fieldset>
                        </form>        
                    </div>
                </div>
                <div id="onermResults" className="results">
                    {this.renderResults()}
                </div>
            </div>
        );
    }
}
