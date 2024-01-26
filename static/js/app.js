const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function BarGraph(sampleId) {
    console.log(`BarGraph(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data)
    
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h"
        };

        let array = [barData];

        let layout = {
            title: "Top 10 OTUs",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", array, layout);
    })
}

function BubbleGraph(sampleId) {
    console.log(`BubbleGraph(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data)

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let BubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let array = [BubbleData];

        let layout = {
            title: "Bacteria Cultures per sample",
            margin: {t: 30},
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", array, layout);
    })
}

function Dashboard() {
    console.log('Dashboard');

    let selector = d3.select('#selDataset');

    d3.json(url).then(data => {
        console.log('Here is the data');

        let sampleNames = data.names;
        console.log('Here are the sample names:', sampleNames);

        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i];
            selector.append('option').text(sampleId).property('value', sampleId);
        };

        let initialId = selector.property('value');
        console.log(`initialId = ${initialId}`);

        BarGraph(initialId);

        BubbleGraph(initialId);

        MetaData(initialId);

    });
}

Dashboard();

function MetaData(sampleId) {
    console.log(`MetaData(${sampleId})`)

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        console.log(metadata);

        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demographic = d3.select("#sample-metadata");

        demographic.html("");

        Object.entries(result).forEach(([key, value]) => {
            demographic.append("h6").text(`${key}: ${value}`);
        })
    });
}

function optionChanged(sampleId) {
    console.log(`optionChanged, new value: ${sampleId}`);

    BarGraph(sampleId);
    BubbleGraph(sampleId);
    MetaData(sampleId);
}

