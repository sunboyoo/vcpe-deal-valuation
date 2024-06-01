export class OptionArrayUtils {
    static validate(optionArray){
        if (!Array.isArray(optionArray)){
            throw new Error("Options must be an array");
        }

        optionArray.forEach((option, index) => {
            ['securityType', 'strike', 'fraction'].forEach((key) => {
                if (!Object.keys(option).includes(key)) {
                    throw new Error(`Missing the value for ${key}`)
                }
            })

            Object.entries(option).forEach(([key, value]) => {
                if (value === undefined){
                    throw new Error(`Incorrect value for ${key}`)
                }
            })

            if (index > 0 && option.strike <= optionArray[index - 1].strike){
                throw new Error("Strike prices must be in ascending order");
            }
        })
    }
}