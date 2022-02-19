
/**
 * Base renderer class.
 */
export default class BaseRenderer
{
    /**
     * Render the results.
     * 
     * @param   {object}    opts        Options.
     * @param   {object}    resultSet   Result set to render.
     * @param   {object}    average     Averate value if there is one.
     * 
     * @return  {string}
     */
    renderCalc(opts, resultSet, average = null)
    {
        let ret = ''; 

        if (opts.title) {
            ret += `<h2>` + opts.title + `</h2>`;
        }
        
        ret += `<table id="${opts.tag}table" className="flextable stripe">`;

        ret += `<tr>`;
        ret += `<th>`;
        ret += opts.col1Title;
        ret += `</th>`;
        ret += `<th>`;
        ret += opts.col2Title;
        ret += `</th>`;
        ret += `<th>`;
        ret += opts.col3Title;
        ret += `</th>`;
        ret += `</tr>`;

        for (let name in resultSet) {
            ret += `<tr>`;

            ret += `<td className="size-33 right">`;
            if (opts.fieldReps && opts.fieldReps[name]) {
                ret += opts.fieldReps[name];
            } else {
                ret += name;
            }
            ret += `</td>`;
            if ('object' === typeof(resultSet[name])) {
                for (let idx in resultSet[name]) {
                    if ('val' === idx) {
                        ret += `<td className="size-33 right">`
                        ret += resultSet[name]['val'];
                        ret += `</td>`;
                    } else {
                        ret += `<td className="size-33 right">`
                        if ('_' !== idx[0]) {
                            ret += resultSet[name][idx] + '(' + idx + ')';
                        } else {
                            ret += resultSet[name][idx];
                        }
                        ret += `</td>`;
                    }
                }
            } else {
                ret += `<td className="size-50 right">`
                ret += resultSet[name];
                ret += `</td>`;
                ret += `<td className="size-50 right">`
                ret += `n/a`
                ret += `</td>`;
            }

            ret += `</tr>`;
        }

        if (average) {
            ret += `<tr className="avg">`;
            ret += `<td className="size-33 right">`;
            ret += `AVERAGE`;
            ret += `</td>`;
            ret += `<td className="size-33 right">`;
            ret += this.average.val;
            ret += `</td>`;
            ret += `<td className="size-33 right">&nbsp;</td>`;
            ret += `</tr>`;
        }

        ret += `</table>`;

        if (opts.notes) {
            ret += `<div className="notes">`;
            ret += opts.notes;
            ret += `</div>`;
        }

        return ret;
    }
}

