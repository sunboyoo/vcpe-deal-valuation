import {Card, Col, Row, Statistic} from "antd";
import React from "react";

function equal(a, b, epsilon=1e-6){
    return Math.abs(a - b) < epsilon;
}

export default function InvestmentDecisionResult({lpv, lpc, firmValue, postTxFirmValue}) {

    function lessEqualMore(less, equals, more, a, b){
        return equal(a, b) ? equals :
            a > b ? more : less
    }

    function lessEqualMoreByLpvLpc(less, equals, more){
        return lessEqualMore(less, equals, more, lpv, lpc)
    }

    function lessEqualMoreByFirmValue(less, equals, more){
        return lessEqualMore(less, equals, more, firmValue, postTxFirmValue)
    }

    const colorLp = lessEqualMoreByLpvLpc('red', 'green', 'green');
    const colorFirmValue = lessEqualMoreByFirmValue('red', 'green', 'green');

    return <>
        <Card bordered={false}>
            <h1 style={{color: colorLp}}>
                { lessEqualMoreByLpvLpc(
                    'Negative Investment Decision',
                    'Break-Even Investment Decision',
                    'Positive Investment Decision'
                )}
            </h1>
            <div style={{height: '20px'}}/>
            <Row>
                <Col span={10}>
                    <Statistic
                        title="At the current firm value"
                        value={lpv}
                        precision={3}
                        valueStyle={{}}
                        prefix={<span>LPV = </span>}
                    />
                </Col>
                <Col span={4}>
                    <div style={{height: 10}}></div>
                    {lessEqualMoreByLpvLpc(
                        <div style={{fontSize: 40, color: colorLp}}>{'<'}</div>,
                        <div style={{fontSize: 40, color: colorLp}}>{'='}</div>,
                        <div style={{fontSize: 40, color: colorLp}}>{'>'}</div>
                    )
                    }
                </Col>
                <Col span={10}>
                    <Statistic
                        title="With lifetime fee"
                        value={lpc}
                        precision={3}
                        valueStyle={{}}
                        prefix={<span>LP Cost = </span>}
                    />
                </Col>
            </Row>
            <div style={{height: '40px'}}/>
            <Row>
                <Col span={10}>
                    <Statistic
                        title="Current Firm Value"
                        value={firmValue}
                        precision={3}
                        valueStyle={{}}
                        prefix={<span></span>}
                    />
                </Col>
                <Col span={4}>
                    <div style={{height: 10}}></div>
                    {lessEqualMoreByFirmValue(
                        <div style={{fontSize: 40, color: colorFirmValue}}>{'<'}</div>,
                        <div style={{fontSize: 40, color: colorFirmValue}}>{'='}</div>,
                        <div style={{fontSize: 40, color: colorFirmValue}}>{'>'}</div>
                    )
                    }
                </Col>
                <Col span={10}>
                    <Statistic
                        title="Post-Transaction Firm Value"
                        value={postTxFirmValue}
                        precision={3}
                        valueStyle={{}}
                    />
                </Col>
            </Row>
        </Card>



    </>
}