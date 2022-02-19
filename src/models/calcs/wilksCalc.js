/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
import { BaseAgeCalc } from './baseAgeCalc';
import { WtCalculatorError } from './baseCalc';

// Default Wilks coefficients.
const COEFFS_DEF = {
    male:    [ 16.2606339,    -0.002388645,   -0.00113732,    0.00000701863, -0.00000001291, -216.0475144],
    female:  [-27.23842536447, 0.82112226871, -0.00930733913, 0.00004731582, -0.00000009054,  594.31747775582]
};

/**
 * Wilks calculator.
 */
export default class WilksCalc extends BaseAgeCalc
{
    /**
     * Wilks coefficients.
     * @member {object}
     */
    coeffs = {};

    /**
     * Constructor.
     * 
     * @param   {object}    opts        Data options.
     * @param   {object}    defs        Calc definitions.
     * 
     * @return  {WilksCalc}
     */
    constructor(opts, defs = null)
    {
        super(opts, defs);
        this.coeffs = (defs && defs.coeffs) ? defs.coeffs : COEFFS_DEF; 
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
        if (!this.checkOpts(['bodyWeight', 'gender'])) {
            throw new WtCalculatorError(`${this.gc()} calculation does not have required options (multi).`);
        }

        let bwMult = 0.0;

        let c = this.coeffs[this.opts.gender];

        bwMult =  c[0] * this.opts.bodyWeight;
        bwMult += c[1] * this.opts.bodyWeight ** 2;
        bwMult += c[2] * this.opts.bodyWeight ** 3;
        bwMult += c[3] * this.opts.bodyWeight ** 4;
        bwMult += c[4] * this.opts.bodyWeight ** 5;
        bwMult += c[5];
        bwMult = 500 / bwMult;

        return bwMult;
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

        if (!this.checkOpts(['liftedWeight', 'bodyWeight', 'gender'])) {
            throw new WtCalculatorError(`${this.gc()} calculation does not have required options.`);
        }

        let mult = this.calcMult();
        return {val: this.opts.liftedWeight * mult, 'b/w': mult};
    }

}