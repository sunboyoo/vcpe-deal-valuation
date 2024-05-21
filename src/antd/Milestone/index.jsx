import React, {useEffect, useState} from 'react';
import {Button, Steps} from 'antd';
import CommonStockDoughnut from "../../chartjs/CommonStockDoughnut";

function arrayToString(arr) {
    if (arr.length === 0) {
        return "";
    } else if (arr.length === 1) {
        return arr[0];
    } else if (arr.length === 2) {
        return arr.join(" and ");
    } else {
        // Access the last element without modifying the original array
        let lastElement = arr[arr.length - 1];
        let initialElements = arr.slice(0, arr.length - 1);
        return initialElements.join(", ") + ", and " + lastElement;
    }
}

const App = ({conversionSteps, csStacks, onChange}) => {
    const [current, setCurrent] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [showAutoProgress, setShowAutoProgress] = useState(true);  // State to toggle button visibility

    const onChangeHandler = (value) => {
        setCurrent(value);
        if (onChange){
            onChange(value);
        }
    };

    const items = [{
        title: 'Firm Value = $0',
    }]
    conversionSteps.forEach((step) => {
        items.push({
            title: `Firm Value = $${step.firmValue}`,
            subTitle: `[${arrayToString(step.seriesList)}] CP converted into CS`,
        })
    })

    useEffect(() => {
        // This is to ensure the parent gets the initial `current` value or any updates
        if (onChange) {
            onChange(current);
        }

        if (current === items.length - 1 && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
            setShowAutoProgress(true);
        }
    }, [current, items.length, intervalId]);

    const startAutoProgress = () => {
        if (intervalId) return; // Prevent multiple intervals if already running

        // Reset the current step to 0 before starting the interval
        setCurrent(0);

        // Start the interval to increment `current` by 1 every second until it reaches the end
        const id = setInterval(() => {
            setCurrent(prev => {
                if (prev >= items.length - 1) {
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
            <h2>Impact of Convertible Preferred Stock Conversions on Equity Ownership</h2>

            <div style={{margin: 24, textAlign: 'center'}}>
                <Button
                    type="default"
                    style={{margin: '8px'}}
                    onClick={() => prev()}
                    disabled={current <= 0 || intervalId !== null}>
                    Go to the previous scenario
                </Button>
                <Button
                    type="default"
                    style={{margin: '8px'}}
                    onClick={() => next()}
                    disabled={current >= items.length - 1 || intervalId !== null}>
                    Go to the next scenario
                </Button>
                {showAutoProgress && (
                    <Button
                        type="primary"
                        style={{margin: '8px'}}
                        onClick={startAutoProgress}>
                        Automatically progress through each scenario
                    </Button>
                )}
                {!showAutoProgress && (
                    <Button
                        danger
                        type="primary"
                        style={{margin: '8px'}}
                        onClick={stopAutoProgress}>
                        Stop Automatically Progress
                    </Button>
                )}
            </div>
            <p/>
            <Steps
                direction="horizontal"
                size="small"
                labelPlacement="vertical"
                current={current}
                onChange={onChangeHandler}
                items={items}
            />
            <p/>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                {csStacks.map((csStack, index) => (
                    <div key={index} style={{
                        flex: 1,
                        // padding: '0px',
                        boxShadow: current === index ? '0px 0px 10px rgba(0, 0, 0, 0.5)' : 'none',
                        width: '300px', // Set your desired width
                        height: '400px', // Set your desired height
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/*<EquityStack data={[...equityStack]}/>*/}
                        <CommonStockDoughnut csStack={[...csStack]}/>
                    </div>
                ))
                }
            </div>
        </>
    )
};
export default App;