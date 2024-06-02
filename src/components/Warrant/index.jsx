import {Button, Card, Form, InputNumber, Space, Statistic} from "antd";
import {Warrant as warrant} from "../../lib/warrant";
import React, {useState} from "react";
import BlackScholesFormula from "../BlackScholesFormula";
import {CaretDownOutlined, CaretRightOutlined} from "@ant-design/icons";

const initialValues = {
    S: 100.00,
    r: 5.00,
    sigma:	90.00,
    X: 100,
    T: 6,
    n: 1,
    m: 0.1,
    y: 1
}
export default function Warrant(){
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

    return  (
        <>
        <Space direction="vertical">
            <Card title="Warrant">
                <Form
                    name="basic"
                    layout={"horizontal"}
                    labelAlign={"left"}
                    labelCol={{
                        span: 16,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
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
                        label="Stock Price (S)"
                        name="S"
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
                        label="Strike Price (X)"
                        name="X"
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
                        label="Volatility (sigma)"
                        name="sigma"
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
                        label="Time to Expiration (T)"
                        name="T"
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
                        label="Outstanding Shares (n)"
                        name="n"
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
                        label="Warrants Issued (m)"
                        name="m"
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
                        label="Conversion Ratio (y)"
                        name="y"
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
                        // wrapperCol={{
                        //     offset: 8,
                        //     span: 16,
                        // }}
                    >
                        <Button type="primary" htmlType="submit" size={"large"} style={{width: "100%"}}
                                icon={visible ? <CaretDownOutlined />:<CaretRightOutlined />}>
                            CALCULATE
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {visible &&
            <Card bordered={false}>
                <Statistic
                    title="Warrant Value"
                    value={warrant(variables.S, variables.X, variables.T, variables.r/100.0, variables.sigma/100.0,
                    variables.m, variables.n, variables.y)}
                    precision={3}
                    prefix="$"
                />
            </Card>
            }
        </Space>
</>
    );
}