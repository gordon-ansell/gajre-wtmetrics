/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */

// Lbs to Kgs conversion.
const LB2KG = 0.45359237;

// Exception.
export class WtCalculatorError extends Error {}

/**
 * Base calculator.
 */
export class BaseCalc
{
    /**
     * Options.
     * @member {object}
     */
    opts = null;

    /**
     * Cal defs.
     * @member {object}
     */
    defs = null;

    /**
     * Constructor.
     * 
     * @param   {object}    opts        Data options.
     * @param   {object}    defs        Calc definitions.
     * 
     * @return  {BaseCalc}
     */
    constructor(opts, defs = null)
    {
        this.opts = opts;
        this.defs = defs;
    }

    /**
     * Check opts.
     * 
     * @param   {string[]}  check   Opts to check.
     * 
     * @return  {boolean}
     */
    checkOpts(check)
    {
        if ("string" === typeof(check)) {
            check = [check];
        }
        for (let item of check) {
            if (!this.opts.hasOwnProperty(item) || !this.opts[item]) {
                return false;
            }
        }        
        return true;
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
        throw new WtCalculatorError(`BaseCalc: You must define a 'calc()' function.`);
    }

    /**
     * Round a number to the nearest multiplier.
     *
     * @param   {float}   num   Number to round.
     * @param   {float}   mult  Multiplier to round it to.
     *
     * @return  {float}         Rounded number.
     */
    static mround(num, mult) 
    {
        let multiplier = 1 / mult;
        return (Math.round(num * multiplier) / multiplier);
    }

    /**
     * Format a number nicely.
     * 
     * @param   {number}    number      Number to format.
     * @param   {number}    decimals    Number of decimals.
     * 
     * @return  {string}
     */
    static formatNumber(number, decimals = 2) 
    {
        let snum = String(number);

        if (-1 === snum.indexOf('.')) {
            return snum + '.' + '0'.repeat(decimals);
        } else {
            let sp = snum.split('.');
            let whole = sp[0];
            let dec = sp[1];

            if (dec.length < decimals) {
                while (dec.length < decimals) {
                    dec += '0';
                }
            } else if (dec.length > decimals) {
                dec = dec.substring(0, decimals);
            } 

            return whole + '.' + dec;
        }
    }

    /**
     * Convert a weight.
     * 
     * @param   {float}     weight      Weight to convert.
     * @param   {string}    units       Units of input weight.
     * @param   {string}    desired     Desired units.
     * 
     * @return  {float}
     */
    static convWeight(weight, units, desired)
    {
        if (('kg' === desired && 'kg' === units) || ('lb' === desired && 'lb' === units)) {
            return parseFloat(weight);
        } else if ('kg' === desired && 'lb' === units) {
            return parseFloat(weight) / LB2KG;
        } else {
            return parseFloat(weight) * LB2KG;
        }
    }

    /**
     * Convert a weight to kg.
     * 
     * @param   {float}     weight      Weight to convert.
     * @param   {string}    units       Units of input weight.
     * 
     * @return  {float}
     */
    static toKg(weight, units)
    {
        return BaseCalc.convWeight(weight, units, 'kg');
    }
}