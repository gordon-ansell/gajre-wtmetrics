/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */

import AllometricTotalCalc from './allometricTotalCalc';

/**
 * Allometric(squat) calculator.
 */
export default class AllometricSquatCalc extends AllometricTotalCalc
{
    /**
     * The specific allometric value we're after.
     * @member {string}
     */
    subVal = 'squat';

}