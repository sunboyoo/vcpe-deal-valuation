import React from "react";
import {
    Card,
    Descriptions,
    Drawer,
    Empty,
    List,
    Modal,
    Result,
    Tag,
    Tooltip,
    message, Button,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ProFormText, ProFormDigit, StepsForm } from '@ant-design/pro-components';

import { useState } from 'react';
import {SECURITY_TYPE_TAGS} from "../../lib/constants";

export default function ({initialValue, onChange}) {
    const [messageApi] = message.useMessage();

    const [createModalDrawerStepsFormOpen, setCreateModalDrawerStepsFormOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteModalDrawerStepsFormOpen, setDeleteModalDrawerStepsFormOpen] = useState(false);
    const [updateModalDrawerStepsFormOpen, setUpdateModalDrawerStepsFormOpen] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState(null);
    const [seriesInput, setSeriesInput] = useState(initialValue || []);

    const list = seriesInput || [];
    const createNewItem = {};


    function DeleteModalDrawerStepsForm({ open, setOpen, type = 'modal', item }) {
        return (
            <>
                <StepsForm
                    onFinish={async (values) => {
                        console.log('StepsForm.onFinish(values), values:', values);
                        if (!item || item.id === undefined) {
                            messageApi.error('The deletion was unsuccessful. Please try again');
                            return false;
                        }
                        // await deleteById(item.id);**************************************************
                        const newValue = seriesInput.filter(e => e.id !== item.id).map(((e,i) => ({...e, id:i})))
                        console.log('newValue', newValue)
                        setSeriesInput(newValue);
                        if (onChange) {
                            onChange(newValue);
                        }
                        setOpen(false);
                    }}
                    stepsFormRender={(dom, submitter) => {
                        return type === 'drawer' ? (
                            <Drawer
                                title="Delete An Item"
                                // width={800}
                                open={open}
                                afterOpenChange={setOpen}
                                onClose={() => setOpen(false)}
                                footer={submitter}
                                destroyOnClose
                            >
                                {dom}
                            </Drawer>
                        ) : (
                            <Modal
                                title="Delete An Item"
                                // width={800}
                                open={open}
                                afterOpenChange={setOpen}
                                onCancel={() => setOpen(false)}
                                footer={submitter}
                                destroyOnClose
                            >
                                {dom}
                            </Modal>
                        );
                    }}
                >
                    <StepsForm.StepForm
                        name="delete"
                        title="Delete"
                        onFinish={async () => {
                            if (!item || item.id === undefined) {
                                messageApi.error('The deletion was unsuccessful. Please try again');
                                return false;
                            }

                            try {
                                // await deleteById(item.id);**************************************************
                                return true;
                            } catch (error) {
                                messageApi.error('The deletion was unsuccessful. Please try again');
                                return false;
                            }
                        }}
                    >
                        <Result
                            status="warning"
                            title="Warning"
                            subTitle="Are you sure you want to delete this item?"
                        />

                        <Card size={'small'}>
                            <Card.Meta
                                avatar={<Tag bordered={false} color="#2db7f5">{"Investment Sequence "+ item.id}</Tag>}
                                description={
                                    <>
                                        <Descriptions size={'small'}>
                                            <Descriptions.Item span={3}>
                                                <h1>{item.seriesName}</h1>
                                            </Descriptions.Item>
                                            <Descriptions.Item label={SECURITY_TYPE_TAGS.CS} span={3}>
                                                {item.cs}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={SECURITY_TYPE_TAGS.RP} span={3}>
                                                {'$ ' + item.rpRv}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={SECURITY_TYPE_TAGS.CP_CS} span={3}>
                                                {item.cpConvertibleCs}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={SECURITY_TYPE_TAGS.CP_RV} span={3}>
                                                {'$ ' + item.cpOptionalValue}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </>
                                }
                            />
                        </Card>
                        <div style={{ textAlign: 'center' }}>
                            <br />
                            <h5>
                                To delete this item, click the Next button below. To cancel, close this window.
                            </h5>
                        </div>
                    </StepsForm.StepForm>

                    <StepsForm.StepForm name="result" title="Result">
                        <Result
                            status="success"
                            title="Success"
                            subTitle='Click "Finish" to delete the item.'
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </>
        );
    }

    function CreateModalDrawerStepsForm({ open, setOpen, type = 'modal' }) {
        return (
            <>
                <StepsForm
                    readonly
                    onFinish={async (values) => {
                        console.log('StepsForm.onFinish(values), values:', values);
                        const newValue = [...seriesInput, values]
                        setSeriesInput(newValue)
                        if (onChange) {
                            onChange(newValue);
                        }
                        setOpen(false);
                    }}
                    stepsFormRender={(dom, submitter) => {
                        return type === 'drawer' ? (
                            <Drawer
                                title="Create A New Series"
                                // width={800}
                                open={open}
                                afterOpenChange={setOpen}
                                onClose={() => setOpen(false)}
                                footer={submitter}
                                destroyOnClose
                            >
                                {dom}
                            </Drawer>
                        ) : (
                            <Modal
                                title="Create A New Series"
                                open={open}
                                afterOpenChange={setOpen}
                                onCancel={() => setOpen(false)}
                                footer={submitter}
                                destroyOnClose
                            >
                                {dom}
                            </Modal>
                        );
                    }}
                >
                    <StepsForm.StepForm
                        name="create"
                        title="Create"
                        onFinish={async (values) => {
                            const item = {
                                id: seriesInput.length,
                                seriesName: values.seriesName,
                                cs: values.cs, // CS Shares
                                cpConvertibleCs: values.cpConvertibleCs, // CP Shares
                                cpOptionalValue: values.cpOptionalValue, // CP Value
                                rpRv: values.rpRv, // RP Redemption Value
                            };
                            try {
                                // await create(item);***********************************************
                                // console.log(item)
                                return true;
                            } catch (error) {
                                messageApi.error(' Failed. Please try again', 5);
                                return false;
                            }
                        }}
                    >
                        <ProFormText
                            name="id"
                            label={<Tag bordered={false} color="#2db7f5">Investment Sequence</Tag>}
                            tooltip="Investment Sequence can not be changed."
                            placeholder={undefined}
                            disabled
                            initialValue={seriesInput.length}
                            rules={[{ required: true }]}
                            width="xl"
                        />
                        <ProFormText
                            name="seriesName"
                            label="Series Name"
                            tooltip=""
                            placeholder="Founders / Series A ..."
                            rules={[{ required: true }]}
                            width="xl"
                        />
                        <ProFormDigit
                            name="cs"
                            label={<span>{ SECURITY_TYPE_TAGS.CS} The shares of Common</span>}
                            width="sm"
                            placeholder="0"
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="rpRv"
                            label={<span>{SECURITY_TYPE_TAGS.RP} The redeemable value of Redeemable Preferred</span>}
                            fieldProps={{prefix: '$'}}
                            width="sm"
                            placeholder="0"
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpConvertibleCs"
                            label={<span>{SECURITY_TYPE_TAGS.CP_CS} The shares of Common that Convertible Preferred can be converted into</span>}
                            width="sm"
                            placeholder="0"
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpOptionalValue"
                            label={<span>{SECURITY_TYPE_TAGS.CP_RV} The redeemable value of Convertible Preferred. Determined by multiplying the Face Value (equal to the initial investment amount) by the liquidation preference</span>}
                            fieldProps={{prefix: '$'}}
                            width="sm"
                            placeholder="0"
                            min={0}
                            rules={[{ required: true }]}
                        />
                    </StepsForm.StepForm>

                    <StepsForm.StepForm name="result" title="Result">
                        <Result
                            status="success"
                            title="Success"
                            subTitle='Click "Finish" to create this item.'
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </>
        );
    }

    function UpdateModalDrawerStepsForm({ open, setOpen, type = 'modal', item }) {
        return (
            <>
                <StepsForm
                    onFinish={async (values) => {
                        console.log('StepsForm.onFinish(values), values:', values);
                        const newValue = seriesInput.map(item => item.id === values.id ? {...values} : item)
                        setSeriesInput(newValue)
                        if (onChange) {
                            onChange(newValue);
                        }
                        setOpen(false);
                    }}
                    stepsFormRender={(dom, submitter) => {
                        return type === 'drawer' ? (
                            <Drawer
                                title="Edit An Item"
                                // width={800}
                                open={open}
                                afterOpenChange={setOpen}
                                onClose={() => setOpen(false)}
                                footer={submitter}
                                destroyOnClose
                            >
                                {dom}
                            </Drawer>
                        ) : (
                            <Modal
                                title="Edit An Item"
                                // width={800}
                                open={open}
                                afterOpenChange={setOpen}
                                onCancel={() => setOpen(false)}
                                footer={submitter}
                                destroyOnClose
                            >
                                {dom}
                            </Modal>
                        );
                    }}
                >
                    <StepsForm.StepForm
                        name="update"
                        title="Update"
                        onFinish={async (values) => {
                            try {
                                // await updateNonNullProperties(updatedItem);***********************
                                // console.log('values', values)
                                return true;
                            } catch (error) {
                                messageApi.error(' The update failed. Please try again ');
                                return false;
                            }
                        }}
                    >
                        <ProFormText
                            name="id"
                            label={<Tag bordered={false} color="#2db7f5">Investment Sequence</Tag>}
                            tooltip="Investment Sequence ID can not be changed."
                            placeholder={undefined}
                            disabled
                            initialValue={item.id}
                            rules={[{ required: true }]}
                            width="xl"
                        />
                        <ProFormText
                            name="seriesName"
                            label="Series Name"
                            tooltip=""
                            placeholder="Founders / Series A ..."
                            initialValue={item.seriesName}
                            rules={[{ required: true }]}
                            width="xl"
                        />
                        <ProFormDigit
                            name="cs"
                            label={<span>{ SECURITY_TYPE_TAGS.CS} The shares of Common</span>}
                            width="sm"
                            placeholder="0"
                            initialValue={item.cs}
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="rpRv"
                            label={<span>{SECURITY_TYPE_TAGS.RP} The redeemable value of Redeemable Preferred</span>}
                            width="sm"
                            placeholder="0"
                            fieldProps={{prefix: '$'}}
                            initialValue={item.rpRv}
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpConvertibleCs"
                            label={<span>{SECURITY_TYPE_TAGS.CP_CS} The shares of Common that Convertible Preferred can be converted into</span>}
                            width="sm"
                            placeholder="0"
                            initialValue={item.cpConvertibleCs}
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpOptionalValue"
                            label={<span>{SECURITY_TYPE_TAGS.CP_RV} The redeemable value of Convertible Preferred. Determined by multiplying the Face Value (equal to the initial investment amount) by the liquidation preference</span>}
                            width="sm"
                            placeholder="0"
                            fieldProps={{prefix: '$'}}
                            initialValue={item.cpOptionalValue}
                            min={0}
                            rules={[{ required: true }]}
                        />

                    </StepsForm.StepForm>

                    <StepsForm.StepForm name="result" title="Result">
                        <Result
                            status="success"
                            title="Success"
                            subTitle='Click "Finish" to update the values.'
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </>
        );
    }

    return (
        <>
            <List
                rowKey="id"
                // loading={loading}
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 6,
                    xxl: 6,
                }}
                dataSource={[...list, createNewItem]}
                renderItem={(item, _) => {
                    if (item !== createNewItem) {
                        return (
                            <List.Item key={item.id} >
                                <Card
                                    size={'small'}
                                    hoverable
                                    actions={[
                                        <Tooltip key="update" title="Edit">
                                            <EditOutlined
                                                onClick={() => {
                                                    setItemToUpdate(item);
                                                    setUpdateModalDrawerStepsFormOpen(true);
                                                }}
                                            />
                                        </Tooltip>,
                                        <Tooltip key="delete" title="Delete">
                                            <DeleteOutlined
                                                onClick={() => {
                                                    setItemToDelete(item);
                                                    setDeleteModalDrawerStepsFormOpen(true);
                                                }}
                                            />
                                        </Tooltip>,
                                    ]}
                                >
                                    <Card.Meta
                                    // avatar={<Tag bordered={false} color="#2db7f5">{"Investment Sequence "+ item.id}</Tag>}
                                    description={
                                        <>
                                            <Descriptions size={'small'}>
                                                <Descriptions.Item span={3} >
                                                    <div style={{margin: 0, padding: 0, backgroundColor: '#1f77b4',color: 'white', borderRadius: '5px'}}>
                                                        <p style={{margin: '0 5px', padding: 0}}>Investment</p>
                                                        <p style={{margin: '0 5px', padding: 0}}>Sequence</p>
                                                        <p style={{margin: '0 5px', padding: 0}}>{item.id}</p>
                                                    </div>
                                                    {/*<Tag bordered={false} color="#2db7f5">*/}
                                                    {/*    <p>Investment</p>*/}
                                                    {/*    <p>Sequence</p>*/}
                                                    {/*    <p>{item.id}</p>*/}
                                                    {/*</Tag>*/}
                                                </Descriptions.Item>
                                                <Descriptions.Item span={3}>
                                                    <h1>{item.seriesName}</h1>
                                                </Descriptions.Item>
                                                <Descriptions.Item label={SECURITY_TYPE_TAGS.CS} span={3}>
                                                    {item.cs}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={SECURITY_TYPE_TAGS.RP} span={3}>
                                                    {'$ ' + item.rpRv}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={SECURITY_TYPE_TAGS.CP_CS} span={3}>
                                                    {item.cpConvertibleCs}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={SECURITY_TYPE_TAGS.CP_RV} span={3}>
                                                    {'$ ' + item.cpOptionalValue}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </>
                                    }
                                />
                                </Card>
                            </List.Item>
                        );
                    } else if (item === createNewItem) {
                        return (
                            <List.Item>
                                <Card
                                    size={'small'}
                                    onClick={() => setCreateModalDrawerStepsFormOpen(true)}
                                    hoverable
                                    actions={[
                                        <h3 key={'create'} style={{color: '#3498db'}}>
                                            <PlusOutlined/> <br/>Add a new series
                                        </h3>,
                                        ]}
                                    >
                                <Card.Meta
                                        title={false}
                                        description={
                                            <h4 style={{color: 'black'}}>
                                                {seriesInput.length <= 0 ?
                                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Empty'} /> :
                                                <p>{'Total ' + seriesInput.length + ' items'}</p>}
                                            </h4>

                                        }
                                    />
                                </Card>
                            </List.Item>
                        );
                    }
                }}
            />

            <CreateModalDrawerStepsForm
                type={'modal'}
                open={createModalDrawerStepsFormOpen}
                setOpen={setCreateModalDrawerStepsFormOpen}
            />
            {itemToDelete && (
                <DeleteModalDrawerStepsForm
                    type={'modal'}
                    open={deleteModalDrawerStepsFormOpen}
                    setOpen={setDeleteModalDrawerStepsFormOpen}
                    item={itemToDelete}
                />
            )}
            {itemToUpdate && (
                <UpdateModalDrawerStepsForm
                    type={'modal'}
                    open={updateModalDrawerStepsFormOpen}
                    setOpen={setUpdateModalDrawerStepsFormOpen}
                    item={itemToUpdate}
                />
            )}
        </>
    );
}
