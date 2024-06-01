import {OptionPosition} from "./option-position";
import {BinaryCallOption, CallOption, OPTION_TYPES, trimNumber,} from "./option";
import {optionPortfolioToSegmentedLine} from "../converter/option-line-converter";

/**
 * Class representing a portfolio of options.
 */
export class OptionPortfolio {
    constructor() {
        this.positions = [];
    }

    /**
     * Adds a new option position to the portfolio by type and strike.
     * @param {string} type - The type of the option.
     * @param {number} strike - The strike price of the option.
     * @param {number} quantity - The quantity of the option.
     * @throws {Error} Throws an error if the strike price is not unique.
     */
    addPosition(type, strike, quantity){
        // (0) Basic validation
        // The strike needs to be unique and needs to be in ascending order
        if (this.positions.some(position => position.option.strike === strike)) {
            throw new Error(`Strike prices in OptionPortfolio must be unique. ${strike} was provided.`);
        }

        const option = type === OPTION_TYPES.CALL_OPTION ? new CallOption(strike) : new BinaryCallOption(strike) ;

        // Prepare for additional validation
        const positionArray = this.positions.map((position) => position)
        positionArray.push(new OptionPosition(option, quantity));

        // (1) Validate the slope value of the line
        // For all the Call Options, excluding Binary Call Options, q1 + q2 + ... >= 0
        positionArray.sort((a, b) => a.option.strike - b.option.strike)
        let slope = 0;
        positionArray.forEach((position, index) => {
            if (position.option instanceof CallOption) {
                slope += position.quantity;
                if (slope < 0) {
                    throw new Error(`The slope of the line must be zero or positive. The input fraction value ${position.quantity} results in a slope of ${slope}`);
                }
            }
        })

        // (2) Validate the drop value of PCP
        // For Binary Call Options, Y_start = Y_end_pre + q >= 0
        const testPortfolio = new OptionPortfolio();
        positionArray.forEach((position) => {
            testPortfolio.addPositionWithoutValidation(position.option.type, position.option.strike, position.quantity);
        })
        const line = optionPortfolioToSegmentedLine(testPortfolio)
        positionArray.forEach((position, i) => {
            if (position.option instanceof BinaryCallOption) {
                const quantity = position.quantity;
                const yEndPre = line.segments[i - 1].yEnd;
                if (yEndPre + quantity < 0){
                    throw new Error(`The payoff after the drop must be zero or positive. The quantity ${quantity} results in a negative payoff after the drop.`)
                }
            }
        })

        this.positions.push(new OptionPosition(option, quantity));

        // Ascending Order
        // It is more efficient to sort the positions after adding a new one,
        // rather than enforcing the order upon each addition.
        this.positions.sort((a, b) => a.option.strike - b.option.strike);
    }

    addPositionWithoutValidation(type, strike, quantity){
        // The strike needs to be unique and needs to be in ascending order
        if (this.positions.some(position => position.option.strike === strike)) {
            throw new Error(`Strike prices in OptionPortfolio must be unique. ${strike} was provided.`);
        }

        const option = type === OPTION_TYPES.CALL_OPTION ? new CallOption(strike) : new BinaryCallOption(strike) ;
        this.positions.push(new OptionPosition(option, quantity));

        // Ascending Order
        // It is more efficient to sort the positions after adding a new one,
        // rather than enforcing the order upon each addition.
        this.positions.sort((a, b) => a.option.strike - b.option.strike);
    }

    /**
     * Removes an option position from the portfolio by strike price.
     * @param {number} strike - The strike price of the option position to be removed.
     * @throws {Error} Throws an error if the position does not exist.
     */
    removePositionByStrike(strike) {
        const index = this.positions.findIndex(position => position.option.strike === strike);
        if (index > -1) {
            this.positions.splice(index, 1);
        } else {
            throw new Error(`OptionPortfolio can't remove a non-existing Position with strike ${strike}.`);
        }
    }

    text() {
        let s = '';
        this.positions.forEach(((position, index) => {
            // 不显示 '0 x C(n)' 的情况
            if (position.quantity !== 0) {
                const quantity = position.quantity;
                const option = position.option;

                if (s === '') {
                    if (quantity === 1) {
                        s += ''
                    } else if (quantity === -1) {
                        s += '-'
                    } else {
                        s += quantity > 0 ? `${trimNumber(quantity)} x ` : `(${trimNumber(quantity)}) x `
                    }
                } else {
                    if (quantity === 1) {
                        s += ' + '
                    } else if (quantity === -1) {
                        s += ' - '
                    } else {
                        s += quantity > 0 ? ` + ${trimNumber(quantity)} x ` : ` - ${trimNumber(Math.abs(quantity))} x `
                    }
                }

                s += `${option.text()}`
            }

        }))
        return s;
    }
}

export function optionPortfolioTest(){
    const portfolio = new OptionPortfolio();
    portfolio.addPosition(OPTION_TYPES.CALL_OPTION, 10, -2);
    portfolio.addPosition(OPTION_TYPES.BINARY_CALL_OPTION, 20, 5);
    portfolio.addPosition(OPTION_TYPES.CALL_OPTION, 30, -7);

    console.log(portfolio.text());
}
