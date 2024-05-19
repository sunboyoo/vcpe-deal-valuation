import { DotChartOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';
const items = [
    {
        label: 'Security Valuation',
        key: 'security-valuation',
        icon: <DotChartOutlined />,
        theme: "light",
        children: [
            {
                type: 'group',
                label: 'Option and Warrant',
                theme: "light",
                children: [
                    {
                        label: 'European Call/Put Option',
                        key: 'european-call-put-option',
                    },
                    {
                        label: 'Binary Option',
                        key: 'binary-option',
                    },
                    {
                        label: 'Warrant',
                        key: 'warrant',
                    },
                ],
            },
            {
                type: 'group',
                label: 'Preferred Stocks',
                children: [
                    {
                        label: 'Series A Common Stock',
                        key: 'series-a-cs',
                    },
                    {
                        label: 'Series A Redeemable Preferred and Common Stock',
                        key: 'series-a-rp-cs',
                    },
                    {
                        label: 'Series A Convertible Preferred Stock',
                        key: 'series-a-cp',
                    },
                    {
                        label: 'Series A Participating Convertible Preferred Stock',
                        key: 'series-a-pcp',
                    },
                    {
                        label: 'Generic Payoff',
                        key: 'generic-payoff',
                    },                    {
                        label: 'Multiple Series',
                        key: 'multi-series',
                    },
                ],
            },
        ],
    }
];
const App = ({onMenuSelection}) => {
    const [current, setCurrent] = useState(items[0].key);
    const onClick = (e) => {
        onMenuSelection(e.key)
        setCurrent(e.key);
    };
    return <Menu theme={"dark"}  onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default App;