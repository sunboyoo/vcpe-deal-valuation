import {Button, Card, Divider, Form, InputNumber, Space, Table, Tag} from "antd";
import React, {useState} from "react";
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
    inv:	4,
    ci: 20,
    lfp: 25,
}
export default function ExpirationPayoffDiagramPvGpvLpvWithInput({xs, ys, slopes}){
    const [variables, setVariables] = useState({...initialValues})
    const [visible, setVisible] = useState(false)

    const onFinish = (values) => {
        setVariables({...values})
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
    const { inv, ci, lfp} = variables

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

                <Space><p/></Space>
            </Space>

            {visible && <ExpirationPayoffDiagramPvGpvLpv pvGpvLpv={pvGpvLpv}/>}

        </>
    );
}