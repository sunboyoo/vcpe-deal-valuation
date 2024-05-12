import React from 'react';
import { Flex } from 'antd';
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";

const baseStyle = {
    display: 'flex',
    alignItems: 'center', /* Aligns items vertically in the center */
    justifyContent: 'center', /* Aligns items horizontally in the center */
    margin: 4,
    width: '100%',
    color: 'white',
}

const colors = {
    CS: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.3),
    CPCS: ChartJSUtils.transparentize(ChartJSUtils.namedColor(1), 0.3),
    RP: ChartJSUtils.transparentize(ChartJSUtils.namedColor(2), 0.3),
    CPR: ChartJSUtils.transparentize(ChartJSUtils.namedColor(3), 0.3),
}


const data = [
    {
        type: 'CS',
        value: 5,
    },
    {
        type: 'CPCS',
        value: 15,
    },
    {
        type: 'RP',
        value: 10,
    },
    {
        type: 'CPR',
        value: 20,
    },
]

const styles = []

data.forEach((item) => {
        styles.push({
            ...baseStyle,
            height: 60,
            backgroundColor: colors[item.type],
        })}
    )
console.log(styles)


const App = ({value}) => {
    console.log("Capital Stack value:", value)
    return (
        <Flex
            vertical
            align="center"
        >
            {
                data.map((item, index) => (
                    <div
                        key={index}
                        style={styles[index]}
                    >{item.type}</div>
                ))
            }
        </Flex>
    );
};
export default App;