import {Option} from "./option";

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
            throw new Error(`Only instances of Option or its subclasses can be added. ${option} was provided.`);
        }

        if (!Number.isFinite(quantity)) {
            throw new Error(`Quantity should be a finite number. ${quantity} was provided.`);
        }

        // Allow quantity === 0 to support the first LineSegment (0,0)[k=0]->(10,0)[k=1], 0xC(0) -> 1xC(10)
        // if (quantity === 0) {
        //     throw new Error(`Quantity should be a non-zero number. ${quantity} was provided.`);
        // }

        this.option = option;
        this.quantity = quantity;
    }
}