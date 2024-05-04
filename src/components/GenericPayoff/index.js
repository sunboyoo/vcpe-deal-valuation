import {Button, Card, Divider, Form, InputNumber, Space, Table, Tag} from "antd";
import {useState} from "react";
import {DashOutlined} from "@ant-design/icons";
import { postTransactionValuation, SecurityType} from "../../lib/generic-payoff";

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
const initialValues = {
    inv: 12,
    tv: 50,
    vol: 90,
    r: 5,
    H: 4,
    lfp: 25
}

const options = [
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
        fraction: 1/4
    }, {
        securityType: SecurityType.CallOption,
        strike: 36,
        fraction: -1/20
    }, {
        securityType: SecurityType.BinaryCallOption,
        strike: 130,
        fraction: 1.2
    }
]

export default function GenericPayoff(){
    const [variables, setVariables] = useState({...initialValues})
    const [result, setResult] = useState(undefined)
    const [visible, setVisible] = useState(false)

    const onFinish = (values) => {
        const {tv, H, r, vol, lfp, inv} = values
        const lpOptions = options
        setVariables({...values})
        setResult( postTransactionValuation(lpOptions, tv, H, r/100., vol/100., lfp/100., inv))
        setVisible(true)
        console.log('Form.onFinish():', values);
        console.log(postTransactionValuation(lpOptions, tv, H, r/100., vol/100., lfp/100., inv))
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
                    {value.child? <><DashOutlined/><DashOutlined/></> : <></>}
                        {
                            value.tags &&
                            value.tags.map((tag) =>
                                <Tag color="blue" key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>)
                        }
                        <span>{value.name}</span>
                </span>)}
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

    return  (
        <>
        <Space direction="vertical" >
            <Card title="Generic Payoff" >
                <Form
                    name="basic"
                    layout={"horizontal"}
                    labelCol={{
                        span: 16,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    labelAlign={"left"}
                    // style={{
                    //     // maxWidth: 600,
                    // }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={onValuesChange}
                    autoComplete="on"
                    initialValues = {variables}
                    requiredMark={false}

                >
                    <Form.Item
                        label="Investment in This Round"
                        name="inv"
                        rules={[
                            {
                                required: true,
                                message: thisIsARequiredField,
                            },{
                                pattern: regexPositiveNumber,
                                message: "This is a positive number."
                            }
                        ]}
                    >
                        <InputNumber  size={"middle"} style={{width: "100%"}} addonBefore="$"/>
                    </Form.Item>
                    <Form.Item
                        label="Total Valuation"
                        name="tv"
                        rules={[
                            {
                                required: true,
                                message: thisIsARequiredField,
                            },{
                                pattern: regexPositiveNumber,
                                message: "This is a positive number."
                            }
                        ]}
                    >
                        <InputNumber  size={"middle"} style={{width: "100%"}} addonBefore="$"/>
                    </Form.Item>
                    <Form.Item
                        label="Volatility"
                        name="vol"
                        rules={[
                            {
                                required: true,
                                message: thisIsARequiredField,
                            },{
                                pattern: regexPositiveNumber,
                                message: "This is a positive number."
                            }
                        ]}
                    >
                        <InputNumber  size={"middle"} style={{width: "100%"}} addonAfter="%"/>
                    </Form.Item>
                    <Form.Item
                        label="Annualized Risk-free Interest Rate (r)"
                        name="r"
                        rules={[
                            {
                                required: true,
                                message: thisIsARequiredField,
                            },{
                                pattern: regexZeroOrPositiveNumber,
                                message: "This is a zero or positive number.",
                            }
                        ]}
                    >
                        <InputNumber  size={"middle"} style={{width: "100%"}} addonAfter="%"/>
                    </Form.Item>

                    <Form.Item
                        label="Time to Expiration, Expected Holding Period"
                        name="H"
                        rules={[
                            {
                                required: true,
                                message: thisIsARequiredField,
                            },{
                                pattern: regexPositiveNumber,
                                message: "This is a positive number."
                            }
                        ]}
                    >
                        <InputNumber  size={"middle"} style={{width: "100%"}} addonAfter="Years"/>
                    </Form.Item>
                    <Form.Item
                        label="Lifetime Fee Percentage"
                        name="lfp"
                        rules={[
                            {
                                required: true,
                                message: thisIsARequiredField,
                            },{
                                pattern: regexZeroOrPositiveNumber,
                                message: "This is a zero or positive number.",
                            }
                        ]}
                    >
                        <InputNumber  size={"middle"} style={{width: "100%"}} addonAfter="%"/>
                    </Form.Item>

                    <Form.Item
                        // wrapperCol={{
                        //     offset: 8,
                        //     span: 16,
                        // }}
                    >
                        <Button type="default" htmlType="submit" size={"middle"} style={{width: "100%"}}>
                            CALCULATE
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {visible &&
            <Card bordered={false} title={"Valuation"}>
                <Table columns={columns} dataSource={data0} size="small" pagination={false}/>
            </Card>
            }            {visible &&
            <Card bordered={false} title={"Post-Transaction Valuation"}>
                <Table columns={columns} dataSource={data1} size="small" pagination={false}/>
                <Divider/>
                <Table columns={columns} dataSource={data2} size="small" pagination={false}/>
            </Card>}
            <Space><p/></Space>
        </Space>
    <Space direction="vertical">
        {visible &&
            <Card bordered={false} title={"APPRECIATION"} >
                <p>Our appreciation goes to Professor Klaas P. Baks of Emory University's Goizueta Business School, as this tool was developed based on his Deal Valuation worksheet and inspired by his course "Venture Capital and Private Equity." Dr. Baks is an esteemed professor in the Practice of Finance and the Executive Director and Co-Founder of the Emory Center for Alternative Investments, specializing in alternative investments, entrepreneurial finance, and investment management. He is an award-winning educator with numerous publications, recognized for his engaging and dynamic speaking style.</p>
            </Card>
        }
    </Space>
</>
    );
}