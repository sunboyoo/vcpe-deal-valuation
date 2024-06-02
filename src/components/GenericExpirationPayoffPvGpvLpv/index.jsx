import {Button, Card, Col, Form, Input, InputNumber, Row, Select, Space,} from "antd";
import React, {useState} from "react";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {PvGpvLpv} from "../../lib/partial-valuation/pv-gpv-lpv";
import {LimitedPartnership} from "../../lib/partial-valuation/limited-partnership"

import {ExpirationPayoffDiagramPvGpvLpv} from "../../chartjs/ExpirationPayoffDiagramPvGpvLpv";
import {IntegerStep} from "../../antd/IntegerStep";
import {optionArrayToOptionPortfolio} from "../../lib/converter/option-line-converter";
import {OPTION_TYPES} from "../../lib/option/option";


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
        quantity: 1 / 4
    }, {
        securityType: OPTION_TYPES.CALL_OPTION,
        strike: 36,
        quantity: -1 / 20
    },
    {
        securityType: OPTION_TYPES.BINARY_CALL_OPTION,
        strike: 130,
        quantity: 1.2
    }
]

const regexPositiveNumber = /^(?!0+(\.0+)?$)(0*\.\d*[1-9]\d*|[1-9]\d*(\.\d*)?)$/
const regexZeroOrPositiveNumber = /^(\d+(\.\d*)?|\.\d+)$/;

const thisIsARequiredField = "This is a required field."

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

export default function App() {
    const [options, setOptions] = useState([...optionsInitialValues])
    const [variables, setVariables] = useState({
        inv: 5.,
        ci: 20.,
        lfp: 25.,
    })
    const [optionsInputError, setOptionsInputError] = useState(null);

    /*
    * Options
    * */

    const onFinishOptions = (values) => {
        setOptions(values.options.map((item) => ({...item, quantity: parseNumberFromFractionText(item.quantity)})))
        setOptionsInputError(null)
        console.log('Form.onFinish():', values);
    };

    const onFinishFailedOptions = (errorInfo) => {
        console.log('Form.onFinishFailed():', errorInfo);
    };

    const onValuesChangeOptions = (valuesChanged, values) => {
        setOptionsInputError(null)

        console.log("Form.onValuesChange()", values)
        try {
            const optionsInput = values.options.map((item) => ({...item, quantity: parseNumberFromFractionText(item.quantity)}))
            // Try to validate the input data
            optionArrayToOptionPortfolio(optionsInput);
            // If no error, pass to onFinish()
            onFinishOptions(values)
        } catch (e) {
            setOptionsInputError(e.message)

            onFinishFailedOptions(e)
        }
    }

    /*
    * PvGpvLpv
    * */

    const onFinishPvGpvLpv = (values) => {
        const {inv, ci, lfp,} = values;
        if (inv > 0 && ci >= 0 && lfp >= 0) {
            setVariables({...values})
        }
        console.log('Form.onFinish():', values);
    };
    const onFinishFailedPvGpvLpv = (errorInfo) => {
        console.log('Form.onFinishFailed():', errorInfo);
    };

    const onValuesChangePvGpvLpv = (changedValue, values) => {
        const {inv, ci, lfp,} = values;
        if (inv > 0 && ci >= 0 && lfp >= 0) {
            setVariables({...values})
        } else {
        }

        console.log("Form.onValuesChange()", changedValue, values)
    }


    // compute PV, GPV, and LPV
    const {inv, ci, lfp,} = variables
    const pvGpvLpv = PvGpvLpv.ofPayoffOptions(new LimitedPartnership(undefined, ci / 100., lfp / 100.), inv, options)
    return (
        <>
            <Space direction={'vertical'}>
            <h1 style={{color: '#595959'}}>Diagram of PV, GPV, and LPV</h1>
            <p style={{color: '#595959'}}>Input the PV option portfolio, LP's investment, GP's carried interest, and lifetime fee percentage to generate the payoff diagrams of PV, GPV and LPV</p>
            {options && options.length > 0 &&
                <Card>
                    <ExpirationPayoffDiagramPvGpvLpv pvGpvLpv={pvGpvLpv}/>
                </Card>
            }
            <Card>
                <Form
                    size={'small'}
                    layout={"horizontal"}
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    labelAlign={"left"}
                    onFinish={onFinishPvGpvLpv}
                    onFinishFailed={onFinishFailedPvGpvLpv}
                    onValuesChange={onValuesChangePvGpvLpv}
                    autoComplete="on"
                    initialValues={variables}
                    requiredMark={false}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Investment in This Round"
                                name="inv"
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
                                <IntegerStep
                                    min={0}
                                    max={100}
                                    addonBefore={'$'}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="GP Carried Interest"
                                name="ci"
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
                                <IntegerStep
                                    min={0}
                                    max={100}
                                    addonAfter={'%'}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Lifetime Fee Percentage"
                                name="lfp"
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
                                <IntegerStep
                                    min={0}
                                    max={100}
                                    addonAfter={'%'}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
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
                    onFinish={onFinishOptions}
                    onFinishFailed={onFinishFailedOptions}
                    onValuesChange={onValuesChangeOptions}
                    autoComplete="on"
                    initialValues={{options}}
                    requiredMark={false}
                >
                    <h1 style={{color: '#595959'}}>Payoff Schedule - Option Portfolio</h1>
                    <h2 style={{color: '#595959'}}>Partial Valuation (PV)</h2>
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
                                            label={key === fields[0].key ? 'Option Strike Price' : ''}
                                            rules={[{required: true, message: 'This is a required field.'},
                                                {
                                                    validator: (_, value) => {
                                                        return new Promise((resolve, reject) => { // Updated to return a promise
                                                            const optionsInput = fields.map(
                                                                (field, i) => {
                                                                    if (i === index) {
                                                                        // When the input doesn't meet other validator,
                                                                        // the fields doesn't take the input value
                                                                        return {...options[field.name], strike: value};
                                                                    }
                                                                    return options[field.name] || {}
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
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined/>}>
                                        Add a new line
                                    </Button>
                                </Form.Item>
                                <p style={{color: '#fa8c16'}}>{optionsInputError}</p>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Card>
            </Space>
        </>
    );
}