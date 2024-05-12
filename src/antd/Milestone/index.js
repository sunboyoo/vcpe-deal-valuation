import React, {useState} from 'react';
import { Steps } from 'antd';
const description = 'This is a description.';
const App = () => {
    const [current, setCurrent] = useState(0);
    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };

    const events = [
        {
            title: 'No conversions',
            subTitle: 'Firm Value = 0',
            description,
        },
        {
            title: 'Series B Converts',
            subTitle: 'Firm Value = 100',
            description,
        },
        {
            title: 'Series C Converts',
            subTitle: 'Firm Value = 200',
            description,
        },
        {
            title: 'Series D Converts',
            subTitle: 'Firm Value = 300',
            description,
        },
        {
            title: 'Series E Converts',
            subTitle: 'Firm Value = 400',
            description,
        },
    ]

    const items = []
    events.forEach((e, i) => {
        items.push({
            title: i > current ? "do not convert" : i === current ? "converts" : "converted",
            subTitle: events[i].subTitle,
            description: events[i].description,
        })
    })

    return (
        <Steps
            direction="horizontal"
            size="default"
            labelPlacement="vertical"
            current={current}
            onChange={onChange}
            items={items}
        />
    )
};
export default App;