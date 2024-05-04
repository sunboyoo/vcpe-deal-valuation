export const populateDataByLabelsFunction = {
    id: "func",
    beforeInit(chart, args, options) {
        const {labels, datasets} = chart.config.data

        for (let i=0; i<datasets.length; i++){
            const {func, data} = datasets[i]
            if (func){
                // clear all elements of data
                data.splice(0, data.length)
                for (let j=0; j<labels.length; j++){
                    data.push(func(labels[j]))
                }
            }
        }
    }
}