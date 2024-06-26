export const IsNanError = new TypeError('resulted in NaN');
export const FailedToConvergeError = new Error('failed to converge');
export const InvalidInputsError = new Error('invalid inputs');

const goalSeek = ({
                      fn,
                      fnParams,
                      percentTolerance,
                      customToleranceFn,
                      maxIterations,
                      maxStep,
                      goal,
                      independentVariableIdx,
                  }) => {
    if (typeof customToleranceFn !== 'function' && !percentTolerance) {
        throw InvalidInputsError;
    }

    let g, y, y1, oldGuess, newGuess;
    const absoluteTolerance = ((percentTolerance || 0) / 100) * goal;

    // iterate through the guesses
    for (let i = 0; i < maxIterations; i++) {
        const res = fn.apply(null, fnParams);
        y = res - goal;
        if (isNaN(y)) throw IsNanError;

        // was our initial guess a good one?
        if (typeof customToleranceFn !== 'function') {
            if (Math.abs(y) <= Math.abs(absoluteTolerance)) return fnParams[independentVariableIdx];
        } else {
            if (customToleranceFn(res)) return fnParams[independentVariableIdx];
        }

        // set the new guess, correcting for maxStep
        oldGuess = fnParams[independentVariableIdx];
        newGuess = oldGuess + y;
        if (Math.abs(newGuess - oldGuess) > maxStep) {
            newGuess = newGuess > oldGuess ? oldGuess + maxStep : oldGuess - maxStep;
        }

        fnParams[independentVariableIdx] = newGuess;

        // re-run the fn with the new guess
        y1 = fn.apply(null, fnParams) - goal;
        if (isNaN(y1)) throw IsNanError;

        // calculate the error
        g = (y1 - y) / y;
        if (g === 0) g = 0.0001;

        // set the new guess based on the error, correcting for maxStep
        newGuess = oldGuess - y / g;
        if (maxStep && Math.abs(newGuess - oldGuess) > maxStep) {
            newGuess = newGuess > oldGuess ? oldGuess + maxStep : oldGuess - maxStep;
        }

        fnParams[independentVariableIdx] = newGuess;
    }

    // done with iterations, and we failed to converge
    throw FailedToConvergeError;
};

export default goalSeek;
