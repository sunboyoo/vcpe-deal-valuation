import {test_Call_Bin_Eur_Call_Bin_Eur_RE, test_Call_Eur_Put_Eur_Call_Eur_RE} from "./option";
import {testWarrant} from "./warrant";
import {testSeriesA_CS} from "./series-a-cs";
import {testSeriesA_RP_CS} from "./series-a-rp-cs";
import {testSeriesA_CP} from "./series-a-cp";
import {testSeriesA_PCP} from "./series-a-pcp";
import {testTransactionValuation} from "./generic-payoff";

export default function VcpePage(){

    console.log(test_Call_Eur_Put_Eur_Call_Eur_RE())
    console.log(test_Call_Bin_Eur_Call_Bin_Eur_RE())
    console.log(testSeriesA_CS())
    console.log(testSeriesA_RP_CS())
    console.log(testSeriesA_CP())
    console.log(testSeriesA_PCP())
    console.log("testTransactionPayoff(): ", testTransactionValuation())

    return (
        <div>
            <div>{"Warrant: " + testWarrant()}</div>
        </div>
    )
}