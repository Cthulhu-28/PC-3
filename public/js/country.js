data = [];

function init(countryCode) {
    Highcharts.data({
        googleSpreadsheetKey: '1BTcxsNxBPXNupUi6xb-Og4Lh5IAK62HF5LCEG-rYSfA',

        // Custom handler when the spreadsheet is parsed
        parsed: function(columns) {

            // Read the columns into the data array
            Highcharts.each(columns[1], function(code, i) {
                let year = columns[10][i];
                if (code.toUpperCase() === countryCode && i > 0) {
                    data.push({
                        code: code.toUpperCase(),
                        value: parseFloat(columns[3][i]),
                        name: columns[2][i],
                        rank: columns[0][i],
                        year: year,
                        indicators: [
                            parseFloat(columns[4][i].toFixed(3)),
                            parseFloat(columns[5][i].toFixed(3)),
                            parseFloat(columns[6][i].toFixed(3)),
                            parseFloat(columns[7][i].toFixed(3)),
                            parseFloat(columns[8][i].toFixed(3)),
                            parseFloat(columns[9][i].toFixed(3)),
                        ],
                    });
                }
            });

            barchart();
            timeline();

        },
        error: function() {
            document.getElementById('containers').innerHTML = '<div class="loading">' +
                '<i class="icon-frown icon-large"></i> ' +
                'Error loading data from Google Spreadsheets' +
                '</div>';
        }
    });
}

function barchart() {
    Highcharts.chart('container-3', {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [...new Set(data.map(x => x.year))],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'value',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:#303030;padding:0"><b>{series.name}: </b></td>' +
                '<td style="padding:0">{point.y:.3f}</td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
        },
        legend: {
            layout: 'horizontal',
            align: 'right',
            verticalAlign: 'top',
            floating: false,
            borderWidth: 1,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'GDP',
            data: selectIndicator(0, data),
            color: "#cff09e"
        }, {
            name: 'Social support',
            data: selectIndicator(1, data),
            color: "#a8dba8"
        }, {
            name: 'Life expectancy',
            data: selectIndicator(2, data),
            color: "#79bd9a"
        }, {
            name: 'Freedom',
            data: selectIndicator(3, data),
            color: "#3b8686"
        }, {
            name: 'Generosity',
            data: selectIndicator(4, data),
            color: "#0b486b"
        }, {
            name: 'Corruption',
            data: selectIndicator(5, data),
            color: "#606060"
        }]
    });
}

function timeline() {
    let colors = ["#79bd9a", "#3b8686", "#0b486b"];
    seriesData = [];
    data.forEach((year, i) => {
        seriesData.push({
            x: Date.UTC(year.year, 1, 1),
            name: year.rank.toString(),
            label: year.rank.toString(),
            description: `Score: ${year.value.toFixed(3)}`,
            color: colors[i % colors.length]
        });
    });
    Highcharts.chart('container-4', {
        chart: {
            zoomType: 'x',
            type: 'timeline'
        },
        xAxis: {
            type: 'datetime',
            visible: false
        },
        yAxis: {
            gridLineWidth: 1,
            title: null,
            labels: {
                enabled: false
            }
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        tooltip: {
            style: {
                width: 300
            }
        },
        series: [{
            dataLabels: {
                allowOverlap: false,
                format: '<span style="color:{point.color}">● </span><span style="font-weight: bold;" > ' +
                    '{point.x:%Y}</span><br/>{point.label}'
            },
            marker: {
                symbol: 'circle'
            },
            data: seriesData
        }]
    });
}

function selectIndicator(index, data) {
    result = [];
    data.forEach(element => {
        result.push(element.indicators[index]);
    });
    return result;
}