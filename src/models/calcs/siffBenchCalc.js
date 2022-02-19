/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
import SiffTotalCalc from './siffTotalCalc';

/**
 * Siff(bench) calculator.
 */
export default class SiffBenchCalc extends SiffTotalCalc 
{
    /**
     * The specifiv Siff value we're after.
     * @member {string}
     */
    subVal = 'bench';

}