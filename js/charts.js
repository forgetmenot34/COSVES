const dashboardChart = document.getElementById('dashboardChart');

if(dashboardChart){

    new Chart(dashboardChart, {
        type: 'bar',

        data: {
            labels: ['Cloud Storage', 'On-Premise'],

            datasets: [{
                label: 'Upload Speed',

                data: [
                    uploadResults.cloud,
                    uploadResults.onPremise
                ]
            }]
        }
    });
}

const comparisonChart = document.getElementById('comparisonChart');

if(comparisonChart){

    new Chart(comparisonChart, {
        type: 'bar',

        data: {
            labels: ['Upload', 'Download'],

            datasets: [
                {
                    label: 'Cloud Storage',

                    data: [
                        uploadResults.cloud,
                        downloadResults.cloud
                    ]
                },

                {
                    label: 'On-Premise',

                    data: [
                        uploadResults.onPremise,
                        downloadResults.onPremise
                    ]
                }
            ]
        }
    });
}