/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */

import BaseRenderer from './baseRenderer';
import Parser from 'html-react-parser';
import { CalcGenerator } from '../models/calcGenerator';
import { BaseCalc } from '../models/calcs/baseCalc';

/**
 * Onerm renderer class.
 */
export default class OnermRenderer extends BaseRenderer
{
    def_calcNames = ['Epley', 'Brzycki', 'McGlothin', 'Lombardi', 'Mayhew', 'Wathan', 'OConner'];

    renderOpts = {
        title: 'One-Rep Maximums',
        tag: 'onerm',
        col1Title: 'Method',
        col2Title: '1-Rep Max',
        col3Title: 'Mult',
        notes: `
            <p><a href="https://en.wikipedia.org/wiki/One-repetition_maximum" target="_blank">One-rep maximums</a> as calculated by some of the popular equations.</p>
            <p>The multiples shown are the values the weight lifted is multiplied by to get the one-rep maximum.</p>
            `
    };

    results = null;
    average = null;
    avgRaw = null;

    opts = null;

    /**
     * Constructor.
     * 
     * @param   {object}    opts        Calculator options.
     * @param   {string[]}  calcNames   Calculations to perform.
     * 
     * @return  {OnermResults} 
     */
    constructor(opts, calcNames = null)
    {
        super();
        this.opts = opts;

        if (null === calcNames) {
            calcNames = this.def_calcNames;
        }

        let cg = new CalcGenerator(opts);

        this.results = cg.calc(calcNames);
        this.average = cg.getLastAverage();
        this.avgRaw = parseFloat(this.average.val);
   }

    /**
     * Render the results.
     * 
     * @return  {string}
     */
    render()
    {
        let ret = this.renderCalc(this.renderOpts, this.results, this.average);

        let p = '';
        p += `<h2>Percentages of Average 1RM</h2>`;
        p += `<table id="percenttable" className="flextable stripe">`;

        p += `<tr>`;
        p += `<th className="pcol size-50 left">Percentage</th>`;
        p += `<th>Weight</th>`;
        p += `</tr>`;

        console.log('raw: ' + this.avgRaw)
        for (let i = 100; i >= 5; i = i - 5) {
            p += `<tr>`;
            p += `<td className="size-50 left">` + i + `%</td>`;
            let r = this.avgRaw * (i / 100);
            console.log(i + ': ' + r);
            p += `<td className="size-50 right">` + BaseCalc.formatNumber(BaseCalc.mround(r, this.opts.rounding)) + `</td>`;
            p += `</tr>`;
        }

        p += `</table>`;


        ret += p;

        return Parser(ret);
    }
}
