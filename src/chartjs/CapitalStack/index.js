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


const types = {
    CS: {
        code: 'CS',
        text: 'CS',
        color: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.4),
    },
    CPCS: {
        code: 'CPCS',
        text: 'CP->CS',
        color: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.6),
    },
    RP: {
        code: 'RP',
        text: 'RP',
        color: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.5),
    },
    CPR: {
        code: 'CPR',
        text: 'CP->Redeem',
        color: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.7),
    },
}

// (1) RP and CPR, sorted by Series Index
// (2) CS and CPCS, sorted by Series Index
const demoData = [
    {
        type: types.RP.code,
        seriesName: 'Series E',
        value: '15',
    },{
        type: types.CPR.code,
        seriesName: 'Series D',
        value: '30',
    },    {
        type: types.RP.code,
        seriesName: 'Series C',
        value: '15',
    },        {
        type: types.CPR.code,
        seriesName: 'Series B',
        value: '20',
    },
    {
        type: types.CS.code,
        seriesName: 'Series E',
        value: '5',
    },{
        type: types.CS.code,
        seriesName: 'Series C',
        value: '5',
    },{
        type: types.CS.code,
        seriesName: 'Founders',
        value: '5',
    },
]



const App = ({data=demoData}) => {
    const styles = []

    data.forEach((item) => {
        styles.push({
            ...baseStyle,
            height: 40,
            backgroundColor: types[item.type].color,
        })}
    )

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
                    >{`${types[item.type].text}, ${item.seriesName}, ${item.value}`}</div>
                ))
            }
        </Flex>
    );
};
export default App;