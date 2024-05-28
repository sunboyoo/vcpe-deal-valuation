import {CallOption, Option} from "./option";

/**
 * Class representing a position in an option portfolio.
 */
export class OptionPosition {
    /**
     * Creates an option position.
     * @param {Option} option - The option object.
     * @param {number} quantity - The quantity of the option.
     * @throws {Error} Throws an error if the option is not an instance of Option or if the quantity is not a positive integer.
     */
    constructor(option, quantity) {
        if (!(option instanceof Option)) {
            console.log(option instanceof CallOption, option instanceof Option)
            throw new Error(`Only instances of Option or its subclasses can be added. ${option} was provided. ${option instanceof CallOption}`);
        }

        if (!Number.isFinite(quantity) && quantity !== 0) {
            throw new Error(`Quantity should be a non-zero finite number. ${quantity} was provided.`);
        }

        this.option = option;
        this.quantity = quantity;
    }
}