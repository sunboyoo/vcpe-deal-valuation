import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {SecurityType} from "../../lib/generic-payoff";
import ExpirationPayoffDiagramSegmentedLine from "../../chartjs/ExpirationPayoffDiagramSegmentedLine";
import {optionArrayToSegmentedLine} from "../../lib/line/line-option-converter";



const parseNumberFromFractionText = (value) => {
    if (typeof value === 'string' && value.includes('/')) {
        const [numerator, denominator] = value.split('/').map(Number);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator;
        } else {
            throw new Error('Invalid fraction');
        }
    } else if (!isNaN(parseFloat(value))) {
        return parseFloat(value);
    } else {
        throw new Error('Invalid number');
    }
};

const initialValues = {
    formValues: [
        {
            securityType: SecurityType.CallOption,
            strike: 0,
            fraction: '1'
        }, {
            securityType: SecurityType.CallOption,
            strike: 10,
            fraction: '-1'
        }, {
            securityType: SecurityType.CallOption,
            strike: 16,
            fraction: '1/4'
        }, {
            securityType: SecurityType.CallOption,
            strike: 36,
            fraction: '-1/20'
        }, {
            securityType: SecurityType.BinaryCallOption,
            strike: 130,
            fraction: '1.2'
        }
    ],
};

const App = ({onFinish}) => {

    const onFinishHandler = (values) => {
        const optionArray = values.formValues;
        const data = optionArray.map((item, index) => ({...item, fraction: parseNumberFromFractionText(item.fraction)}))
        onFinish(data);
        console.log('Received values of form:', data);
    };



    return (
        <>

        <h1>Payoff Schedule</h1>
        <Form
            name="dynamic_form_nest_item"
            onFinish={onFinishHandler}
            style={{
                // maxWidth: 600,
            }}
            autoComplete="off"
            layout={'vertical'}
            initialValues={initialValues}
        >
            <Form.List name="formValues">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'securityType']}
                                    label={key === fields[0].key ? 'Security Type' : ''}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing Security Type',
                                        },
                                    ]}
                                >
                                    <Select
                                        style={{minWidth: 190}}
                                        options={[
                                            {value: SecurityType.CallOption, label: 'Call Option'},
                                            {value: SecurityType.BinaryCallOption, label: 'Binary Call Option'}]}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'fraction']}
                                    label={key === fields[0].key ? 'Fraction' : ''}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing Fraction',
                                        },
                                        {
                                            validator: (_, value) => {
                                                if (value.includes('/')) {
                                                    const [numerator, denominator] = value.split('/').map(Number);
                                                    if (denominator === 0 || isNaN(numerator) || isNaN(denominator)) {
                                                        return Promise.reject(new Error('Invalid fraction'));
                                                    }
                                                } else if (isNaN(parseFloat(value))) {
                                                    return Promise.reject(new Error('Invalid number'));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder="-1/2" style={{ }} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'strike']}
                                    label={key === fields[0].key ? 'Strike Price' : ''}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing Strike Price',
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder="0" min={0} prefix={'$'} style={{minWidth: 100}}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add a new line
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Confirm
                </Button>
            </Form.Item>
        </Form>
        </>
    );
}
export default App;