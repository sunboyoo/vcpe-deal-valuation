import {Button, Card, Divider, Form, InputNumber, Space,} from "antd";
import React, {useState} from "react";
import {seriesA_CS} from "../../lib/series-a-cs";
import {CaretDownOutlined, CaretRightOutlined,} from "@ant-design/icons";
import {PvGpvLpv} from "../../lib/partial-valuation/pv-gpv-lpv";
import {LimitedPartnership} from "../../lib/partial-valuation/limited-partnership"

import {ExpirationPayoffDiagramPvGpvLpv} from "../../chartjs/ExpirationPayoffDiagramPvGpvLpv";
import InvestmentDecisionResult from "../InvestmentDecisionResult";
import TransactionValuationResult from "../TransactionValuationResult";
import ValuationResult from "../ValuationResult";

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
    inv: 4,
    tv: 18,
    vol: 90,
    r: 5,
    H: 6,
    ci: 20,
    lfp: 25,
    debt: 0
}
export default function SeriesACs() {
    const [variables, setVariables] = useState({...initialValues})
    const [result, setResult] = useState(undefined)
    const [visible, setVisible] = useState(false)

    const onFinish = (values) => {
        const {so, sp, inv, tv, vol, r, H, ci, lfp, debt} = values
        setVariables({...values})
        setResult(seriesA_CS(so, sp, inv, tv, vol / 100., r / 100., H, ci / 100., lfp / 100, debt))
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

    // compute PV, GPV, and LPV
    const {so, sp, inv, ci, lfp} = variables
    const xs = [0]
    // ys = [0, 10, 30, 10]
    const ys = [0]
    const slopes = [sp / (so + sp)]
    const pvGpvLpv = new PvGpvLpv(new LimitedPartnership(undefined, ci / 100., lfp / 100.), inv, xs, ys, slopes)

    return (
        <>
            <Space direction="vertical">
                <Card title="Series A Common Stock">
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
                        initialValues={variables}
                        requiredMark={false}
                    >
                        <Form.Item
                            label="Pre-money Common Stock Shares Outstanding"
                            name="so"
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
                            <InputNumber size={"middle"} style={{width: "100%"}}/>
                        </Form.Item>
                        <Form.Item
                            label="New Common Stock Shares Purchased"
                            name="sp"
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
                            <InputNumber size={"middle"} style={{width: "100%"}}/>
                        </Form.Item>
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
                            <InputNumber size={"middle"} style={{width: "100%"}} addonAfter="%"/>
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
                        <Form.Item
                            label="Debt"
                            name="debt"
                            rules={[
                                {
                                    required: true,
                                    message: thisIsARequiredField,
                                }, {
                                    pattern: regexZeroOrPositiveNumber,
                                    message: "This is zero or a positive number."
                                }
                            ]}
                        >
                            <InputNumber size={"middle"} style={{width: "100%"}} addonBefore="$"/>
                        </Form.Item>
                        <Form.Item
                            // wrapperCol={{
                            //     offset: 8,
                            //     span: 16,
                            // }}
                        >
                            <Button type="primary" htmlType="submit" size={"large"} style={{width: "100%"}}
                                    icon={visible ? <CaretDownOutlined/> : <CaretRightOutlined/>}>
                                CALCULATE
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
            <Divider style={{borderColor: 'transparent'}}/>
            <Space direction={'vertical'}>
                {visible && <ValuationResult
                    pv={result.PV}
                    lpv={result.LPV}
                    gpv={result.GPCV}
                    lpc={result.LPC}
                />}
                {visible && <TransactionValuationResult
                    postTxV={result.transactionValuation.postTransactionValuation}
                    preTxV={result.transactionValuation.preTransactionValuation}
                    postTxPv={result.transactionValuation.postTransactionPV}
                    postTxGPCV={result.transactionValuation.postTransactionGPCV}
                    postTxLPV={result.transactionValuation.postTransactionLPV}

                />}
                {visible && <InvestmentDecisionResult
                    lpv={result.LPV}
                    lpc={result.LPC}
                    firmValue={variables.tv}
                    postTxFirmValue={result.transactionValuation.postTransactionValuation}
                />}

                <Space><p/></Space>


                {visible && <Card>
                    <ExpirationPayoffDiagramPvGpvLpv pvGpvLpv={pvGpvLpv} result={result} showIndividualDiagrams={true}/>
                </Card>}
                {visible &&
                    <Card bordered={false} title={"Expiration Payoff Diagram"} style={{}}>
                        <p>The expiration payoff diagrams provided do not account for dividends. To accurately represent
                            the potential payoff at expiration, any dividends should be considered.</p>
                        <p>The diagrams may not display correctly on smartphones. For optimal viewing, it is recommended
                            to use a desktop, laptop, or iPad.</p>
                    </Card>
                }

            </Space>
        </>
    );
}