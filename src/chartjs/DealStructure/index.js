import React, {useState} from "react";
import ExpirationPayoffDiagram from "../ExpirationPayoffDiagram";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {Button, Card, Col, Form, InputNumber, Row, Space, message} from "antd";
import {testKinkSlopesToLinearFunction} from "../../lib/kink-slope-option-function";
export default function DealStructure(){

    const [LPC, setLPC] = useState(0)
    const [diagramVisible, setDiagramVisible] = useState(false)
    const [kinkSlopesPV, setKinkSlopesPV] = useState([])
    const [kinkSlopesGPCV, setKinkSlopesGPCV] = useState([])
    const [messageApi, contextHolder] = message.useMessage()

    // const kinkSlopesPV = [{x:0, slope:1}, {x:5, slope:0}, {x:20, slope:1/4}]
    // const kinkSlopesGPCV = [{x:0, slope:0}, {x:80/3, slope:1/20}]

    testKinkSlopesToLinearFunction()

    const onFinishKinkSlopesPV = (values) => {
        setKinkSlopesPV(values.kinkSlopes)
        messageApi.success("Success").then(r => null)
    };

    const onFinishKinkSlopeGPCV = (values) => {
        setKinkSlopesGPCV(values.kinkSlopes)
        messageApi.success("Success").then(r => null)
    };

    const onFinishLPC = (values) => {
        setLPC(values.LPC)
        console.log(values.LPC)
        messageApi.success("Success").then(r => null)
    };

    return(
        <>
            {contextHolder}
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Partial Valuation" bordered={false}>
                        <Form
                            name="dynamic_form_nest_item"
                            onFinish={onFinishKinkSlopesPV}
                            style={{
                                maxWidth: 600,
                            }}
                            autoComplete="off"
                        >
                            <Form.List name="kinkSlopes">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'x']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Missing firm value',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber placeholder="Firm Value" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'slope']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Missing fraction',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber placeholder="Fraction" />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add field
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="GP Carry Valuation" bordered={false}>
                        <Form
                            name="dynamic_form_nest_item"
                            onFinish={onFinishKinkSlopeGPCV}
                            style={{
                                maxWidth: 600,
                            }}
                            autoComplete="off"
                        >
                            <Form.List name="kinkSlopes">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'x']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Missing firm value',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber placeholder="Firm Value" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'slope']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Missing fraction',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber placeholder="Fraction" />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add field
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="LP Cost" bordered={false}>
                        <Form
                            name="dynamic_form_nest_item"
                            onFinish={onFinishLPC}
                            style={{
                                maxWidth: 600,
                            }}
                            autoComplete="off"
                        >
                                <Form.Item
                                    name='LPC'
                                >
                                    <InputNumber placeholder="LP Cost" />
                                </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Button
                type="primary"
                size="large"
                onClick={() => {setDiagramVisible(!diagramVisible)}}>
                {diagramVisible?"Refresh Data":"Show Diagram"}
            </Button>
            <div style={{width:"1280px", height:"640px"}}>
                {diagramVisible && kinkSlopesPV.length>0 && kinkSlopesGPCV.length>0 &&
                <ExpirationPayoffDiagram
                    kinkSlopesPV = {kinkSlopesPV}
                    kinkSlopesGPCV = {kinkSlopesGPCV}
                    LPC = {LPC}
                ></ExpirationPayoffDiagram>
                }
            </div>
            </Space>
        </>
    )
}