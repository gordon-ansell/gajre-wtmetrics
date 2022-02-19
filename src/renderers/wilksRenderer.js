/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */

import BaseRenderer from './baseRenderer';
import Parser from 'html-react-parser';
import { CalcGenerator } from '../models/calcGenerator';

/**
 * Wilks renderer class.
 */
export default class WilksRenderer extends BaseRenderer
{
    def_calcNames = ['Wilks', 'Wilks_age'];

    renderOptsWilks = {
        title: 'Wilks',
        tag: 'wilks',
        col1Title: 'Method',
        col2Title: 'Score',
        col3Title: 'Mult',
        notes: `
            <p>Raw <a href="https://en.wikipedia.org/wiki/Wilks_coefficient" target="_blank">Wilks score</a> and its age-factored equivalent.</p>
            <p>The multiples shown are the bodyweight multiple for the raw Wilks and the age multiple for the age-factored Wilks.</p>
            `,
        fieldReps: {
            'Wilks_age': "Wilks/Age"
        }
    };

    renderOptsSiff = {
        title: 'Siff',
        tag: 'siff',
        col1Title: 'Method',
        col2Title: 'Score',
        col3Title: 'Mult',
        notes: `
            <p>Siff scores provide another way to factor bodyweight into your lifts. They take no account of gender, though.<p>
            <p>See <a href="https://web.archive.org/web/20050304042306/http://www.sportsci.com/SPORTSCI/JANUARY/evolution_of_bodymass_adjustment.htm" target="_blank">here</a> for more details.</p>
        `,
        fieldReps: {
            'SiffSquat': "Squat",
            'SiffSquat_age': "Squat/Age",
            'SiffBench': "Bench",
            'SiffBench_age': "Bench/Age",
            'SiffDead': "Dead",
            'SiffDead_age': "Dead/Age",
            'SiffTotal': "Total",
            'SiffTotal_age': "Total/Age",
        }
    };

    renderOptsAllo = {
        title: 'Allometric',
        tag: 'allo',
        col1Title: 'Method',
        col2Title: 'Score',
        col3Title: 'Mult',
        notes: `
            <p>Allometric scores provide another way to factor bodyweight into your lifts. They take no account of gender.<p>
            <p>See <a href="https://journals.lww.com/nsca-jscr/Abstract/2000/02000/Allometric_Modeling_of_the_Bench_Press_and_Squat_.6.aspx" target="_blank">here</a> for more details.</p>
        `,
        fieldReps: {
            'AllometricSquat': "Squat",
            'AllometricSquat_age': "Squat/Age",
            'AllometricBench': "Bench",
            'AllometricBench_age': "Bench/Age",
            'AllometricDead': "Dead",
            'AllometricDead_age': "Dead/Age",
            'AllometricTotal': "Total",
            'AllometricTotal_age': "Total/Age",
        }
    };

    resultsWilks = null;
    resultsSiff = null;
    resultsAllo = null;

    /**
     * Constructor.
     * 
     * @param   {object}    opts        Calculator options.
     * @param   {string[]}  calcNames   Calculations to perform.
     * 
     * @return  {WilksResults} 
     */
    constructor(opts, calcNames = null)
    {
        super();
        if (null === calcNames) {
            calcNames = this.def_calcNames;
        }
        let cr = new CalcGenerator(opts);

        this.resultsWilks = cr.calc(calcNames);

        let siffCalcs = ['SiffTotal', 'SiffTotal_age'];
        if (opts.deadWeight) siffCalcs.unshift('SiffDead', 'SiffDead_age');
        if (opts.benchWeight) siffCalcs.unshift('SiffBench', 'SiffBench_age');
        if (opts.squatWeight) siffCalcs.unshift('SiffSquat', 'SiffSquat_age');
        this.resultsSiff = cr.calc(siffCalcs, false, true);

        let alloCalcs = ['AllometricTotal', 'AllometricTotal_age'];
        if (opts.deadWeight) alloCalcs.unshift('AllometricDead', 'AllometricDead_age');
        if (opts.benchWeight) alloCalcs.unshift('AllometricBench', 'AllometricBench_age');
        if (opts.squatWeight) alloCalcs.unshift('AllometricSquat', 'AllometricSquat_age');
        this.resultsAllo = cr.calc(alloCalcs, false, true);

    }

    /**
     * Render the results.
     * 
     * @return  {string}
     */
    render()
    {
        let ret = this.renderCalc(this.renderOptsWilks, this.resultsWilks);
        if (this.resultsSiff) {
            ret += this.renderCalc(this.renderOptsSiff, this.resultsSiff);
        }
        if (this.resultsAllo) {
            ret += this.renderCalc(this.renderOptsAllo, this.resultsAllo);
        }
        return Parser(ret);
    }
}
