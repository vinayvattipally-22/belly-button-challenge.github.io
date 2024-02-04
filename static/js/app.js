// Get belly button data
const bellybutton = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let samples;
let metadata;

// Fetch data from the provided URL
d3.json(bellybutton)
    .then(data => {
        // Assign data.samples and data.metadata to the respective variables
        samples = data.samples;
        metadata = data.metadata;

        // Call the setupDropdown function
        const dropdown = d3.select("#selDataset");
        dropdown.selectAll("option")
            .data(metadata)
            .enter().append("option")
            .attr("value", d => d.id)
            .text(d => d.id);

        // Show -SELECT- as the default option
        dropdown.property("value", "SELECT");
                
    })
        
        function createBarChart(individualId) {
            // Check if samples is defined before proceeding
            if (!samples) {
                console.error("Samples data not loaded yet");
                return;
            }
            
            // Filter the data for the selected individual
            const selectedSample = samples.find(sample => sample.id === individualId);
        
            // Sort the data in descending order based on sample_values
            const sortedData = selectedSample.sample_values.map((value, index) => ({
                value,
                otu_id: selectedSample.otu_ids[index],
                label: selectedSample.otu_labels[index]
            })).sort((a, b) => b.value - a.value);
        
            // Extract the top 10 values for the bar chart
            const top10Values = sortedData.slice(0, 10).map(item => item.value);
            const top10Labels = sortedData.slice(0, 10).map(item => `OTU ${item.otu_id}`);
            const top10HoverText = sortedData.slice(0, 10).map(item => item.label);
        
            // Create the bar chart
            const trace = {
                x: top10Values,
                y: top10Labels,
                type: "bar",
                orientation: "h",
                text: top10HoverText,
            };
        
            const layout = {
                title: "Top 10 OTUs",
                yaxis: {
                    autorange: "reversed",
                },
            };
        
            Plotly.newPlot("bar", [trace], layout);
        }

    function createBubbleChart(individualId) {
        // Check if samples is defined before proceeding
        if (!samples) {
            console.error("Samples data not loaded yet");
            return;
        }
    // Filter the data for the selected individual
        const selectedSample = samples.find(sample => sample.id === individualId);
    
    // adjust the bubble sizes
    const bubbleSizeMultiplier = 0.5; // You can adjust this value
    const adjustedBubbleSizes = selectedSample.sample_values.map(value => value * bubbleSizeMultiplier);
    // Create the bubble chart
        const trace = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            mode: "markers",
            marker: {
                size: adjustedBubbleSizes,
                color: selectedSample.otu_ids,
                colorscale: "Viridis",
                opacity: 0.6,
            },
            text: selectedSample.otu_labels,
        };

        const layout = {
            title: "Belly Button Biodiversity Bubble Chart",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" },
        };

        Plotly.newPlot("bubble", [trace], layout);
    }

    function displayMetadata(individualId) {
        // Check if metadata is defined before proceeding
        if (!metadata) {
            console.error("Metadata not loaded yet");
            return;
        }
        // Filter the data for the selected individual
        const selectedMetadata = metadata.find(item => item.id === parseInt(individualId));

        // Clear previous metadata
        const metadataDiv = d3.select("#sample-metadata");
        metadataDiv.html("");

        // Display each key-value pair from the metadata
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    }

    // Event listener for dropdown change
    function optionChanged(selectedValue) {
        // Check if samples and metadata are defined before proceeding
        if (!samples || !metadata) {
            console.error("Data not loaded yet");
            return;
        }
        // Update charts and metadata based on the selected individual
        createBarChart(selectedValue);
        createBubbleChart(selectedValue);
        displayMetadata(selectedValue);
    }
