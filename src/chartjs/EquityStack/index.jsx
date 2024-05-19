import React from 'react';
import {Flex} from "antd";
import {SECURITY_TYPES} from "../../lib/constants";
import * as ChartJSUtils from "../ExpirationPayoffDiagram/chartjs-utils";

const baseStyle = {
    display: 'flex',
    alignItems: 'center', /* Aligns items vertically in the center */
    justifyContent: 'center', /* Aligns items horizontally in the center */
    margin: 4,
    width: '90%',
    color: 'white',
    fontSize: 12,
}

const types = {
    [SECURITY_TYPES.CS.code]: {
        code: 'CS',
        text: 'CS',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.4),
    },
    [SECURITY_TYPES.CP_CS.code]: {
        code: 'CP_CS',
        text: 'CP->CS',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.6),
    },
    [SECURITY_TYPES.RP.code]: {
        code: 'RP',
        text: 'RP',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.5),
    },
    [SECURITY_TYPES.CP_RV.code]: {
        code: 'CP_RV',
        text: 'CP->Redeem',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.7),
    },
}

// (1) RP and CP_RV, sorted by Series Index
// (2) CS and CP_CS, sorted by Series Index
/**
const demoData = [
    {
        type: SECURITY_TYPES.RP.code,
        seriesName: 'Series E',
        value: '15',
    },{
        type: SECURITY_TYPES.CP_RV.code,
        seriesName: 'Series D',
        value: '30',
    },    {
        type: types.RP.code,
        seriesName: 'Series C',
        value: '15',
    },        {
        type: SECURITY_TYPES.CP_RV.code,
        seriesName: 'Series B',
        value: '20',
    },
    {
        type: SECURITY_TYPES.CS.code,
        seriesName: 'Series E',
        value: '5',
    },{
        type: SECURITY_TYPES.CS.code,
        seriesName: 'Series C',
        value: '5',
    },{
        type: SECURITY_TYPES.CS.code,
        seriesName: 'Founders',
        value: '5',
    },
]
*/

const App = ({data}) => {
    const styles = []

    if (!data){
        return null
    }

    data.forEach((item) => {
        styles.push({
            ...baseStyle,
            height: 40,
            backgroundColor: types[item.type].backgroundColor,
        })}
    )

    return (
        <Flex
            vertical
            align="center"
        >
            {data.map((item, index) => (
                    <div
                        key={index}
                        style={styles[index]}
                    >{`${types[item.type].text}, ${item.value}, ${item.seriesName}`}</div>
                ))
            }
        </Flex>
    );
};

export default App;