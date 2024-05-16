import React, {useEffect, useState} from 'react';
import {Button, Steps} from 'antd';
import CommonStockDoughnut from "../../chartjs/CommonStockDoughnut";
import EquityStack from "../../chartjs/EquityStack";


const App = ({conversionSteps, equityStacks, csStacks, onChange}) => {
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
        title: 'Firm Value = 0',
    }]
    conversionSteps.forEach((step) => {
        items.push({
            title: `Firm Value = ${step.firmValue}`,
            subTitle: `${step.seriesName} CP converted into CS`,
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
                    disabled={current >= items.length - 1 || intervalId !== null}>
                    Next
                </Button>
                {showAutoProgress && (
                    <Button
                        type="primary"
                        style={{margin: '8px'}}
                        onClick={startAutoProgress}>
                        Auto Progress
                    </Button>
                )}
                {!showAutoProgress && (
                    <Button
                        danger
                        type="primary"
                        style={{margin: '8px'}}
                        onClick={stopAutoProgress}>
                        Stop Auto Progress
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
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                {equityStacks.map((equityStack, index) => (
                    <div key={index} style={{
                        flex: 1,
                        padding: '10px',
                        boxShadow: current === index ? '0px 0px 10px rgba(0, 0, 0, 0.5)' : 'none',
                    }}>
                        <EquityStack data={equityStack}/>
                        <CommonStockDoughnut csStack={csStacks[index]}/>
                    </div>
                ))
                }
            </div>
        </>
    )
};
export default App;