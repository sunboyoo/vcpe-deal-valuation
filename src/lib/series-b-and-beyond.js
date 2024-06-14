function isZeroOrPositiveInteger(n) {
    return Number.isInteger(n) && (n >= 0);
}

function isZeroOrPositiveNumber(n) {
    return Number.isFinite(n) && (n >= 0);
}

export class SingleSeries {
    constructor(name, cs, rpRv, cpConvertibleCs, cpOptionalValue) {
        if (!((typeof name === 'string') && (name.length > 0))) {
            throw new Error('name must be a string');
        }

        if (!isZeroOrPositiveNumber(cs)) {
            throw new Error('cs must be a zero or positive number');
        }

        if (!isZeroOrPositiveNumber(cpConvertibleCs)) {
            throw new Error('cpConvertibleCs must be a zero or positive number');
        }

        if (!isZeroOrPositiveNumber(cpOptionalValue)) {
            throw new Error('cpOptionalValue must be a zero or positive number');
        }

        if (!isZeroOrPositiveNumber(rpRv)) {
            throw new Error('rpRv must be a zero or positive number');
        }

        if ((cpConvertibleCs === 0 && cpOptionalValue !== 0) ||
            (cpConvertibleCs !== 0 && cpOptionalValue === 0)) {
            throw new Error('Both cpConvertibleCs and cpOptionalValue must either be zero or both must be positive at the same time.');
        }

        this.name = name;
        this.cs = cs;
        this.rpRv = rpRv;
        this.cpConvertibleCs = cpConvertibleCs;
        this.cpOptionalValue = cpOptionalValue;
        this.cpRvps = cpConvertibleCs > 0 ? cpOptionalValue / cpConvertibleCs : null;
        this.cpConversionOrder = null;
        this.cpConversionFirmValue = null;
    }
}


export class SeriesBAndBeyond {
    constructor() {
        this.seriesArray = [];
    }

    addOneSeries(name, cs, cpConvertibleCs, cpOptionalValue, rpRv) {
        // Check if the series name already exists in the seriesArray
        if (this.seriesArray.some(series => series.name === name)) {
            throw new Error(`A series with this name already exists. ${name}`);
        }
        // If the name is unique, proceed to create and add the new series
        this.seriesArray.push(new SingleSeries(name, cs, rpRv, cpConvertibleCs, cpOptionalValue));
    }

    removeOneSeriesById(id) {
        // Filter the seriesArray to remove the series with the matching id.
        const index = this.seriesArray.findIndex(series => series.id === id);
        if (index !== -1) { // Check if the series is found
            this.seriesArray.splice(index, 1);
        } else {
            throw new Error(`Series with the specified ID ${id} does not exist.`);
        }
    }

    removeOneSeriesByName(name) {
        // Find the index of the series with the given name
        const index = this.seriesArray.findIndex(series => series.name === name);
        if (index !== -1) { // Check if the series is found
            this.seriesArray.splice(index, 1);
        } else {
            throw new Error(`Series with the specified name ${name}does not exist.`);
        }
    }

    editOneSeries(newSingleSeries) {
        const index = this.seriesArray.findIndex(series => series.name === newSingleSeries.name);
        if (index !== -1) {
            // Update the series details with new data from newSingleSeries
            this.seriesArray[index] = newSingleSeries;
        } else {
            throw new Error('No series with the specified name exists to edit.');
        }
    }
}