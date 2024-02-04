//get the data from the API
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let gauge_samples;
let gauge_metadata;

// Fetch data from the provided URL
d3.json(url)
    .then(data => {
        // Assign data.samples and data.metadata to the respective variables
        gauge_samples = data.samples;
        gauge_metadata = data.metadata;

    
    })
        .catch(error => console.log(error));


        // Function to create and update Gauge Chart
        function createGaugeChart(wfreq) {
            
            var data = [
                {
                    type: "indicator",
                    mode: "gauge+number",
                    value: wfreq,
                    title: { text: "Belly Button Washing Frequency" },
                    gauge: {
                        axis: { range: [0, 9] },
                        steps: [
                            { range: [0, 1], color: "lightgray" },
                            { range: [1, 2], color: "gray" },
                            { range: [2, 3], color: "darkgray" },
                            { range: [3, 4], color: "lightyellow" },
                            { range: [4, 5], color: "yellow" },
                            { range: [5, 6], color: "lightgreen" },
                            { range: [6, 7], color: "green" },
                            { range: [7, 8], color: "lightorange" },
                            { range: [8, 9], color: "orange" }
                        ],
                        threshold: {
                            line: { color: "red", width: 4 },
                            thickness: 0.75,
                                value: wfreq
                        }
                    }
                }
            ];

            var layout = {
                width: 400,
                height: 300,
                margin: { t: 0, b: 0 }
            };

            Plotly.newPlot("gauge-container", data, layout);
        }

    
    
        // Function to update the Gauge Chart
        function updateGaugeChart(individualId) {
        // Check if gauge_metadata is defined before proceeding
            if (!gauge_metadata) {
            console.error("Metadata not loaded yet");
            return;
            }

            function optionChanged(selectedValue) {
                console.log("Dropdown changed, selected value:", selectedValue);
                
                // Update charts from app.js
                createBarChart(selectedValue);
                createBubbleChart(selectedValue);
                displayMetadata(selectedValue);
        
                // Update gauge chart from bonus.js
                updateGaugeChart(selectedValue);
            }
        
        // Find the selected individual's wfreq from metadata
        const selectedMetadata = gauge_metadata.find(item => item.id === parseInt(individualId));

        // Check if selectedMetadata is defined and wfreq is not null before accessing wfreq
        const wfreq = selectedMetadata && selectedMetadata.wfreq !== null ? selectedMetadata.wfreq : 0;

            // Update the value of the gauge chart
            createGaugeChart(wfreq);


}