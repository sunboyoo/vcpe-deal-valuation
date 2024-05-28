import React from "react";
import {Tag} from "antd";

export const SECURITY_TYPES = {
    RP: 'RP',
    CP_RV: 'CP_RV',
    CP: 'CP',
    CS: 'CS',
    CP_CS: 'CP_CS',
}

export const SECURITY_NAMES = {
    RP: 'Redeemable Preferred',
    CP_RV: 'Redeemable Value of Convertible Preferred',
    CP: 'Convertible Preferred',
    CS: 'Common Stock',
    CP_CS: 'Common Stock Converted From Convertible Preferred',
}

export const SECURITY_LIQUIDATION_SEQUENCE = {
    RP: 0,
    CP_RV: 0,
    CS: 1,
    CP_CS:1,
}

export const SECURITY_TYPE_COLORS = {
    CS: {
        code: 'CS',
        text: 'CS',
        backgroundColor: '#1f77b4',
        // backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.4),
    },
    CP_CS: {
        code: 'CP_CS',
        text: 'CP->CS',
        backgroundColor: '#ff7f0e',
        // backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.6),
    },
    RP: {
        code: 'RP',
        text: 'RP',
        backgroundColor: '#2ca02c',
        // backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.5),
    },
    CP_RV: {
        code: 'CP_RV',
        text: 'CP->Redeem',
        backgroundColor: '#ff7f0e',
        // backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.7),
    },
    CP: {
        code: 'CP',
        text: 'CP',
        backgroundColor: '#ff7f0e',
        // backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(1), 0.7),
    },
}

export const SECURITY_TYPE_TAGS = {
    CS: <Tag color={SECURITY_TYPE_COLORS.CS.backgroundColor}>CS</Tag>,
    CP_CS: <Tag color={SECURITY_TYPE_COLORS.CP_CS.backgroundColor}>CP -> CS</Tag>,
    RP: <Tag color={SECURITY_TYPE_COLORS.RP.backgroundColor}>RP</Tag>,
    CP_RV: <Tag color={SECURITY_TYPE_COLORS.CP_RV.backgroundColor}>CP -> Redeem</Tag>,
    CP: <Tag color={SECURITY_TYPE_COLORS.CP.backgroundColor}>CP</Tag>,
}