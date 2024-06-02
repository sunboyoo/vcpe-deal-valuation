
import React from "react";
import {Button, Card, Form, InputNumber, Space, Statistic} from "antd";
import {Call_Eur, Call_Eur_RE, Put_Eur} from "../../lib/option";
import {useState} from "react";
import BlackScholesFormula from "../BlackScholesFormula";

const initialValues = {
    S: 100.00,
    r: 5.00,
    sigma:	90.00,
    X: 100,
    T: 5
}
export default function EuropeanCallPutOption(){
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
            <Card title="European Call & Put Option" >
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
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={onValuesChange}
                    autoComplete="on"
                    initialValues = {variables}
                    requiredMark={false}
                    size="small"
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
                        label="Time to Expiration, Expected Holding Period (T)"
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
                        // wrapperCol={{
                        //     offset: 8,
                        //     span: 16,
                        // }}
                    >
                        <Button type="primary" htmlType="submit" size={"middle"} style={{width: "100%"}}>
                            CALCULATE
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {visible &&
                <Card bordered={false}>
                    <Statistic
                        title="European Call Option Value"
                        value={Call_Eur(variables.S, variables.X, variables.T, variables.r / 100.0, variables.sigma / 100.0)}
                        precision={3}
                        prefix="$"
                    />
                    <div style={{height: 20}}/>
                    <Statistic
                        title="European Put Option Value"
                        value={Put_Eur(variables.S, variables.X, variables.T, variables.r / 100.0, variables.sigma / 100.0)}
                        precision={3}
                        prefix="$"
                    />
                    <div style={{height: 20}}/>

                    <Statistic
                        title="Random Expiration European Call Option Value"
                        value={Call_Eur_RE(variables.S, variables.X, variables.T, variables.r / 100.0, variables.sigma / 100.0)}
                        precision={3}
                        prefix="$"
                    />
                </Card>

            }

            {visible &&
                <Card>
                    <BlackScholesFormula/>
                </Card>
            }


        </Space>

        </>
    );
}