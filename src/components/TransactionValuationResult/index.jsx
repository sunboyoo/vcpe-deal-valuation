import {Card, Col, Row, Statistic} from "antd";
import React from "react";

export default function TransactionValuationResult ({postTxV, preTxV, postTxPv, postTxGPCV, postTxLPV}) {

    return <>
        <Card bordered={false}>
            <h1 >Transaction Valuation</h1>
            <div style={{height: '20px'}}/>
            <Row>
                <Col span={6}>
                    <Statistic
                        title="Post-Transaction Valuation"
                        value={postTxV}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
                <Col span={3}>
                    <div style={{height: 10}}></div>
                    <div style={{fontSize: 40}}>{'='}</div>
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Pre-Transaction Valuation"
                        value={preTxV}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
                <Col span={3}>
                    <div style={{height: 10}}></div>
                    <div style={{fontSize: 40}}>{'+'}</div>
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Post-Transaction Partial Valuation"
                        value={postTxPv}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
            </Row>
            <div style={{height: '40px'}}/>
            <Row>
                <Col span={6}>
                    <Statistic
                        title="Post-Transaction PV"
                        value={postTxPv}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
                <Col span={3}>
                    <div style={{height: 10}}></div>
                    <div style={{fontSize: 40}}>{'='}</div>
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Post-Transaction LPV"
                        value={postTxLPV}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
                <Col span={3}>
                    <div style={{height: 10}}></div>
                    <div style={{fontSize: 40}}>{'+'}</div>
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Post-Transaction GPV"
                        value={postTxGPCV}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
            </Row>
        </Card>



    </>
}