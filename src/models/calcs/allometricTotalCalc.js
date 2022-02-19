import { BaseAgeCalc } from './baseAgeCalc';
import { WtCalculatorError } from './baseCalc';

// Default allometric coefficients.
const ALLOMETRIC_DEFS = {
    squat: -0.60,
    bench: -0.57,
    dead:  -0.46,
    total: -0.54
};

/**
 * Allometric(total) calculator.
 */
export default class AllometricTotalCalc extends BaseAgeCalc
{
    /**
     * Allometric definitions.
     * @member {object}
     */
    allometricDefs = {};

    /**
     * The specifiv Siff value we're after.
     * @member {string}
     */
    subVal = null;

    /**
     * Constructor.
     * 
     * @param   {object}    opts        Data options.
     * @param   {object}    defs        Calc definitions.
     * 
     * @return  {AllometricTotalCalc}
     */
    constructor(opts, defs = null)
    {
        super(opts, defs);
        this.allometricDefs = (defs && defs.allo) ? defs.allo : ALLOMETRIC_DEFS; 
        this.extractSubVal();
    }

    /**
     * Extract the sub val from the constructor name.
     * 
     * @return {void}
     */
    extractSubVal()
    {
        this.subVal = this.constructor.name.split(/(?=[A-Z])/)[1].toLowerCase();
    }

    /**
     * Calculate multiplier.
     * 
     * @return  {float}
     * 
     * @throws  {WtCalculatorError}     If we don't have required options.
     */
    calcMult()
    {
        if (!this.checkOpts(['bodyWeight'])) {
            throw new WtCalculatorError(`${this.gc()} calculation does not have required options (multi).`);
        }

        console.log(this.subVal);
        let s = this.allometricDefs[this.subVal];
        console.log(s)

        let mult = this.opts.bodyWeight ** s;

        return mult;
    }

    /**
     * Calculate.
     * 
     * @return  {object}
     * 
     * @throws  {WtCalculatorError}     If we don't have required options.
     */
    calc()
    {

        if ('total' === this.subVal) {
            if (!this.checkOpts(['liftedWeight'])) {
                throw new WtCalculatorError(`${this.gc()} calculation does not have required options (for ${this.subVal}).`);
            }
        } else {
            if (!this.checkOpts([this.subVal + 'Weight'])) {
                throw new WtCalculatorError(`${this.gc()} calculation does not have required options (for ${this.subVal}).`);
            }
        }

        let f = ('total' === this.subVal) ? this.opts.liftedWeight : this.opts[this.subVal + 'Weight'];

        let mult = this.calcMult();
        return {val: f * mult, 'b/w': mult};
    }

}