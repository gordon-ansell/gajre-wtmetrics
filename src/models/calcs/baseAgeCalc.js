import { BaseCalc, WtCalculatorError } from "./baseCalc";

// Default age definitions.
const YOUNG_AGE_DEFS = `14|1.23, 15|1.18, 16|1.13, 17|1.08, 18|1.06, 19|1.04, 20|1.03, 21|1.02, 22|1.01`;

const OLD_AGE_DEFS = `41|1.01, 42|1.02, 43|1.031, 44|1.043, 45|1.055, 46|1.068, 47|1.082, 48|1.097, 49|1.113, 50|1.130,
51|1.147, 52|1.165, 53|1.184, 54|1.204, 55|1.225, 56|1.246, 57|1.268, 58|1.291, 59|1.315, 60|1.340,
61|1.366, 62|1.393, 63|1.421, 64|1.450, 65|1.480, 66|1.511, 67|1.543, 68|1.576, 69|1.610, 70|1.645,
71|1.681, 72|1.718, 73|1.756, 74|1.795, 75|1.835, 76|1.876, 77|1.918, 78|1.961, 79|2.005, 80|2.050,
81|2.096, 82|2.143, 83|2.190, 84|2.238, 85|2.287, 86|2.337, 87|2.388, 88|2.440, 89|2.494, 90|2.549`;


/**
 * Base calculator with age-related calculations.
 */
export class BaseAgeCalc extends BaseCalc
{
    /**
     * Age definitions.
     * @member {object}
     */
    ageFactors = {};

    /**
     * Constructor.
     * 
     * @param   {object}    opts        Data options.
     * @param   {object}    defs        Calc definitions.
     * 
     * @return  {BaseAgeCalc}
     */
    constructor(opts, defs = null)
    {
        super(opts, defs);
        this.ageFactors = (defs && defs.ageFactors) ? defs.ageFactors : this.parseAgeFactors(YOUNG_AGE_DEFS, OLD_AGE_DEFS); 
    }

    /**
     * Parse the age factors.
     * 
     * @param   {string}    young   Young ages.
     * @param   {string}    old     Old ages.
     * 
     * @return  {object}
     */
    parseAgeFactors(young, old)
    {
        let af = {};

        // Parse out the age multipliers.
        let wysp = young.split(',');
        let wosp = old.split(',');

        for (let item of wysp) {
            let tmp = item.trim().split('|');
            af[tmp[0]] = tmp[1];
        }

        for (let i = 23; i < 41; i++) {
            af[i] = 1;
        }

        for (let item of wosp) {
            let tmp = item.trim().split('|');
            af[tmp[0]] = tmp[1];
        }

        return af;
    }

    /**
     * Get the age multiplier.
     * 
     * @return  {float}
     * 
     * @throws  {WtCalculatorError}     If we don't have required options.
     */
    getAgeMulti()
    {
        if (!this.checkOpts(['age'])) {
            throw new WtCalculatorError(`${this.gc()} age calculation does not have required options.`);
        }

        if (this.ageFactors.hasOwnProperty(this.opts.age)) {
            return this.ageFactors[this.opts.age];
        }

        return 1.00;
    }

    /**
     * Calculate age-related.
     * 
     * @return  {object}
     * 
     * @throws  {WtCalculatorError}     If we don't have required options.
     */
    calcAge()
    {
        let base = this.calc();
        let mult = this.getAgeMulti();
        return {val: base.val * mult, age: mult};
    }
}