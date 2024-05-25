import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
const onFinish = (values) => {
    console.log('Received values of form:', values);
};
const App = () => (
    <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{
            maxWidth: 600,
        }}
        autoComplete="off"
        layout={'vertical'}
    >
        <Form.List name="users">
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
                                name={[name, 'securityType']}
                                label='Security Type'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing first name',
                                    },
                                ]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'fraction']}
                                label={'Fraction'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing last name',
                                    },
                                ]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'strickPrice']}
                                label={'Strike Price'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing last name',
                                    },
                                ]}
                            >
                                <Input placeholder="Last Name" />
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
);
export default App;