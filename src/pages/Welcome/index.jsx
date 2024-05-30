
import React from "react";
import {testConversionFunctions, testPortfolioConversionFunctions} from "../../lib/converter/option-line-converter";

export default function App () {
    testConversionFunctions()
    testPortfolioConversionFunctions()
    return (
        <div>Welcome</div>
    )
}