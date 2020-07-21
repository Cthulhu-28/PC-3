// Load the data from a Google Spreadsheet
// https://docs.google.com/spreadsheets/d/1WBx3mRqiomXk_ks1a5sEAtJGvYukguhAkcCuRDrY1L0/pubhtml
//https://docs.google.com/spreadsheets/d/e/2PACX-1vRQWQg_yqG55pEYrTUYPNIXc8MAz4rntH2G0W0opqy36wM1HiRWbbwzQssFPvIvlGHYPqttrJxVVslk/pubhtml?gid=0&single=true
var data = [];

let selected;



function init() {
    Highcharts.data({
        googleSpreadsheetKey: '1BTcxsNxBPXNupUi6xb-Og4Lh5IAK62HF5LCEG-rYSfA',

        // Custom handler when the spreadsheet is parsed
        parsed: function(columns) {

            // Read the columns into the data array
            console.log(columns);
            Highcharts.each(columns[1], function(code, i) {
                let year = columns[10][i];
                if (year === 2019 || i == 0) {
                    data.push({
                        code: code.toUpperCase(),
                        value: parseFloat(columns[3][i]),
                        name: columns[2][i],
                        rank: columns[0][i],
                        year: year,
                        indicators: [
                            columns[4][i],
                            columns[5][i],
                            columns[6][i],
                            columns[7][i],
                            columns[8][i],
                            columns[9][i],
                        ],
                    });
                }
            });
            let colors = getColors(59, 134, 134, 6);
            showCountry({
                point: {
                    name: data[1].name,
                    rank: data[1].rank,
                    code: data[1].code,
                }
            });
            // Initiate the chart
            Highcharts.mapChart('containers', {
                chart: {
                    map: 'custom/world',
                    borderWidth: 0
                },

                colors: ['rgba(255,255,0,1)', 'rgba(11,72,107,1)',
                    'rgba(59,134,134,1)', 'rgba(121,189,154,1)', 'rgba(68,219,168,1)', 'rgba(207,240,158,1)'
                ],

                title: {
                    text: 'Global hapiness index 2019 by country'
                },

                mapNavigation: {
                    enabled: true
                },

                legend: {
                    title: {
                        text: 'Hapiness score',
                        style: {
                            color: ( // theme
                                Highcharts.defaultOptions &&
                                Highcharts.defaultOptions.legend &&
                                Highcharts.defaultOptions.legend.title &&
                                Highcharts.defaultOptions.legend.title.style &&
                                Highcharts.defaultOptions.legend.title.style.color
                            ) || 'black'
                        }
                    },
                    align: 'left',
                    verticalAlign: 'bottom',
                    floating: true,
                    layout: 'vertical',
                    valueDecimals: 0,
                    backgroundColor: ( // theme
                        Highcharts.defaultOptions &&
                        Highcharts.defaultOptions.legend &&
                        Highcharts.defaultOptions.legend.backgroundColor
                    ) || 'rgba(255, 255, 255, 0.85)',
                    symbolRadius: 0,
                    symbolHeight: 14
                },

                colorAxis: {
                    dataClasses: [{
                        to: 3,
                        color: colors[0]
                    }, {
                        from: 3,
                        to: 4,
                        color: colors[1]
                    }, {
                        from: 4,
                        to: 5,
                        color: colors[2]
                    }, {
                        from: 5,
                        to: 6,
                        color: colors[3]
                    }, {
                        from: 6,
                        to: 7,
                        color: colors[4]
                    }, {
                        from: 7,
                        color: colors[5]
                    }]
                },

                plotOptions: {
                    series: {
                        events: {
                            click: function(e) {
                                showCountry(e);
                            }
                        },
                    }
                },

                series: [{
                    data: data,
                    joinBy: ['iso-a3', 'code'],
                    animation: true,
                    name: 'Hapiness score',
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    shadow: false
                }]
            });
        },
        error: function() {
            document.getElementById('containers').innerHTML = '<div class="loading">' +
                '<i class="icon-frown icon-large"></i> ' +
                'Error loading data from Google Spreadsheets' +
                '</div>';
        }
    });
}

function ordinal(n) {
    if (n.endsWith('11') || n.endsWith('12') || n.endsWith('13')) {
        return `${n}th`;
    }
    if (n.endsWith('1')) {
        return `${n}st`;
    }
    if (n.endsWith('2')) {
        return `${n}nd`;
    }
    if (n.endsWith('3')) {
        return `${n}rd`;
    }
    return `${n}th`;
}

function getColors(r, g, b, n, reverse = false) {
    colors = [];
    step = 1 / n;
    for (var i = 0; i < n; i++) {
        colors.push(`rgba(${r},${g},${b},${(i + 1) * step})`);
    }
    return reverse ? colors.reverse() : colors;
}

var learnMore = function() {
    let name = selected.point.name;
    let code = selected.point.code;
    window.location.replace(`${window.location.href}/${name}/${code}`);
};

function showCountry(e) {
    console.log(e);
    selected = e;
    var year = 2019;
    let name = e.point.name;
    let code = e.point.code;
    let rank = e.point.rank;
    $('#loading-info').html('');
    $('#panel-info').show();
    $('#country-name').html(name);
    $('#country-rank').html(ordinal(rank.toString()));
    $('#country-name-question').html(name);


    countryData = data.filter((country) => country.code == code);
    barchart(name, countryData[0].indicators);
}

function barchart(name, indicators) {
    Highcharts.chart('container-2', {
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [name],
            title: {
                text: null
            },
            className: "bar-x"
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
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
            data: [indicators[0]],
            color: "#cff09e"
        }, {
            name: 'Social support',
            data: [indicators[1]],
            color: "#a8dba8"
        }, {
            name: 'Life expectancy',
            data: [indicators[2]],
            color: "#79bd9a"
        }, {
            name: 'Freedom',
            data: [indicators[3]],
            color: "#3b8686"
        }, {
            name: 'Generosity',
            data: [indicators[4]],
            color: "#0b486b"
        }, {
            name: 'Corruption',
            data: [indicators[5]],
            color: "#606060"
        }]
    });
}