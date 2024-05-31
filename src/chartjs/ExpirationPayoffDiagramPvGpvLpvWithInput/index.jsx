import {Form, InputNumber, Space, } from "antd";
import React, {useState} from "react";
import {PvGpvLpv} from "../../lib/partial-valuation/pv-gpv-lpv";
import {LimitedPartnership} from "../../lib/partial-valuation/limited-partnership"
import {ExpirationPayoffDiagramPvGpvLpv} from "../ExpirationPayoffDiagramPvGpvLpv";

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

export default function ExpirationPayoffDiagramPvGpvLpvWithInput({
                                                                     xs,
                                                                     ys,
                                                                     slopes,
                                                                     invDefault,
                                                                     ciDefault = 20.,
                                                                     lfpDefault = 25.
                                                                 }) {
    const [variables, setVariables] = useState({
        inv: invDefault,
        ci: ciDefault,
        lfp: lfpDefault,
    })

    const [visible, setVisible] = useState(invDefault > 0 && ciDefault >= 0 && lfpDefault >= 0);

    const onFinish = (values) => {
        const {inv, ci, lfp,} = values;
        if (inv > 0 && ci >= 0 && lfp >= 0) {
            setVariables({...values})
            setVisible(true)
        }
        console.log('Form.onFinish():', values);
    };
    const onFinishFailed = (errorInfo) => {
        setVisible(false)
        console.log('Form.onFinishFailed():', errorInfo);
    };

    const onValuesChange = (changedValue, values) => {
        const {inv, ci, lfp,} = values;
        if (inv > 0 && ci >= 0 && lfp >= 0) {
            console.log(xs, ys, slopes)
            setVariables({...values})
            setVisible(true)
        } else {
            setVisible(false)
        }

        console.log("Form.onValuesChange()", changedValue, values)
    }

    const regexPositiveNumber = /^(?!0+(\.0+)?$)(0*\.\d*[1-9]\d*|[1-9]\d*(\.\d*)?)$/
    const regexZeroOrPositiveNumber = /^(\d+(\.\d*)?|\.\d+)$/;

    const thisIsARequiredField = "This is a required field."

    // compute PV, GPV, and LPV
    const {inv, ci, lfp,} = variables

    const pvGpvLpv = new PvGpvLpv(new LimitedPartnership(undefined, ci / 100., lfp / 100.), inv, xs, ys, slopes)

    return (
        <>
            {visible && <ExpirationPayoffDiagramPvGpvLpv pvGpvLpv={pvGpvLpv}/>}

            <Space>
            <Form
                size={'small'}
                layout={"horizontal"}
                labelCol={{
                    span: 16,
                }}
                wrapperCol={{
                    span: 24,
                }}
                // style={{maxWidth: '1000px'}}
                labelAlign={"left"}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onValuesChange={onValuesChange}
                autoComplete="on"
                initialValues={variables}
                requiredMark={false}
            >
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
                    <InputNumber min={0} size={"middle"} style={{width: "100%"}} addonAfter="%"/>
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
                    <InputNumber min={0} size={"middle"} style={{width: "100%"}} addonAfter="%"/>
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
                    <InputNumber min={0} size={"middle"} style={{width: "100%"}} addonBefore="$"/>
                </Form.Item>
                {/*<Form.Item*/}
                {/*    // wrapperCol={{*/}
                {/*    //     offset: 8,*/}
                {/*    //     span: 16,*/}
                {/*    // }}*/}
                {/*>*/}
                {/*    <Button type="default" htmlType="submit" size={"middle"} style={{width: "100%"}}>*/}
                {/*        Show Expiration Payoff Diagram*/}
                {/*    </Button>*/}
                {/*</Form.Item>*/}
            </Form>
            </Space>

        </>
    );
}