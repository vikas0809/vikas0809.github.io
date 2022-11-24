function init() {
	// Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
})}

  // Fetch new data each time a new sample is selected
function optionChanged(newSample) {
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array and metadata array. 
    	var samples = data.samples;
      var metaData=data.metadata;
		 // 4. Create a variable that filters the samples for the object with the desired sample number.
     //sorted in descending format
		var resultArray = samples.filter(sampleObj => sampleObj.id == sample).sort((a,b) => b-a);
    // Create a variable that filters meadata for the object with desired id.
    var resultMetaData = metaData.filter(sampleObj => sampleObj.id == sample)[0];
		   //  5. Create a variable that holds the first sample in the array.
		var result = resultArray[0];
		// 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // and map them in descending order. 
		sample_vals=result.sample_values.slice(0,10).reverse();
		ids=result.otu_ids.slice(0,10).reverse();
		labels=result.otu_labels.slice(0,10).reverse();

  

    // 7. Create the yticks for the bar chart.
		var y=[];
		Object.values(ids).forEach(id => {
		  y.push("OTU "+id);
		});

		var data=[{
			x:sample_vals,
			y:y,
			type: "bar",
			orientation: 'h'
		}];
		var layout = {
		  title: "Top 10 Bacteria Culture Found",
		  xaxis: {title: "Sample Values" },
		  yaxis: {title: "OTU ids"},
      
		};

		Plotly.newPlot("bar", data, layout);

    var xVal=result.otu_ids;
    var yVal=result.sample_values;
    var textValues=result.otu_labels;

    // Create the trace for the bubble chart.
    var trace1 = {
      x: xVal,
      y: yVal,
      text: textValues,
      mode: 'markers',
      hoverinfo: "xVal+yVal+textValues",
      marker: {
        color: xVal,
        opacity: [0.8, 0.8, 0.6, 0.4],
        size: yVal,
        colorscale: "Earth"
      }
    };
    
    var data = [trace1];

    var layout = {
      title: 'Bacteria Culture per Sample',
      showlegend: false,
     
    };

    Plotly.newPlot('bubble', data, layout);

    
    var washFrequency=resultMetaData.wfreq;

    // Create data for gauge
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency,
        title: { text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week' },
        type: "indicator",
        mode: "gauge+number",
        
        gauge: {
          axis: { range: [0, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "darkgreen" }
          ],
          
        }
      }
    ];
    
    var layout = {margin: { t: 0, b: 0 } };
    
    Plotly.newPlot('gauge', data, layout);


	});	
  
}




// Initialize the dashboard
init();