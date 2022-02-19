/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */

import { BaseCalc, WtCalculatorError } from './calcs/baseCalc';
import EpleyCalc from './calcs/epleyCalc';
import WilksCalc from './calcs/wilksCalc';
import BrzyckiCalc from './calcs/brzyckiCalc';
import McGlothinCalc from './calcs/mcGlothinCalc';
import LombardiCalc from './calcs/lombardiCalc';
import MayhewCalc from './calcs/mayhewCalc';
import WathanCalc from './calcs/wathanCalc';
import OConnerCalc from './calcs/oConnerCalc';
import SiffTotalCalc from './calcs/siffTotalCalc';
import SiffSquatCalc from './calcs/siffSquatCalc';
import SiffBenchCalc from './calcs/siffBenchCalc';
import SiffDeadCalc from './calcs/siffDeadCalc';
import AllometricTotalCalc from './calcs/allometricTotalCalc';
import AllometricSquatCalc from './calcs/allometricSquatCalc';
import AllometricBenchCalc from './calcs/allometricBenchCalc';
import AllometricDeadCalc from './calcs/allometricDeadCalc';

// Exception.
export class WtCalcGeneratorError extends WtCalculatorError {}

/**
 * Calculation generator.
 */
export class CalcGenerator
{
    /**
     * Calculation options.
     * @member {object}
     */
    opts = {};

    /**
     * Calculation definitions.
     * @member {object}
     */
    defs = {};

    /**
     * Class instances we've already defined.
     * @member {object}
     */
    instances = {};

    /**
     * The last total.
     * @member {float}
     */
    lastTotal = 0.00;

    /**
     * The count of last averages.
     * @member {float}
     */
    lastTotalCount = 0;

    /**
     * Constructor.
     * 
     * @param   {opts}      opts    Options.
     * @param   {object}    defs    Calculation definitions.
     * 
     * @return  {CalcGenerator}
     */
    constructor(opts = {}, defs = {})
    {
        this.opts = opts;
        this.defs = defs;
    }

    /**
     * Factory class creation.
     * 
     * @param   {string}    className   Class name to create.
     * @param   {object}    opts        Options.
     * 
     * @return  {object} 
     */
    createClass(className, opts)
    {
        switch (className) {
            case "EpleyCalc":
                return new EpleyCalc(opts, this.defs);
            case "WilksCalc":
                return new WilksCalc(opts, this.defs);
            case "BrzyckiCalc":
                return new BrzyckiCalc(opts, this.defs);
            case "McGlothinCalc":
                return new McGlothinCalc(opts, this.defs);
            case "LombardiCalc":
                return new LombardiCalc(opts, this.defs);
            case "MayhewCalc":
                return new MayhewCalc(opts, this.defs);
            case "WathanCalc":
                return new WathanCalc(opts, this.defs);
            case "OConnerCalc":
                return new OConnerCalc(opts, this.defs);
            case "SiffTotalCalc":
                return new SiffTotalCalc(opts, this.defs);
            case "SiffSquatCalc":
                return new SiffSquatCalc(opts, this.defs);
            case "SiffBenchCalc":
                return new SiffBenchCalc(opts, this.defs);
            case "SiffDeadCalc":
                return new SiffDeadCalc(opts, this.defs);
            case "AllometricTotalCalc":
                return new AllometricTotalCalc(opts, this.defs);
            case "AllometricSquatCalc":
                return new AllometricSquatCalc(opts, this.defs);
            case "AllometricBenchCalc":
                return new AllometricBenchCalc(opts, this.defs);
            case "AllometricDeadCalc":
                return new AllometricDeadCalc(opts, this.defs);
            default:
                throw new WtCalcGeneratorError(`Cannot create calc class ${className} because it is not defined.`);
        }
    }

    /**
     * Perform calculations.
     * 
     * @param   {string[]}      calcNames   Calculation names.
     * @param   {object}        opts        Options.
     * 
     * @return  {object}
     */
    calc(calcNames, opts = null)
    {
        // Make sure we have some options.
        if (!opts) {
            opts = this.opts;
        }

        // Return variable.
        let ret = {};

        // Loop for all the required calculations.
        for (let item of calcNames) {

            // Parse the name of the calculation.
            let base, extra = null;

            if (-1 !== item.indexOf('_')) {
                let sp = item.split('_');
                base = sp[0];
                extra = sp[1];
            } else {
                base = item;
            }

            // See if we already have this class. If not, create it and save it.
            let className = base + 'Calc';
            if (!(className in this.instances)) {
                this.instances[className] = this.createClass(className, opts);
            }

            // Execute the appropriate function and save the result.
            let tmp = null;
            if ('age' === extra) {
                tmp = this.instances[className].calcAge();
            } else {
                tmp = this.instances[className].calc();
            }

            // Save the average.
            this.lastTotal += tmp.val;
            this.lastTotalCount++;

            // Do we need to round the number?
            if (opts.rounding) {
                tmp.val = BaseCalc.mround(tmp.val, opts.rounding);
            }

            // Format the number.
            for (let field in tmp) {
                if ('val' === field) {
                    tmp[field] = BaseCalc.formatNumber(tmp[field], 2);
                } else {
                    tmp[field] = BaseCalc.formatNumber(tmp[field], 3);
                }
            }

            // Save for return.
            ret[item] = tmp;
        }

        return ret;
    }

    /**
     * Get the last average.
     * 
     * @param   {boolean}       raw         Raw value?
     * @param   {object}        opts        Options.
     * 
     * @return  {float|object}
     */
    getLastAverage(raw = false, opts = null)
    {
        // Make sure we have some options.
        if (!opts) {
            opts = this.opts;
        }

        // Return variable.
        let ret = this.lastTotal / this.lastTotalCount;

        // Do we want it raw?
        if (raw) {
            return ret;
        }

        // Do we need to round the number?
        if (opts.rounding) {
            ret = BaseCalc.mround(ret, opts.rounding);
        }

        // Format the number.
        ret = BaseCalc.formatNumber(ret, 2);

        return {val: ret, _mult: 0};

    }
}