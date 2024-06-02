import {Card, Col, Row, Statistic} from "antd";
import React from "react";

export default function ValuationResult ({pv, lpv, gpv, lpc}) {

    return <>
        <Card bordered={false}>
            <h1 >Valuation</h1>
            <div style={{height: '20px'}}/>
            <Row>
                <Col span={6}>
                    <Statistic
                        title="PV"
                        value={pv}
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
                        title="LPV"
                        value={lpv}
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
                        title="GPV"
                        value={gpv}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
            </Row>
            <div style={{height: '40px'}}/>
            <Row style={{display: "flex", justifyContent: 'center'}}>
                <Col span={6}>
                    <Statistic
                        title="LP Cost"
                        value={lpc}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
            </Row>

        </Card>



    </>
}