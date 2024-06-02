import {Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Statistic, Table, Tag} from "antd";
import React, {useState} from "react";
import {
    CaretDownOutlined,
    CaretRightOutlined,
    DashOutlined,
    MinusCircleOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {payoff, transactionValuation} from "../../lib/generic-payoff";
import GenericPayoffInstruction from "./desc";
import {optionArrayToOptionPortfolio} from "../../lib/converter/option-line-converter";
import {OPTION_TYPES} from "../../lib/option/option";


// so = pre-money shares outstanding		11
// sp = new common shares purchased		5
// inv = investment in this round		$4.00
// tv = total valuation		$18.00
// sd = volatility	σ=	90.00%
// r = interest rate	r=	5.00%
// H = expected holding period	H=	6
// ci = carried interest		20%
// lfp = lifetime fee percentage
// debt = debt		$0.00


const optionsInitialValues = [
    {
        securityType: OPTION_TYPES.CALL_OPTION,
        strike: 0,
        quantity: 1
    }, {
        securityType: OPTION_TYPES.CALL_OPTION,
        strike: 10,
        quantity: -1
    }, {
        securityType: OPTION_TYPES.CALL_OPTION,
        strike: 16,
        quantity: '1/4'
    }, {
        securityType: OPTION_TYPES.CALL_OPTION,
        strike: 36,
        quantity: `-1/20`
    }, {
        securityType: OPTION_TYPES.CALL_OPTION,
        strike: 60,
        quantity: `-1/12`
    }
]

const initialValues = {
    inv: 12,
    tv: 50,
    vol: 90,
    r: 5,
    H: 4,
    lfp: 25,
    options: optionsInitialValues,
}

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

export default function GenericPayoff() {
    const [variables, setVariables] = useState({...initialValues})
    const [result, setResult] = useState(undefined)
    const [visible, setVisible] = useState(false)

    const onFinish = (values) => {
        const {tv, H, r, vol, options} = values
        const genericOptions = options.map((item) => ({
            ...item,
            quantity: parseNumberFromFractionText(item.quantity)
        }))
        setVariables({...values})
        setResult(payoff(genericOptions, tv, H, r / 100., vol / 100.))
        setVisible(true)
    };
    const onFinishFailed = (errorInfo) => {
        setVisible(false)
    };

    const onValuesChange = () => {
        setVisible(false)
    }

    const regexPositiveNumber = /^(?!0+(\.0+)?$)(0+\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?)$/
    const regexZeroOrPositiveNumber = /^(\d+(\.\d*)?|\.\d+)$/;

    const thisIsARequiredField = "This is a required field."

    return (
        <>
            <Space direction="vertical">
                <Card>
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
                        initialValues={variables}
                        requiredMark={false}

                    >
                        <h1>Inputs</h1>

                        <Form.Item
                            label="Total Valuation"
                            name="tv"
                            rules={[
                                {
                                    required: true,
                                    message: thisIsARequiredField,
                                }, {
                                    pattern: regexPositiveNumber,
                                    message: "This is a positive number."
                                }
                            ]}
                        >
                            <InputNumber size={"middle"} style={{width: "100%"}} addonBefore="$"/>
                        </Form.Item>
                        <Form.Item
                            label="Volatility"
                            name="vol"
                            rules={[
                                {
                                    required: true,
                                    message: thisIsARequiredField,
                                }, {
                                    pattern: regexPositiveNumber,
                                    message: "This is a positive number."
                                }
                            ]}
                        >
                            <InputNumber size={"middle"} style={{width: "100%"}} addonAfter="%"/>
                        </Form.Item>
                        <Form.Item
                            label="Annualized Risk-free Interest Rate (r)"
                            name="r"
                            rules={[
                                {
                                    required: true,
                                    message: thisIsARequiredField,
                                }, {
                                    pattern: regexZeroOrPositiveNumber,
                                    message: "This is a zero or positive number.",
                                }
                            ]}
                        >
                            <InputNumber size={"middle"} style={{width: "100%"}} addonAfter="%"/>
                        </Form.Item>

                        <Form.Item
                            label="Time to Expiration, Expected Holding Period"
                            name="H"
                            rules={[
                                {
                                    required: true,
                                    message: thisIsARequiredField,
                                }, {
                                    pattern: regexPositiveNumber,
                                    message: "This is a positive number."
                                }
                            ]}
                        >
                            <InputNumber size={"middle"} style={{width: "100%"}} addonAfter="Years"/>
                        </Form.Item>
                        <div style={{height: '20px'}}/>

                        <h1>Generic Payoff Schedule - Option Portfolio</h1>
                        <h3 style={{color: '#3498db'}}>{optionArrayToOptionPortfolio(variables.options.map((item) => ({
                            ...item,
                            quantity: parseNumberFromFractionText(item.quantity)
                        }))).text()}</h3>

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
                                                        {value: OPTION_TYPES.CALL_OPTION, label: 'Call Option'},
                                                        {
                                                            value: OPTION_TYPES.BINARY_CALL_OPTION,
                                                            label: 'Binary Call Option'
                                                        }
                                                    ]}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'strike']}
                                                label={key === fields[0].key ? 'Strike Price' : ''}
                                                rules={[{required: true, message: 'Missing Strike Price'},
                                                    {
                                                        validator: (_, value) => {
                                                            return new Promise((resolve, reject) => { // Updated to return a promise
                                                                const optionsInput = fields.map(
                                                                    (field, i) => {
                                                                        if (i === index) {
                                                                            // When the input doesn't meet other validator,
                                                                            // the fields doesn't take the input value
                                                                            return {
                                                                                ...variables.options[field.name],
                                                                                strike: value,
                                                                            };
                                                                        }
                                                                        return variables.options[field.name] || {}
                                                                    }
                                                                );

                                                                // Handled by {required: true, message: 'This is a required field.'}
                                                                if (value === null || value === undefined) {
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

                                                                resolve();
                                                            });
                                                        }
                                                    }]}
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
                                </>
                            )}
                        </Form.List>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size={"large"} style={{width: "100%"}}
                                    icon={visible ? <CaretDownOutlined />:<CaretRightOutlined />}>
                                CALCULATE
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                {visible && <Card>
                    <h1>Valuation</h1>
                    <div style={{height: '20px'}}/>
                    <Row style={{display: "flex", justifyContent: 'center'}}>
                        <Col span={6}>
                            <Statistic
                                title="Generic Valuation"
                                value={result}
                                precision={3}
                                valueStyle={{}}
                            />
                        </Col>
                    </Row>
                </Card>
                }
                <Card>
                    <GenericPayoffInstruction/>
                </Card>
            </Space>

        </>
    );
}