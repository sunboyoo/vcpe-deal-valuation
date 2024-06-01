/**
 * Enum for option types.
 * @readonly
 * @enum {string}
 */
export const OPTION_TYPES = {
    CALL_OPTION: 'CallOption',
    BINARY_CALL_OPTION: 'BinaryCallOption',
}

/**
 * Base class for options.
 */
export class Option {
    /**
     * Creates an option.
     * @param {string} type - The type of the option.
     * @param {number} strike - The strike price of the option.
     * @throws {Error} Throws an error if the type is not supported or if the strike price is not a finite number.
     */
    constructor(type, strike) {
        if (type !== OPTION_TYPES.CALL_OPTION && type !== OPTION_TYPES.BINARY_CALL_OPTION) {
            throw new Error(`The option type ${type} is not supported.`)
        }

        if (!Number.isFinite(strike) || strike < 0) {
            throw new Error(`The strike price must be zero or positive. ${strike} was provided.`);
        }

        this.type = type;
        this.strike = strike;
    }
    text() {
        return `${this.type}(${trimNumber(this.strike)})`;
    }
}

/**
 * Class representing a call option.
 * @extends Option
 */
export class CallOption extends Option {
    /**
     * Creates a call option.
     * @param {number} strike - The strike price of the call option.
     */
    constructor(strike) {
        super(OPTION_TYPES.CALL_OPTION, strike);
    }

    text() {
        return `C(${trimNumber(this.strike)})`;
    }
}

/**
 * Class representing a binary call option.
 * @extends Option
 */
export class BinaryCallOption extends Option {
    /**
     * Creates a binary call option.
     * @param {number} strike - The strike price of the binary call option.
     */
    constructor(strike) {
        super(OPTION_TYPES.BINARY_CALL_OPTION, strike);
    }

    text() {
        return `BC(${trimNumber(this.strike)})`;
    }
}

export function trimNumber(n) {
    return parseFloat(n).toFixed(4).replace(/\.?0*$/, '');
}