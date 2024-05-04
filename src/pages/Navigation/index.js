import { DotChartOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
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
                        key: 'europeanCallPutOption',
                    },
                    {
                        label: 'Binary Option',
                        key: 'binaryOption',
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
                        key: 'seriesACs',
                    },
                    {
                        label: 'Series A Redeemable Preferred and Common Stock',
                        key: 'seriesARpCs',
                    },
                    {
                        label: 'Series A Convertible Preferred Stock',
                        key: 'seriesACp',
                    },
                    {
                        label: 'Series A Participating Convertible Preferred Stock',
                        key: 'seriesAPcp',
                    },
                    {
                        label: 'Generic Payoff',
                        key: 'genericPayoff',
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