// Load the data from a Google Spreadsheet
// https://docs.google.com/spreadsheets/d/1WBx3mRqiomXk_ks1a5sEAtJGvYukguhAkcCuRDrY1L0/pubhtml
//https://docs.google.com/spreadsheets/d/e/2PACX-1vRQWQg_yqG55pEYrTUYPNIXc8MAz4rntH2G0W0opqy36wM1HiRWbbwzQssFPvIvlGHYPqttrJxVVslk/pubhtml?gid=0&single=true
var data = [];
var doubleClicker = {
    clickedOnce: false,
    timer: null,
    timeBetweenClicks: 400
};

// call to reset double click timer
var resetDoubleClick = function() {
    clearTimeout(doubleClicker.timer);
    doubleClicker.timer = null;
    doubleClicker.clickedOnce = false;
};

// the actual callback for a double-click event


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

            // Initiate the chart
            Highcharts.mapChart('containers', {
                chart: {
                    map: 'custom/world',
                    borderWidth: 1
                },

                colors: ['rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
                    'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'
                ],

                title: {
                    text: 'Hapiness global index 2019 by country'
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
                        to: 3
                    }, {
                        from: 3,
                        to: 4
                    }, {
                        from: 4,
                        to: 5
                    }, {
                        from: 5,
                        to: 6
                    }, {
                        from: 6,
                        to: 7
                    }, {
                        from: 7
                    }]
                },

                plotOptions: {
                    series: {
                        events: {
                            click: function(e) {
                                if (doubleClicker.clickedOnce === true && doubleClicker.timer) {
                                    resetDoubleClick();
                                    ondbclick(e);
                                } else {
                                    doubleClicker.clickedOnce = true;
                                    doubleClicker.timer = setTimeout(function() {
                                        resetDoubleClick();
                                        showCountry(e);
                                    }, doubleClicker.timeBetweenClicks);
                                }
                            }
                        }
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

var ondbclick = function(e) {
    let name = e.point.name;
    let code = e.point.code;
    window.location.replace(`${window.location.href}/${name}/${code}`);
};

function showCountry(e) {
    console.log(e);
    var year = 2019;
    let name = e.point.name;
    let code = e.point.code;
    let rank = e.point.rank;
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
            }
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
            data: [indicators[0]]
        }, {
            name: 'Social support',
            data: [indicators[1]]
        }, {
            name: 'Life expectancy',
            data: [indicators[2]]
        }, {
            name: 'Freedom',
            data: [indicators[3]]
        }, {
            name: 'Generosity',
            data: [indicators[4]]
        }, {
            name: 'Corruption',
            data: [indicators[5]]
        }]
    });
}