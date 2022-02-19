/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
import React from 'react';
import { BaseCalc } from '../models/calcs/baseCalc';
import WilksRenderer from '../renderers/wilksRenderer';


/**
 * Wilks form.
 */
export class WilksForm extends React.Component
{
    methodTotalDisp = 'grid';
    methodSeparateDisp = 'none';

    /**
     * Constructor.
     *
     * @param   {object}  props  Form properties.
     *
     * @return  {WilksForm}
     */
    constructor(props) 
    {
        super(props);

        let gender = window.localStorage.getItem('wilks-gender') || 'male'; 
        let bodyWeight = window.localStorage.getItem('wilks-bodyWeight') || 70; 
        let bodyWeightUnits = window.localStorage.getItem('wilks-bodyWeightUnits') || 'kg'; 
        let age = window.localStorage.getItem('wilks-age') || 35; 
        let method = window.localStorage.getItem('wilks-method') || 'total';
        let liftedWeight = window.localStorage.getItem('wilks-liftedWeight') || 450; 
        let liftedWeightUnits = window.localStorage.getItem('wilks-liftedWeightUnits') || 'kg'; 
        let squatWeight = window.localStorage.getItem('wilks-squatWeight') || 125; 
        let squatWeightUnits = window.localStorage.getItem('wilks-squatWeightUnits') || 'kg'; 
        let benchWeight = window.localStorage.getItem('wilks-benchWeight') || 100; 
        let benchWeightUnits = window.localStorage.getItem('wilks-benchWeightUnits') || 'kg'; 
        let deadWeight = window.localStorage.getItem('wilks-deadWeight') || 150; 
        let deadWeightUnits = window.localStorage.getItem('wilks-deadWeightUnits') || 'kg'; 

        if (isNaN(bodyWeight)) bodyWeight = 70;
        if (isNaN(age)) age = 35;
        if (isNaN(liftedWeight)) liftedWeight = 450;
        if (isNaN(squatWeight)) squatWeight = 125;
        if (isNaN(benchWeight)) benchWeight = 100;
        if (isNaN(deadWeight)) deadWeight = 100;

        this.state = {
            gender: gender,
            bodyWeight: parseFloat(bodyWeight),
            bodyWeightUnits: bodyWeightUnits,
            age: parseInt(age),
            method: method,
            liftedWeight: parseFloat(liftedWeight),
            liftedWeightUnits: liftedWeightUnits,
            squatWeight: parseFloat(squatWeight),
            squatWeightUnits: squatWeightUnits,
            benchWeight: parseFloat(benchWeight),
            benchWeightUnits: benchWeightUnits,
            deadWeight: parseFloat(deadWeight),
            deadWeightUnits: deadWeightUnits,
            error: '',
        };

        this.results = '';

        if ('separate' === method) {
            this.methodTotalDisp = 'none';
            this.methodSeparateDisp = 'grid';
        } else {
            this.methodTotalDisp = 'grid';
            this.methodSeparateDisp = 'none';
        }

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
        window.localStorage.setItem("wilks-gender", this.state.gender);
        window.localStorage.setItem("wilks-bodyWeight", this.state.bodyWeight);
        window.localStorage.setItem("wilks-bodyWeightUnits", this.state.bodyWeightUnits);
        window.localStorage.setItem("wilks-age", this.state.age);
        window.localStorage.setItem("wilks-method", this.state.method);
        window.localStorage.setItem("wilks-liftedWeight", this.state.liftedWeight);
        window.localStorage.setItem("wilks-liftedWeightUnits", this.state.liftedWeightUnits);
        window.localStorage.setItem("wilks-squatWeight", this.state.squatWeight);
        window.localStorage.setItem("wilks-squatWeightUnits", this.state.squatWeightUnits);
        window.localStorage.setItem("wilks-benchWeight", this.state.benchWeight);
        window.localStorage.setItem("wilks-benchWeightUnits", this.state.benchWeightUnits);
        window.localStorage.setItem("wilks-deadWeight", this.state.deadWeight);
        window.localStorage.setItem("wilks-deadWeightUnits", this.state.deadWeightUnits);

        if ('separate' === this.state.method) {
            let summed = this.state.squatWeight + 
                BaseCalc.convWeight(this.state.benchWeight, this.state.benchWeightUnits, this.state.squatWeightUnits) +
                BaseCalc.convWeight(this.state.deadWeight, this.state.deadWeightUnits, this.state.squatWeightUnits);
            window.localStorage.setItem("wilks-liftedWeight", summed);
            window.localStorage.setItem("wilks-liftedWeightUnits", this.state.squatWeightUnits);
            this.setState({
                liftedWeight: summed,
                liftedWeightUnits: this.state.squatWeightUnits
            });
        }
    }

