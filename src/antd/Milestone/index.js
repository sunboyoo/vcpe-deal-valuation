import React, {useEffect, useState} from 'react';
import {Button, Card, Steps} from 'antd';

const description = 'This is a description.';
const App = () => {
    const [current, setCurrent] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [showAutoProgress, setShowAutoProgress] = useState(true);  // State to toggle button visibility


    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };

    const steps = [
        {
            title: 'No conversions',
            subTitle: 'Firm Value = 0',
            description,
            content: 'content',
        },
        {
            title: 'Series B Converts',
            subTitle: 'Firm Value = 100',
            description,
            content: 'content',
        },
        {
            title: 'Series C Converts',
            subTitle: 'Firm Value = 200',
            description,
            content: 'content',
        },
        {
            title: 'Series D Converts',
            subTitle: 'Firm Value = 300',
            description,
            content: 'content',
        },
        {
            title: 'Series E Converts',
            subTitle: 'Firm Value = 400',
            description,
            content: 'content',
        },
    ]

    const items = []
    steps.forEach((step, i) => {
        items.push({
            title: i > current ? "do not convert" : i === current ? "converts" : "converted",
            subTitle: step.subTitle,
            description: step.description,
            content: "this is content",
        })
    })

    useEffect(() => {
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
            <div style={{margin: 24}}>
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
                {/*<Button*/}
                {/*    type="primary"*/}
                {/*    style={{margin: '8px'}}*/}
                {/*    onClick={startAutoProgress}*/}
                {/*    disabled={intervalId !== null}>*/}
                {/*    Auto Progress*/}
                {/*</Button>*/}
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
                size="default"
                labelPlacement="vertical"
                current={current}
                onChange={onChange}
                items={items}
            />
            <Card>
                {steps[current].content}
            </Card>
        </>
    )
};
export default App;