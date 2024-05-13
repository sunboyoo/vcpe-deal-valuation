import React, {useEffect, useState} from 'react';
import {Button, Card, Flex, Steps} from 'antd';
import CapitalStack from "../../chartjs/CapitalStack";

const description = 'description.';

const App = ({onChange}) => {
    const [current, setCurrent] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [showAutoProgress, setShowAutoProgress] = useState(true);  // State to toggle button visibility


    const onChangeHandler = (value) => {
        setCurrent(value);
        if (onChange){
            onChange(value);
        }
    };

    const steps = [
        {
            title: 'Firm Value = 0',
            subTitle: '',
            content: 'content',
        },
        {
            title: 'Firm Value = 100',
            subTitle: 'Series A CP converts to CS',
            content: 'content',
        },
        {
            title: 'Firm Value = 160',
            subTitle: 'Series B CP Converts to CS',
            content: 'content',
        },
        {
            title: 'Firm Value = 210',
            subTitle: 'Series D CP Converts to CS',
            content: 'content',
        },
    ]

    const items = []
    steps.forEach((step, i) => {
        items.push({
            title: step.title,
            // title: i > current ? "do not convert" : i === current ? "converts" : "converted",
            subTitle: step.subTitle,
            description: step.description,
            content: "this is content",
        })
    })

    useEffect(() => {
        // This is to ensure the parent gets the initial `current` value or any updates
        if (onChange) {
            onChange(current);
        }

        if (current === steps.length - 1 && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
            setShowAutoProgress(true);
        }
    }, [current, steps.length, intervalId]);

    const startAutoProgress = () => {
        if (intervalId) return; // Prevent multiple intervals if already running

        // Reset the current step to 0 before starting the interval
        setCurrent(0);

        // Start the interval to increment `current` by 1 every second until it reaches the end
        const id = setInterval(() => {
            setCurrent(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(id);
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        setIntervalId(id);
        setShowAutoProgress(false);
    };

    const stopAutoProgress = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
            setShowAutoProgress(true);
        }
    };

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    return (
        <>
            <div style={{margin: 24, textAlign: 'center'}}>
                <Button
                    type="default"
                    style={{margin: '8px'}}
                    onClick={() => prev()}
                    disabled={current <= 0 || intervalId !== null}>
                    Previous
                </Button>
                <Button
                    type="default"
                    style={{margin: '8px'}}
                    onClick={() => next()}
                    disabled={current >= steps.length - 1 || intervalId !== null}>
                    Next
                </Button>
                {showAutoProgress && (
                    <Button
                        type="primary"
                        style={{ margin: '8px' }}
                        onClick={startAutoProgress}>
                        Auto Progress
                    </Button>
                )}
                {!showAutoProgress && (
                    <Button
                        danger
                        type="primary"
                        style={{ margin: '8px' }}
                        onClick={stopAutoProgress}>
                        Stop Auto Progress
                    </Button>
                )}
            </div>
            <Steps
                direction="horizontal"
                size="small"
                labelPlacement="vertical"
                current={current}
                onChange={onChangeHandler}
                items={items}
            />

            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                {[0,1,2,3].map((item,index) => (
                    <div key={index} style={{
                        flex: 1,
                        padding: '20px',
                        backgroundColor: current === index ? '#bae7ff': 'transparent',
                    }}>
                        <CapitalStack value={current}/>
                    </div>
                ))
                }
            </div>
        </>
    )
};
export default App;