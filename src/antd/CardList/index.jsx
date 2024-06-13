import React, {useRef, useState} from "react";
import {Card, Descriptions, Drawer, Empty, List, message, Modal, Result, Tag, Tooltip,} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {ProFormDigit, ProFormText, StepsForm} from '@ant-design/pro-components';
import {SECURITY_TYPE_TAGS} from "../../lib/constants";

function numberToLetter(num) {
    let result = '';
    while (num > 0) {
        let remainder = (num - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        num = Math.floor((num - 1) / 26);
    }
    return result;
}

export default function CardList({initialValue, onChange}) {
    const [messageApi] = message.useMessage();

    const [createModalDrawerStepsFormOpen, setCreateModalDrawerStepsFormOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteModalDrawerStepsFormOpen, setDeleteModalDrawerStepsFormOpen] = useState(false);
    const [updateModalDrawerStepsFormOpen, setUpdateModalDrawerStepsFormOpen] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState(null);
    const [seriesInput, setSeriesInput] = useState(initialValue || []);

    const list = seriesInput || [];
    const createNewItem = {};
    const createFormRef = useRef();
    const updateFormRef = useRef();


    function DeleteModalDrawerStepsForm({open, setOpen, type = 'modal', item}) {
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
                        const newValue = seriesInput.filter(e => e.id !== item.id).map(((e, i) => ({...e, id: i})))
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
                            } else {
                                return true;
                            }

                            // try {
                            //     // await deleteById(item.id);**************************************************
                            //     return true;
                            // } catch (error) {
                            //     messageApi.error('The deletion was unsuccessful. Please try again');
                            //     return false;
                            // }
                        }}
                    >
                        <Result
                            status="warning"
                            title="Warning"
                            subTitle="Are you sure you want to delete this item?"
                        />

                        <Card size={'small'}>
                            <Card.Meta
                                avatar={<Tag bordered={false} color="#2db7f5">{"Investment Sequence " + item.id}</Tag>}
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
                        <div style={{textAlign: 'center'}}>
                            <br/>
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

    function CreateModalDrawerStepsForm({open, setOpen, type = 'modal'}) {
        return (
            <>
                <StepsForm
                    formRef={createFormRef}
                    readonly
                    onFinish={async (values) => {
                        // console.log('StepsForm.onFinish(values), values:', values);
                        // const newValue = [...seriesInput, values]
                        // setSeriesInput(newValue)
                        // if (onChange) {
                        //     onChange(newValue);
                        // }
                        // setOpen(false);

                        if (
                            (values.cpConvertibleCs === 0 && values.cpOptionalValue === 0) ||
                            (values.cpConvertibleCs > 0 && values.cpOptionalValue > 0)
                        ) {
                            console.log('StepsForm.onFinish(values), values:', values);
                            const newValue = [...seriesInput, values];
                            setSeriesInput(newValue);
                            if (onChange) {
                                onChange(newValue);
                            }
                            setOpen(false);
                        } else {
                            messageApi.error('Both cpConvertibleCs and cpOptionalValue should be zero or positive.');
                            return false;
                        }
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

                        onValuesChange={() => {
                            createFormRef.current?.validateFields(['cpConvertibleCs', 'cpOptionalValue']);
                        }}
                        onFinish={async (values) => {
                            if (
                                (values.cpConvertibleCs === 0 && values.cpOptionalValue === 0) ||
                                (values.cpConvertibleCs > 0 && values.cpOptionalValue > 0)
                            ) {
                                return true;
                            } else {
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
                            rules={[{required: true}]}
                            width="xl"
                        />
                        <ProFormText
                            name="seriesName"
                            label="Series Name"
                            tooltip=""
                            placeholder="Founders / Series A ..."
                            initialValue={seriesInput.length === 0 ? 'Founders' : 'Series ' + numberToLetter(seriesInput.length)}
                            rules={[{required: true}]}
                            width="xl"
                        />
                        <ProFormDigit
                            name="cs"
                            label={<span>{SECURITY_TYPE_TAGS.CS} The shares of Common</span>}
                            width="sm"
                            placeholder="0"
                            min={0}
                            initialValue={0}
                            rules={[{required: true}]}
                        />
                        <ProFormDigit
                            name="rpRv"
                            label={<span>{SECURITY_TYPE_TAGS.RP} The redeemable value of Redeemable Preferred</span>}
                            fieldProps={{prefix: '$'}}
                            width="sm"
                            placeholder="0"
                            min={0}
                            initialValue={0}
                            rules={[{required: true}]}
                        />
                        <ProFormDigit
                            name="cpConvertibleCs"
                            label={<span>{SECURITY_TYPE_TAGS.CP_CS} The shares of Common that Convertible Preferred can be converted into</span>}
                            width="sm"
                            placeholder="0"
                            min={0}
                            initialValue={0}
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        const form = createFormRef.current?.getFieldsValue();
                                        const cpOptionalValue = form?.cpOptionalValue;
                                        if (
                                            (value === 0 && cpOptionalValue === 0) ||
                                            (value > 0 && cpOptionalValue > 0)
                                        ) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject('Both CP->CS and CP->Redeem should have non-zero (or zero) values at the same time.');
                                        }
                                    },
                                },
                            ]}
                        />
                        <ProFormDigit
                            name="cpOptionalValue"
                            label={<span>{SECURITY_TYPE_TAGS.CP_RV} The redeemable value of Convertible Preferred. Determined by multiplying the Face Value (equal to the initial investment amount) by the liquidation preference</span>}
                            width="sm"
                            placeholder="0"
                            min={0}
                            initialValue={0}
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        const form = createFormRef.current?.getFieldsValue();
                                        const cpConvertibleCs = form?.cpConvertibleCs;
                                        if (
                                            (cpConvertibleCs === 0 && value === 0) ||
                                            (cpConvertibleCs > 0 && value > 0)
                                        ) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject('Both CP->CS and CP->Redeem should have non-zero (or zero) values at the same time.');
                                        }
                                    },
                                },
                            ]}
                            fieldProps={{
                                prefix: '$',
                            }}
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

    function UpdateModalDrawerStepsForm({open, setOpen, type = 'modal', item}) {
        return (
            <>
                <StepsForm
                    formRef={updateFormRef}
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
                        onValuesChange={() => {
                            updateFormRef.current?.validateFields(['cpConvertibleCs', 'cpOptionalValue']);
                        }}
                        onFinish={async (values) => {
                            return true;
                            // try {
                            //     // await updateNonNullProperties(updatedItem);***********************
                            //     // console.log('values', values)
                            //     return true;
                            // } catch (error) {
                            //     messageApi.error(' The update failed. Please try again ');
                            //     return false;
                            // }
                        }}
                    >
                        <ProFormText
                            name="id"
                            label={<Tag bordered={false} color="#2db7f5">Investment Sequence</Tag>}
                            tooltip="Investment Sequence ID can not be changed."
                            placeholder={undefined}
                            disabled
                            initialValue={item.id}
                            rules={[{required: true}]}
                            width="xl"
                        />
                        <ProFormText
                            name="seriesName"
                            label="Series Name"
                            tooltip=""
                            placeholder="Founders / Series A ..."
                            initialValue={item.seriesName}
                            rules={[{required: true}]}
                            width="xl"
                        />
                        <ProFormDigit
                            name="cs"
                            label={<span>{SECURITY_TYPE_TAGS.CS} The shares of Common</span>}
                            width="sm"
                            placeholder="0"
                            initialValue={item.cs}
                            min={0}
                            rules={[{required: true}]}
                        />
                        <ProFormDigit
                            name="rpRv"
                            label={<span>{SECURITY_TYPE_TAGS.RP} The redeemable value of Redeemable Preferred</span>}
                            width="sm"
                            placeholder="0"
                            fieldProps={{prefix: '$'}}
                            initialValue={item.rpRv}
                            min={0}
                            rules={[{required: true}]}
                        />
                        <ProFormDigit
                            name="cpConvertibleCs"
                            label={<span>{SECURITY_TYPE_TAGS.CP_CS} The shares of Common that Convertible Preferred can be converted into</span>}
                            width="sm"
                            placeholder="0"
                            initialValue={item.cpConvertibleCs}
                            min={0}
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        const form = updateFormRef.current?.getFieldsValue();
                                        const cpOptionalValue = form?.cpOptionalValue;
                                        if (
                                            (value === 0 && cpOptionalValue === 0) ||
                                            (value > 0 && cpOptionalValue > 0)
                                        ) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject('Both CP->CS and CP->Redeem should have non-zero (or zero) values at the same time.');
                                        }
                                    },
                                },
                            ]}
                        />
                        <ProFormDigit
                            name="cpOptionalValue"
                            label={<span>{SECURITY_TYPE_TAGS.CP_RV} The redeemable value of Convertible Preferred. Determined by multiplying the Face Value (equal to the initial investment amount) by the liquidation preference</span>}
                            width="sm"
                            placeholder="0"
                            fieldProps={{prefix: '$'}}
                            initialValue={item.cpOptionalValue}
                            min={0}
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        const form = updateFormRef.current?.getFieldsValue();
                                        const cpConvertibleCs = form?.cpConvertibleCs;
                                        if (
                                            (cpConvertibleCs === 0 && value === 0) ||
                                            (cpConvertibleCs > 0 && value > 0)
                                        ) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject('Both CP->CS and CP->Redeem should have non-zero (or zero) values at the same time.');
                                        }
                                    },
                                },
                            ]}
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


    function getRvpsArray(seriesArray){
        let rvpsArr = seriesArray.map((series) => series.cpOptionalValue / series.cpConvertibleCs)
        // Remove null and NaN values
        rvpsArr = rvpsArr.filter((item) => (Number.isFinite(item)))
        // Remove duplicates
        rvpsArr = rvpsArr.filter((item, index) => rvpsArr.indexOf(item) === index)
        // Sort
        rvpsArr.sort((a, b) => a - b)
        return rvpsArr;
    }

    const rvpsArray = getRvpsArray(seriesInput);

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
                            <List.Item key={item.id}>
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
                                                    <Descriptions.Item span={3}>
                                                        <div style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            backgroundColor: '#1f77b4',
                                                            color: 'white',
                                                            borderRadius: '5px'
                                                        }}>
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
                                                    {
                                                        item.cpConvertibleCs > 0 ? <Descriptions.Item label={<Tag color={'black'}>RVPS</Tag>} span={3}>
                                                            {item.cpOptionalValue / item.cpConvertibleCs}
                                                        </Descriptions.Item> : <div style={{height: '64px'}}></div>
                                                    }
                                                    {
                                                        item.cpConvertibleCs > 0 && <Descriptions.Item label={<Tag color={'black'}>CP Conversion Order</Tag>} span={3}>
                                                            { 1 + rvpsArray.indexOf(item.cpOptionalValue / item.cpConvertibleCs)}
                                                        </Descriptions.Item>
                                                    }
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
                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                           description={'Empty'}/> :
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
