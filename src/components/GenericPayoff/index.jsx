import {Button, Card, Divider, Form, Input, InputNumber, Select, Space, Table, Tag} from "antd";
import React, {useState} from "react";
import {DashOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {postTransactionValuation, SecurityType} from "../../lib/generic-payoff";
import GenericPayoffInstruction from "./desc";
import {optionArrayToOptionPortfolio} from "../../lib/converter/option-line-converter";


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
    }, {
        securityType: SecurityType.BinaryCallOption,
        strike: 130,
        quantity: 1.2
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
        const {tv, H, r, vol, lfp, inv, options} = values
        const lpOptions = options.map((item, index) => ({...item, quantity: parseNumberFromFractionText(item.quantity)}))
        setVariables({...values})
        setResult(postTransactionValuation(lpOptions, tv, H, r / 100., vol / 100., lfp / 100., inv))
        setVisible(true)
        console.log('Form.onFinish():', values);
        console.log(postTransactionValuation(lpOptions, tv, H, r / 100., vol / 100., lfp / 100., inv))
    };
    const onFinishFailed = (errorInfo) => {
        setVisible(false)
        console.log('Form.onFinishFailed():', errorInfo);
    };

    const onValuesChange = () => {
        setVisible(false)
        console.log("Form.onValuesChange()")
    }

    const regexPositiveNumber = /^(?!0+(\.0+)?$)(0+\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?)$/
    const regexZeroOrPositiveNumber = /^(\d+(\.\d*)?|\.\d+)$/;

    const thisIsARequiredField = "This is a required field."


    const columns = [
        {
            title: '',
            dataIndex: 'name',
            render: (_, value) => {
                return (
                    <span>
                    {value.child ? <><DashOutlined/><DashOutlined/></> : <></>}
                        {
                            value.tags &&
                            value.tags.map((tag) =>
                                <Tag color="blue" key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>)
                        }
                        <span>{value.name}</span>
                </span>)
            }
        },
        {
            title: '',
            dataIndex: 'value',
            align: "right"
        }
    ];

    const data0 = result ? [
        {
            key: '1',
            name: 'LPV',
            value: result.LPV.toFixed(3),
            child: false
        },
    ] : [];

    const data1 = result ? [
        {
            key: '1',
            name: 'Post-Tx V',
            value: result.transactionValuation.postTransactionValuation.toFixed(3),
            tags: ['Post-Transaction Valuation'],
            child: false
        }, {
            key: '2',
            name: 'LPV',
            value: result.transactionValuation.postTransactionLPV.toFixed(3),
            tags: ['Post-Transaction Valuation'],
            child: true
        }
    ] : [];


    const data2 = result ? [{
        key: '5',
        name: 'LPV',
        value: result.transactionValuation.postTransactionLPV.toFixed(3),
        tags: ['Post-Transaction Valuation'],
        child: true
    },
    ] : [];

    return (
        <>
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
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onValuesChange={onValuesChange}
                        autoComplete="on"
                        initialValues={variables}
                        requiredMark={false}

                    >
                        <h1>Inputs</h1>
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
                            <InputNumber size={"middle"} style={{width: "100%"}} addonBefore="$"/>
                        </Form.Item>
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
                            <InputNumber size={"middle"} style={{width: "100%"}} addonAfter="%"/>
                        </Form.Item>

                        <h1>Payoff Schedule</h1>
                        <h3 style={{color: '#3498db'}}>{optionArrayToOptionPortfolio(variables.options).text()}</h3>

                        <Form.List name="options">
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.map(({key, name, ...restField}) => (
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
                                                name={[name, 'quantity']}
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
                                                rules={[{required: true, message: 'Missing Strike Price'}]}
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
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Calculate
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                {/*<Card>*/}
                {/*    <PayoffSchedule onFinish={(options) => {*/}
                {/*        console.log('received values', options)*/}
                {/*    }}/>*/}
                {/*</Card>*/}

                {visible &&
                    <Card bordered={false} title={"Valuation"}>
                        <Table columns={columns} dataSource={data0} size="small" pagination={false}/>
                    </Card>
                } {visible &&
                <Card bordered={false} title={"Post-Transaction Valuation"}>
                    <Table columns={columns} dataSource={data1} size="small" pagination={false}/>
                    <Divider/>
                    <Table columns={columns} dataSource={data2} size="small" pagination={false}/>
                </Card>}
            </Space>
            <div style={{height: '100px'}}></div>

            <Space>
                <GenericPayoffInstruction/>
            </Space>

            <div style={{height: '100px'}}></div>

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