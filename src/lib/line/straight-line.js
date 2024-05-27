export class StraightLine {
    constructor(x, y, k, epsilon=1e-10) {
        this.x0 = x;
        this.y0 = y;
        this.k = k;
        this.epsilon = epsilon; // Small tolerance value for floating-point comparisons
    }

    static slopeFor(x1, y1, x2, y2){
        return (y2 - y1) / (x2 - x1);
    }

    setEpsilon(epsilon){
        this.epsilon = epsilon;
    }

    // addresses floating-point precision issues
    equal(a, b) {
        return Math.abs(a - b) < this.epsilon;
    }

    y(x){
        // it works when x === this.x0
        return this.y0 + (x - this.x0) * this.k;
    }

    /**
     * @returns {undefined|number[]|number}
     */
    x(y){
        if (this.k !== 0){
            // Non-horizontal line: calculate x using rearranged point-slope form
            // x has one unique number
            // it works when y === this.y0
            return this.x0 + (y - this.y0) / this.k;
        } else if (this.k === 0){
            // Horizontal line
            if (y === this.y0){
                // Horizontal line at y0: x can be any value
                return [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
            }
            // x doesn't exist
            return undefined
        } else {
            // y does not intersect a horizontal line at y0
            // x doesn't exist
            return undefined;
        }
    }

    contains(x, y) {
        if (this.k === 0) {
            // For horizontal lines, check if y equals y0
            // y and y0 are not calculated, so no need for tolerance
            return y === this.y0;
        } else {
            // For non-horizontal lines, check if y equals y0 + k * (x - x0) within epsilon tolerance
            // y0 + k * (x - x0) is calculated, so use tolerance for comparison
            return this.equal(y, this.y0 + this.k * (x - this.x0));
        }
    }
}