const example = [
    {
        seriesName: 'Founders',
        csShares: 5,
        cpShares: 0,
        cpFv: 0,
        rpFv: 0,
        liqPref: 1,
    }
]

const seriesArray = []


function addSeries(seriesArray, seriesName, csShares, cpShares, cpFv, rpFv, liqPref=1){
    seriesArray.push({seriesName, csShares, cpShares, cpFv, rpFv, liqPref})
}


/*
    Convertible Preferred Shares - Realization Value
 */
function setCpRv(seriesArray){
    seriesArray.forEach(series => {
        series.cpRv = series.cpFv * series.liqPref
    })
}