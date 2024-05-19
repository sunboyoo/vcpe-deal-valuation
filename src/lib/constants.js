
import React from "react";
import * as ChartJSUtils from "../chartjs/ExpirationPayoffDiagram/chartjs-utils";
import {Tag} from "antd";

export const SECURITY_TYPES = {
    CS: {
        code: 'CS',
        text: 'Common Stock',
    },
    RP: {
        code: 'RP',
        text: 'Redeemable Preferred',
    },
    CP: {
        code: 'CP',
        text: 'Convertible Preferred',
    },
    CP_CS: {
        code: 'CP_CS',
        text: 'Common Stock Converted From Convertible Preferred',
    },
    CP_RV: {
        code: 'CP_RV',
        text: 'Redeemable Value of Convertible Preferred',
    },
};

export const SECURITY_TYPE_COLORS = {
    [SECURITY_TYPES.CS.code]: {
        code: 'CS',
        text: 'CS',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.4),
    },
    [SECURITY_TYPES.CP_CS.code]: {
        code: 'CP_CS',
        text: 'CP->CS',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(4), 0.6),
    },
    [SECURITY_TYPES.RP.code]: {
        code: 'RP',
        text: 'RP',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.5),
    },
    [SECURITY_TYPES.CP_RV.code]: {
        code: 'CP_RV',
        text: 'CP->Redeem',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(0), 0.7),
    },
    [SECURITY_TYPES.CP.code]: {
        code: 'CP',
        text: 'CP',
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(1), 0.7),
    },
}

export const SECURITY_TYPE_TAGS = {
    [SECURITY_TYPES.CS.code]: <Tag color={SECURITY_TYPE_COLORS.CS.backgroundColor}>CS</Tag>,
    [SECURITY_TYPES.CP_CS.code]: <Tag color={SECURITY_TYPE_COLORS.CP_CS.backgroundColor}>CP -> CS</Tag>,
    [SECURITY_TYPES.RP.code]: <Tag color={SECURITY_TYPE_COLORS.RP.backgroundColor}>RP</Tag>,
    [SECURITY_TYPES.CP_RV.code]: <Tag color={SECURITY_TYPE_COLORS.CP_RV.backgroundColor}>CP -> Redeem</Tag>,
    [SECURITY_TYPES.CP.code]: <Tag color={SECURITY_TYPE_COLORS.CP.backgroundColor}>CP</Tag>,
}