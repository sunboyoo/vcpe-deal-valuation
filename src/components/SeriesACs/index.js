import {Button, Card, Divider, Form, InputNumber, Space, Table, Tag} from "antd";
import {useState} from "react";
import {seriesA_CS} from "../../lib/series-a-cs";
import {DashOutlined} from "@ant-design/icons";
import {LimitedPartnership, PvGpvLpv} from "../../lib/line/pv-gpv-lpv";
import {ExpirationPayoffDiagramPvGpvLpv} from "../../chartjs/ExpirationPayoffDiagramPvGpvLpv";

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
    so: 11,
    sp: 5,
    inv:	4,
    tv: 18,
    vol: 90,
    r: 5,
    H: 6,
    ci: 20,
    lfp: 25,
    debt: 0
}
export default function SeriesACs(){
    const [variables, setVariables] = useState({...initialValues})
    const [result, setResult] = useState(undefined)
    const [visible, setVisible] = useState(false)

    const onFinish = (values) => {
        const {so, sp, inv, tv, vol, r, H, ci, lfp, debt} = values
        setVariables({...values})
        setResult(seriesA_CS(so, sp, inv, tv, vol/100., r/100., H, ci/100., lfp/100, debt))
        setVisible(true)
        console.log('Form.onFinish():', values);
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
            name: 'PV',
            value: result.PV.toFixed(3),
            child: false
        }, {
            key: '2',
            name: 'GPV',
            value: result.GPCV.toFixed(3),
            child: true
        }, {
            key: '3',
            name: 'LPV',
            value: result.LPV.toFixed(3),
            child: true
        },{
            key: '4',
            name: 'LPC',
            value: result.LPC.toFixed(3),
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
            name: 'Pre-Tx V',
            value: result.transactionValuation.preTransactionValuation.toFixed(3),
            tags: ['Pre-Transaction Valuation'],
            child: true
        }, {
            key: '3',
            name: 'PV',
            value: result.transactionValuation.postTransactionPV.toFixed(3),
            tags: ['Post-Transaction Valuation'],
            child: true
        },
    ] : [];


    const data2 = result ? [
        {
            key: '3',
            name: 'PV',
            value: result.transactionValuation.postTransactionPV.toFixed(3),
            tags: ['Post-Transaction Valuation'],
            child: false
        }, {
            key: '4',
            name: 'GPV',
            value: result.transactionValuation.postTransactionGPCV.toFixed(3),
            tags: ['Post-Transaction Valuation'],
            child: true
        }, {
            key: '5',
            name: 'LPV',
            value: result.transactionValuation.postTransactionLPV.toFixed(3),
            tags: ['Post-Transaction Valuation'],
            child: true
        },
    ] : [];

    // compute PV, GPV, and LPV
    const {so, sp, inv, ci, lfp} = variables
    const xs = [0]
    // ys = [0, 10, 30, 10]
    const ys = [0]
    const slopes = [sp/(so+sp)]
    const pvGpvLpv = new PvGpvLpv(new LimitedPartnership(undefined, ci/100., lfp/100.), inv, xs, ys, slopes)

    return  (
        <>
        <Space direction="vertical" >
            <Card title="Series A Common Stock" >
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
                        label="Pre-money Common Stock Shares Outstanding"
                        name="so"
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
                        <InputNumber  size={"middle"} style={{width: "100%"}}/>
                    </Form.Item>
                    <Form.Item
                        label="New Common Stock Shares Purchased"
                        name="sp"
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
                        <InputNumber  size={"middle"} style={{width: "100%"}}/>
                    </Form.Item>
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
                        label="GP Carried Interest"
                        name="ci"
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
                        label="Debt"
                        name="debt"
                        rules={[
                            {
                                required: true,
                                message: thisIsARequiredField,
                            },{
                                pattern: regexZeroOrPositiveNumber,
                                message: "This is zero or a positive number."
                            }
                        ]}
                    >
                        <InputNumber  size={"middle"} style={{width: "100%"}} addonBefore="$"/>
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
            }
            {visible &&
            <Card bordered={false} title={"Post-Transaction Valuation"}>
                <Table columns={columns} dataSource={data1} size="small" pagination={false}/>
                <Divider/>
                <Table columns={columns} dataSource={data2} size="small" pagination={false}/>
            </Card>}

            <Space><p/></Space>
        </Space>

    <Space direction="vertical">
        {visible && <ExpirationPayoffDiagramPvGpvLpv pvGpvLpv={pvGpvLpv} result={result}/>}
        {visible &&
            <Card bordered={false} title={"Expiration Payoff Diagram"} >
                <p>Please note that the following expiration payoff diagrams assume that there are no dividends. If there are dividends, they should be taken into consideration in order to get an accurate representation of the potential payoff at expiration.</p>
                <p>The diagrams may occasionally have display issues when viewed vertically on mobile devices. If you experience this problem, please rotate your phone to a horizontal orientation and refresh the webpage.</p>
            </Card>
        }
        {visible &&
            <Card bordered={false} title={"APPRECIATION"} >
                <p>Our appreciation goes to Professor Klaas P. Baks of Emory University's Goizueta Business School, as this tool was developed based on his Deal Valuation worksheet and inspired by his course "Venture Capital and Private Equity." Dr. Baks is an esteemed professor in the Practice of Finance and the Executive Director and Co-Founder of the Emory Center for Alternative Investments, specializing in alternative investments, entrepreneurial finance, and investment management. He is an award-winning educator with numerous publications, recognized for his engaging and dynamic speaking style.</p>
            </Card>
        }
    </Space>
</>
    );
}