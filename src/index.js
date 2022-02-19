import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import { OnermForm } from './components/onerm';
import { WilksForm } from './components/wilks';


/**
 * Application.
 */
class App extends React.Component
{    
    /**
     * Constructor.
     *
     * @param   {object}  props  Form properties.
     *
     * @return  {App}
     */
    constructor(props) 
    {
        super(props);
        
        let s = window.localStorage.getItem('wtcalcs-mainMenuOption') || 'onerm'; 

        this.state = {
            mainMenuOption: s
        };

        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Save the state.
     * 
     * @return  {void}
     */
    saveState()
    {
        window.localStorage.setItem('wtcalcs-mainMenuOption', this.state.mainMenuOption);
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
        this.setState({
            mainMenuOption: event.target.value
        }, () => {
            this.saveState();
        });
    }

    /**
     * Get the appropriate form.
     * 
     * @return  {string}
     */
    getForm()
    {
        if ('onerm' === this.state.mainMenuOption) {
            return <OnermForm />;
        } else {
            return <WilksForm />;
        }
    }

    /**
     * Render the form.
     *
     * @return  {string}   
     */
    render() 
    {
        return(
        <div>
            <div className="menu">
                <div className="form-container">
                    <div className="form-box">
                        <form id="selForm">
                            <div name="row1">
                                <fieldset name="onermfieldset" className="radio horizontal">
                                    <input type="radio" value="onerm" name="mainMenuOption" id="onerm"
                                        title="Calculate one-rep maximum."  
                                        checked={'onerm' === this.state.mainMenuOption}
                                        onChange={this.handleChange} />
                                    <label htmlFor="onerm">One-Rep Maximum</label>
                                    <input type="radio" value="wilks" name="mainMenuOption" id="wilks"
                                        title="Calculate Wilks score."        
                                        checked={'onerm' !== this.state.mainMenuOption}
                                        onChange={this.handleChange} />
                                    <label htmlFor="wilks">Wilks Score</label>&nbsp;
                                </fieldset>
                            </div>
                        </form>        
                    </div>
                </div>
            </div>
            <hr />
            {this.getForm()}
        </div>
        );
    }
}
   
// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
  
  