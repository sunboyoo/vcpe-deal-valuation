import {Button, Card, Form, Input, InputNumber, Select, Space,} from "antd";
import React, {useState} from "react";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {SecurityType} from "../../lib/generic-payoff";
import ExpirationPayoffDiagramOptions from "../../chartjs/ExpirationPayoffDiagramOptions";
import {optionArrayToOptionPortfolio} from "../../lib/converter/option-line-converter";

const optionsInitialValues = [
    {
        securityType: SecurityType.CallOption,
        strike: 0,
        quantity: 1
    }, {
        securityType: SecurityType.CallOption,
        strike: 10,
        quantity: -1
    }, {
        securityType: SecurityType.CallOption,
        strike: 16,
        quantity: 1 / 4
    }, {
        securityType: SecurityType.CallOption,
        strike: 36,
        quantity: -1 / 20
    },
    {
        securityType: SecurityType.BinaryCallOption,
        strike: 130,
        quantity: 1.2
    }
]

const parseNumberFromFractionText = (value) => {
    if (typeof value === 'string' && value.includes('/')) {
        const [numerator, denominator] = value.split('/').map(Number);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator;
        } else {
            throw new Error('Invalid quantity');
        }
    } else if (!isNaN(parseFloat(value))) {
        return parseFloat(value);
    } else {
        throw new Error('Invalid number');
    }
};

export default function GenericExpirationPayoffDiagramPvGpvLpv() {
    const [options, setOptions] = useState([...optionsInitialValues])
    const [optionsInputError, setOptionsInputError] = useState(null);

    const onFinish = (values) => {
        setOptions(values.options.map((item) => ({...item, quantity: parseNumberFromFractionText(item.quantity)})))
        setOptionsInputError(null)
        console.log('Form.onFinish():', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Form.onFinishFailed():', errorInfo);
    };

    const onValuesChange = (valuesChanged, values) => {
        setOptionsInputError(null)
        try {
            const optionsInput = values.options.map((item) => ({...item, quantity: parseNumberFromFractionText(item.quantity)}))
            // Try to validate the input data
            optionArrayToOptionPortfolio(optionsInput);
            // If no error, pass to onFinish()
            onFinish(values)
        } catch (e) {
            setOptionsInputError(e.message)
            onFinishFailed(e)
        }
    }

    return (
        <>
            {options && options.length > 0 &&
                <Card>
                    <ExpirationPayoffDiagramOptions options={options}/>
                </Card>
            }
            <Card style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Form
                    name="basic"
                    layout={"vertical"}
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    labelAlign={"left"}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={onValuesChange}
                    autoComplete="on"
                    initialValues={{options}}
                    requiredMark={false}
                >
                    <h1 style={{color: '#595959'}}>Payoff Schedule - Option Portfolio</h1>
                    <h3 style={{color: '#8c8c8c'}}>{optionArrayToOptionPortfolio(options).text()}</h3>
                    <Form.List name="options">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}, index) => (
                                    <Space
                                        key={key}
                                        style={{display: 'flex'}}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'securityType']}
                                            label={key === fields[0].key ? 'Option Type' : ''}
                                            rules={[{required: true, message: 'Missing Security Type'}]}
                                        >
                                            <Select
                                                style={{width: '200px'}}
                                                options={[
                                                    {value: SecurityType.CallOption, label: 'Call Option'},
                                                    {
                                                        value: SecurityType.BinaryCallOption,
                                                        label: 'Binary Call Option'
                                                    }
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'strike']}
                                            label={key === fields[0].key ? 'Option Strike Price' : ''}
                                            rules={[{required: true, message: 'This is a required field.'},
                                                {
                                                    validator: (_, value) => {
                                                        return new Promise((resolve, reject) => { // Updated to return a promise
                                                            const optionsInput = fields.map(
                                                                (field,i) => {
                                                                    if (i === index) {
                                                                        // When the input doesn't meet other validator,
                                                                        // the fields doesn't take the input value
                                                                        return {...options[field.name], strike: value };
                                                                    }
                                                                    return    options[field.name] || {}
                                                                }
                                                            );

                                                            // Handled by {required: true, message: 'This is a required field.'}
                                                            if (value === null || value === undefined){
                                                                resolve();
                                                            }

                                                            // check ascending order
                                                            for (let j = 0; j < optionsInput.length; j++) {
                                                                if (index < j && value >= optionsInput[j].strike) {
                                                                    reject(new Error("Strike prices must be in ascending order"));
                                                                } else if (index > j && value <= optionsInput[j].strike) {
                                                                    reject(new Error("Strike prices must be in ascending order"));
                                                                }
                                                            }

                                                            // Try to validate the input data
                                                            try {
                                                                optionArrayToOptionPortfolio(optionsInput.map((item) => ({...item, quantity: parseNumberFromFractionText(item.quantity)}))
                                                                );
                                                            } catch (e) {
                                                                reject(new Error(e.message));
                                                            }
                                                            resolve();
                                                        });
                                                    }
                                                }
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder="0"
                                                min={0}
                                                prefix={'$'}
                                                style={{width: '100%'}}/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            label={key === fields[0].key ? 'Number of Options Held' : ''}
                                            rules={[
                                                {required: true, message: 'This is a required field.'},
                                                {
                                                    validator: (_, value) => {
                                                        if (value === null || value === undefined || value === '') {
                                                            return Promise.resolve();
                                                        }

                                                        try {
                                                            parseNumberFromFractionText(value);
                                                        } catch (error) {
                                                            return Promise.reject(new Error('Invalid fraction or number'));
                                                        }

                                                        // Try to validate the input data
                                                        try {
                                                            const optionsInput = fields.map(
                                                                (field,i) => {
                                                                    if (i === index) {
                                                                        // When the input doesn't meet other validator,
                                                                        // the fields doesn't take the input value
                                                                        return {...options[field.name], quantity: value };
                                                                    }
                                                                    return    options[field.name] || {}
                                                                }
                                                            );
                                                            optionArrayToOptionPortfolio(optionsInput.map((item) => ({...item, quantity: parseNumberFromFractionText(item.quantity)}))
                                                            );
                                                        } catch (e) {
                                                            return Promise.reject(new Error(e.message));
                                                        }

                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Input
                                                placeholder="-1/2"
                                                style={{width: '100%'}}/>
                                        </Form.Item>

                                        <div className={'ant-form-item-row'}>
                                            {key !== fields[0].key ? null :
                                                <div
                                                    className={'ant-form-item-label'}
                                                    style={{color: 'transparent'}}>{'remove'}
                                                </div>}
                                            <div className={'ant-form-item-control'}>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => remove(name)}
                                                    block
                                                    icon={<MinusCircleOutlined/>}>
                                                    remove
                                                </Button>
                                            </div>
                                        </div>

                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Add a new line
                                    </Button>
                                </Form.Item>
                                <p style={{color: '#fa8c16'}}>{optionsInputError}</p>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Card>
        </>
    );
}