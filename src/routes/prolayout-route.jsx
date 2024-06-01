
import React from "react";
import {
    BarChartOutlined,
    DotChartOutlined,
    LineChartOutlined,
} from '@ant-design/icons';

export const route = {
        path: '/',
        routes: [
            {
                path: 'welcome',
                name: 'Welcome',
            },
            {
                path: 'option-warrant',
                name: 'Option and Warrant',
                icon: <BarChartOutlined/>,
                access: 'canAdmin',
                routes: [
                    {
                        path: 'european-call-put-option',
                        name: 'European Call/Put Option',
                    },
                    {
                        path: 'binary-option',
                        name: 'Binary Option',
                    },
                    {
                        path: 'warrant',
                        name: 'Warrant',
                    },
                ],
            },
            {
                path: 'series-a',
                name: 'Series A Valuation',
                icon: <LineChartOutlined/>,
                children: [
                    {
                        path: 'series-a-cs',
                        name: 'CS',
                    }, {
                        path: 'series-a-rp-cs',
                        name: 'RP and CS',
                    }, {
                        path: 'series-a-cp',
                        name: 'CP',
                    }, {
                        path: 'series-a-pcp',
                        name: 'PCP',
                    }
                ],
            }, {
                path: 'generic',
                name: 'Generic Payoff',
                icon: <DotChartOutlined/>,
                access: 'canAdmin',
                routes: [
                    {
                        path: 'payoff-diagram-option-portfolio',
                        name: 'Payoff Diagram of Option Portfolio',
                    },{
                        path: 'payoff-diagram-pvgpvlpv',
                        name: 'Payoff Diagram of PV, GPV, and LPV',
                    },
                    {
                        path: 'generic-payoff',
                        name: 'Generic Payoff Valuation',
                    },
                ],
            }, {
                path: 'multi-series',
                name: 'Multi Series',
                icon: <DotChartOutlined/>,
                access: 'canAdmin',
                routes: [
                    {
                        path: 'multi-series',
                        name: 'Multi Series',
                    },
                ],
            },
        ],
    }