import {Button, Card,  Form, Input, InputNumber, Select, Space, } from "antd";
import React, {useState} from "react";
import { MinusCircleOutlined,  PlusOutlined} from "@ant-design/icons";
import { SecurityType} from "../../lib/generic-payoff";
import {OptionArrayUtils} from "../../lib/converter/line-option-converter";
import { PvGpvLpv} from "../../lib/partial-valuation/pv-gpv-lpv";
import {LimitedPartnership} from "../../lib/partial-valuation/limited-partnership"

import {ExpirationPayoffDiagramPvGpvLpv} from "../../chartjs/ExpirationPayoffDiagramPvGpvLpv";
import {IntegerStep} from "../../antd/IntegerStep";
import {optionArrayToOptionPortfolio} from "../../lib/converter/option-line-converter";


const optionsInitialValues = [
    {
        securityType: SecurityType.CallOption,
        strike: 0,
        fraction: 1
    }, {
        securityType: SecurityType.CallOption,
        strike: 10,
        fraction: -1
    }, {
        securityType: SecurityType.CallOption,
        strike: 16,
        fraction: 1 / 4
    }, {
        securityType: SecurityType.CallOption,
        strike: 36,
        fraction: -1 / 20
    },
    {
        securityType: SecurityType.BinaryCallOption,
        strike: 130,
        fraction: 1.2
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
            throw new Error('Invalid fraction');
        }
    } else if (!isNaN(parseFloat(value))) {
        return parseFloat(value);
    } else {
        throw new Error('Invalid number');
    }
};

export default function GenericExpirationPayoffDiagramPvGpvLpv() {
    const [options, setOptions] = useState([...optionsInitialValues])
    const [visible, setVisible] = useState(false)
    const [variables, setVariables] = useState({
        inv: 5.,
        ci: 20.,
        lfp: 25.,
    })

    /*
    * Options
    * */

    const onFinishOptions = (values) => {
        OptionArrayUtils.validate(values.options);

        setOptions(values.options.map((item) => ({...item, fraction: parseNumberFromFractionText(item.fraction)})))
        setVisible(true)
        console.log('Form.onFinish():', values);
    };

    const onFinishFailedOptions = (errorInfo) => {
        setVisible(false)
        console.log('Form.onFinishFailed():', errorInfo);
    };

    const onValuesChangeOptions = (valuesChanged, values) => {
        setVisible(false)
        console.log("Form.onValuesChange()", values)
        try{
            onFinishOptions(values)
        } catch (e) {
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
            setVisible(true)
        }
        console.log('Form.onFinish():', values);
    };
    const onFinishFailedPvGpvLpv = (errorInfo) => {
        setVisible(false)
        console.log('Form.onFinishFailed():', errorInfo);
    };

    const onValuesChangePvGpvLpv = (changedValue, values) => {
        const {inv, ci, lfp,} = values;
        if (inv > 0 && ci >= 0 && lfp >= 0) {
            setVariables({...values})
            setVisible(true)
        } else {
            setVisible(false)
        }

        console.log("Form.onValuesChange()", changedValue, values)
    }


    // compute PV, GPV, and LPV
    const {inv, ci, lfp,} = variables
    const pvGpvLpv = PvGpvLpv.ofPayoffOptions(new LimitedPartnership(undefined, ci/100., lfp/100.), inv, options)
    return (
        <>
            <Space direction="vertical">
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
                    </Form>
                </Card>
            </Space>
            <div style={{height: '10px'}}></div>

            {options && options.length > 0 &&
                <Card>
                    <ExpirationPayoffDiagramPvGpvLpv pvGpvLpv={pvGpvLpv}/>
                </Card>
            }
            <div style={{height: '10px'}}/>
            <Space direction="vertical">
                <Card>
                    <Form
                        name="basic"
                        layout={"vertical"}
                        labelCol={{
                            span: 16,
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
                        <h1>Partial Valuation (PV) - Payoff Schedule</h1>
                        <h3 style={{color: '#3498db'}}>{optionArrayToOptionPortfolio(options).text()}</h3>

                        <Form.List name="options">
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.map(({key, name, ...restField}, index) => (
                                        <Space
                                            key={key}
                                            style={{display: 'flex', marginBottom: 0}}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'securityType']}
                                                label={key === fields[0].key ? 'Call Option Type' : ''}
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
                                                name={[name, 'fraction']}
                                                label={key === fields[0].key ? 'Fraction' : ''}
                                                rules={[
                                                    {required: true, message: 'Missing Fraction'},
                                                    {
                                                        validator: (_, value) => {
                                                            try {
                                                                parseNumberFromFractionText(value);
                                                                return Promise.resolve();
                                                            } catch (error) {
                                                                return Promise.reject(new Error('Invalid fraction or number'));
                                                            }
                                                        }
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    placeholder="-1/2"
                                                    style={{width: '100%'}}/>
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
                                                                    (field) => options[field.name] || {}
                                                                );

                                                                if (index > 0) {
                                                                    for (let j = 0; j < index; j++) {
                                                                        if (value <= optionsInput[j].strike) {
                                                                            reject(new Error("Strike prices must be in ascending order"));
                                                                        }
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
                    </Form>
                </Card>
            </Space>
            <div style={{height: '10px'}}/>

            <Space direction="vertical">
                {visible &&
                    <Card bordered={false} title={"APPRECIATION"}>
                        <p>Our appreciation goes to Professor Klaas P. Baks of Emory University's Goizueta Business
                            School, as this tool was developed based on his Deal Valuation worksheet and inspired by his
                            course "Venture Capital and Private Equity." Dr. Baks is an esteemed professor in the
                            Practice of Finance and the Executive Director and Co-Founder of the Emory Center for
                            Alternative Investments, specializing in alternative investments, entrepreneurial finance,
                            and investment management. He is an award-winning educator with numerous publications,
                            recognized for his engaging and dynamic speaking style.</p>
                    </Card>
                }
            </Space>
        </>
    );
}