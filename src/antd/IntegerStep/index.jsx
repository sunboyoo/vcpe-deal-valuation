import React, {useEffect, useState} from 'react';
import { Col, InputNumber, Row, Slider, } from 'antd';

export const IntegerStep = ({min=0, max,value, onChange, ...options}) => {
    const [inputValue, setInputValue] = useState(value || min);

    useEffect(() => {
        setInputValue(value || min);
    }, [value, min]);

    const handleChange = (newValue) => {
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <>
            <Row>
                    <Slider
                        min={min}
                        max={max}
                        onChange={handleChange}
                        value={typeof inputValue === 'number' ? inputValue : min}
                        style={{ width: '100%' }}
                    />
            </Row>
            <Row>
                {/*<Col span={24}>*/}
                    <InputNumber
                        {...options}
                        min={min}
                        style={{
                            margin: '0 16px',
                            width: '100%',
                        }}
                        value={inputValue}
                        onChange={handleChange}
                    />
                {/*</Col>*/}
            </Row>
        </>
    );
};

export const DecimalStep = () => {
    const [inputValue, setInputValue] = useState(0);
    const onChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        setInputValue(value);
    };
    return (
        <Row>
            <Col span={12}>
                <Slider
                    min={0}
                    max={1}
                    onChange={onChange}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                    step={0.01}
                />
            </Col>
            <Col span={4}>
                <InputNumber
                    min={0}
                    max={1}
                    style={{
                        margin: '0 16px',
                    }}
                    step={0.01}
                    value={inputValue}
                    onChange={onChange}
                />
            </Col>
        </Row>
    );
};