    /**
     * Set the method display.
     * 
     * @param   {string}    value   Value to set.
     * @param   {boolean}   save    Save permanent?
     * 
     * @return  {void}
     */
    setMethodDisplay(value, save = true)
    {
        if ('separate' === value) {
            this.methodTotalDisp = 'none';
            this.methodSeparateDisp = 'grid';
        } else {
            this.methodTotalDisp = 'grid';
            this.methodSeparateDisp = 'none';
        }
        this.setState({
            method: value
        }, () => {
            if (save) this.saveState();
        });
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

        if ('method' === name) {
            this.setMethodDisplay(value);
        } else {
            this.setState({
                [name]: value
            }, () => {
                if ('gender' === name) {
                    window.localStorage.setItem("wilks-gender", this.state.gender);
                }
            });
        }
    }

    /**
     * Check for errors.
     * 
     * @return  {boolean}
     */
    validate()
    {
        let tmp = null;
        if (!this.state.bodyWeight) {
            tmp = "You must enter your bodyweight.";
        } else if (!this.state.age) {
            tmp = "You must enter your age.";
        } else if ('total' === this.state.method && !this.state.bodyWeight) {
            tmp = "You must enter the the weight you lifted.";
        } else if ('separate' === this.state.method && !this.state.squatWeight) { 
            tmp = "You must enter the the weight you lifted for the squat.";
        } else if ('separate' === this.state.method && !this.state.benchWeight) { 
            tmp = "You must enter the the weight you lifted for the bench press.";
        } else if ('separate' === this.state.method && !this.state.deadWeight) { 
            tmp = "You must enter the the weight you lifted for the deadlift.";
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
            if ('separate' === this.state.method) {
                opts.squatWeight = BaseCalc.toKg(this.state.squatWeight, this.state.squatWeightUnits);
                opts.benchWeight = BaseCalc.toKg(this.state.benchWeight, this.state.benchWeightUnits);
                opts.deadWeight = BaseCalc.toKg(this.state.deadWeight, this.state.deadWeightUnits);

                opts.liftedWeight = opts.squatWeight + opts.benchWeight + opts.deadWeight;
            } else {
                opts.liftedWeight = BaseCalc.toKg(this.state.liftedWeight, this.state.liftedWeightUnits);
            }
            for (let item in this.state) {
                if (['gender', 'bodyWeight', 'bodyWeightUnits', 'age'].includes(item)) {
                    opts[item] = this.state[item];
                }
            }
            let results = new WilksRenderer(opts);
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
                        <form id="wilksForm" onSubmit={this.handleSubmit}>
                            <div name="errors" className="error" id="errors">
                                {this.state.error}
                            </div>
                            <div name="row1" className="three-columns">
                                <fieldset name="gender" label="Gender" className="radio horizontal" title="Select your gender.">
                                    <span className="label">Gender</span>
                                    <input type="radio" id="male" value="male" name="gender" 
                                        checked={'female' !== this.state.gender} 
                                        onChange={this.handleChange}/>
                                    <label htmlFor="male">Male</label>
                                    <input type="radio" id="female" value="female" name="gender" 
                                        checked={'female' === this.state.gender} 
                                        onChange={this.handleChange}/>
                                    <label htmlFor="female">Female</label>
                                </fieldset>
                                <fieldset name="bodyWeightfieldset" className="duofield">
                                    <label htmlFor="bodyWeight">Body Weight</label>
                                    <span className="duowrap">
                                        <input name="bodyWeight" type="number" step="any" min="1" title="Enter your body weight." 
                                            id="bodyWeight" value={this.state.bodyWeight} onChange={this.handleChange}
                                            style={{'max-width': "6em"}}/>
                                        <span className="select-wrapper">
                                            <select name="bodyWeightUnits" id="bodyWeightUnits" 
                                                onChange={this.handleChange} 
                                                value={this.state.bodyWeightUnits}
                                                style={{'max-width': "4em"}}>
                                                <option value="kg">kg</option>
                                                <option value="lb">lb</option>
                                            </select>
                                        </span>
                                    </span>
                                </fieldset>
                                <fieldset name="agefieldset" id="agefieldset">
                                    <label htmlFor="age">Age</label>
                                    <input name="age" 
                                        title="If you want to see the adjustment for your age, enter your age here. Whole numbers only." 
                                        step="1" min="14" max="90" type="number" id="age" style={{'max-width': "4em"}}
                                        value={this.state.age} onChange={this.handleChange} />
                                </fieldset>
                            </div>
                            <fieldset name="method" label="Method" className="radio horizontal" 
                                title="Select the method of calculation: total of all lifts together or enter weights for each lift separately?" 
                                id="method">
                                    <span className="label">Method</span>
                                    <input type="radio" id="total" value="total" name="method" 
                                        checked={'separate' !== this.state.method}
                                        onChange={this.handleChange} />
                                    <label htmlFor="total">Total</label>
                                    <input type="radio" id="separate" value="separate" name="method" 
                                        checked={'separate' === this.state.method}
                                        onChange={this.handleChange} />
                                    <label htmlFor="separate">Separate</label>
                            </fieldset>
                            <div name="row3" id="methodTotal" style={{'display': this.methodTotalDisp}}>
                                <fieldset name="weightfieldset" className="duofield">
                                    <label htmlFor="liftedWeight">Total Weight Lifted</label>
                                    <span className="duowrap">
                                        <input name="liftedWeight" type="number" step="any" min="1" 
                                            title="This can be for an invididual lift, but a true Wilks score is based on your combined squat, bench press and deadlift weights." 
                                            style={{'max-width': "6em"}} id="liftedWeight"
                                            onChange={this.handleChange}
                                            value={this.state.liftedWeight} />
                                        <span className="select-wrapper">
                                            <select name="liftedWeightUnits" style={{'max-width': "4em"}} id="liftedWeightUnits" 
                                                onChange={this.handleChange}
                                                value={this.state.liftedWeightUnits}>
                                                <option value="kg">kg</option>
                                                <option value="lb">lb</option>
                                            </select>
                                        </span>
                                    </span>
                                </fieldset>
                            </div>
                            <span name="separateblock" id="methodSeparate" style={{'display': this.methodSeparateDisp}}>
                                <div name="row5" id="row5">
                                    <fieldset name="squatfieldset" className="duofield">
                                        <label htmlFor="squatWeight">Squat</label>
                                        <span className="duowrap">
                                            <input name="squatWeight" type="number" step="any" min="1" 
                                                title="Enter the weight you lifted in the squat." 
                                                style={{'max-width': "6em"}} id="squat" 
                                                onChange={this.handleChange}
                                                value={this.state.squatWeight} />
                                            <span className="select-wrapper">
                                                <select name="squatWeightUnits" style={{'max-width': "4em"}} id="squatUnits"
                                                    onChange={this.handleChange}
                                                    value={this.state.squatWeightUnits}>
                                                    <option value="kg">kg</option>
                                                    <option value="lb">lb</option>
                                                </select>
                                            </span>
                                        </span>
                                    </fieldset>
                                </div>
                                <div name="row6" id="row6">
                                    <fieldset name="benchfieldset" className="duofield">
                                        <label htmlFor="benchWeight">Bench Press</label>
                                        <span className="duowrap">
                                            <input name="benchWeight" type="number" step="any" min="1" 
                                                title="Enter the weight you lifted in the bench press." 
                                                style={{'max-width': "6em"}} id="bench" 
                                                onChange={this.handleChange}
                                                value={this.state.benchWeight} />
                                            <span className="select-wrapper">
                                                <select name="benchWeightUnits" style={{'max-width': "4em"}} id="benchUnits"
                                                    onChange={this.handleChange}
                                                    value={this.state.benchWeightUnits}>
                                                    <option value="kg">kg</option>
                                                    <option value="lb">lb</option>
                                                </select>
                                            </span>
                                        </span>
                                    </fieldset>
                                </div>
                                <div name="row7" id="row7">
                                    <fieldset name="deadfieldset" className="duofield">
                                        <label htmlFor="deadWeight">Deadlift</label>
                                        <span className="duowrap">
                                            <input name="deadWeight" type="number" step="any" min="1" 
                                                title="Enter the weight you lifted in the deadlift." 
                                                style={{'max-width': "6em"}} id="dead" 
                                                onChange={this.handleChange}
                                                value={this.state.deadWeight} />
                                            <span className="select-wrapper">
                                                <select name="deadWeightUnits" style={{'max-width': "4em"}} id="deadUnits"
                                                    onChange={this.handleChange}
                                                    value={this.state.deadWeightUnits}>
                                                    <option value="kg">kg</option>
                                                    <option value="lb">lb</option>
                                                </select>
                                            </span>
                                        </span>
                                    </fieldset>
                                </div>
                            </span>
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
