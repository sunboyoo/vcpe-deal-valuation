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
    message,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ProFormText, ProFormDigit, StepsForm } from '@ant-design/pro-components';

import { useState } from 'react';

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
                            <Descriptions title={item.seriesName} size={'small'}>
                                <Descriptions.Item label="CS" span={3}>
                                    {item.cs}
                                </Descriptions.Item>
                                <Descriptions.Item label="RP" span={3}>
                                    {'$ ' + item.rpRv}
                                </Descriptions.Item>
                                <Descriptions.Item label="CP->CS" span={3}>
                                    {item.cpConvertibleCs}
                                </Descriptions.Item>
                                <Descriptions.Item label="CP->Redeem" span={3}>
                                    {'$ ' + item.cpOptionalValue}
                                </Descriptions.Item>
                            </Descriptions>
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
                            label="Series ID"
                            tooltip="ID can not be changed."
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
                            label="The shares of Common Stocks (CS)"
                            width="sm"
                            placeholder="0"
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="rpRv"
                            label="The redeemable value of Redeemable Preferred shares (RP)"
                            fieldProps={{prefix: '$'}}
                            width="sm"
                            placeholder="0"
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpConvertibleCs"
                            label="The shares of Common Stocks that Convertible Preferred can be converted into (CP -> CS)"
                            width="sm"
                            placeholder="0"
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpOptionalValue"
                            label="The redeemable value of Convertible Preferred shares (CP -> Redeemable Value)"
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
                                title="Update An Item"
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
                                title="Update An Item"
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
                            label="Metric ID"
                            tooltip="ID can not be changed."
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
                            label="The shares of Common Stocks (CS)"
                            width="sm"
                            placeholder="0"
                            initialValue={item.cs}
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="rpRv"
                            label="The redeemable value of Redeemable Preferred shares (RP)"
                            width="sm"
                            placeholder="0"
                            fieldProps={{prefix: '$'}}
                            initialValue={item.rpRv}
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpConvertibleCs"
                            label="The shares of Common Stocks that Convertible Preferred can be converted into (CP -> CS)"
                            width="sm"
                            placeholder="0"
                            initialValue={item.cpConvertibleCs}
                            min={0}
                            rules={[{ required: true }]}
                        />
                        <ProFormDigit
                            name="cpOptionalValue"
                            label="The redeemable value of Convertible Preferred shares (CP -> Redeemable Value)"
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
                    xl: 4,
                    xxl: 4,
                }}
                dataSource={[...list, createNewItem]}
                renderItem={(item, _) => {
                    if (item !== createNewItem) {
                        return (
                            <List.Item key={item.id}>
                                <Card
                                    size={'small'}
                                    hoverable
                                    actions={[
                                        <Tooltip key="update" title="Update">
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
                                        avatar={<Tag>{item.id}</Tag>}
                                        description={
                                            <>
                                                <Descriptions title={item.seriesName} size={'small'}>
                                                    <Descriptions.Item label="CS" span={3}>
                                                        {item.cs}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="RP" span={3}>
                                                        {'$ ' + item.rpRv}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="CP->CS" span={3}>
                                                        {item.cpConvertibleCs}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="CP->Redeem" span={3}>
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
                                        <a key={'create'}>
                                            <PlusOutlined /> Create A New Item
                                        </a>,
                                    ]}
                                    style={{ minWidth: '300px' }}
                                >
                                    <Card.Meta
                                        title={false}
                                        description={ seriesInput.length <= 0 ?
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Empty'} /> : <p>{'Total ' + seriesInput.length + ' items'}</p>
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
