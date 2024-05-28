document.addEventListener('DOMContentLoaded', function() {
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const apiUrlInput = document.getElementById('apiUrl');
    const responseTimeText = document.getElementById('responseTimeText');
    const responseText = document.getElementById('responseText');
    const errorRateText = document.getElementById('errorRateText');

    fetchDataBtn.addEventListener('click', function() {
        const apiUrl = apiUrlInput.value;
        if (apiUrl) {
            const startTime = performance.now();
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data from API. HTTP status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const endTime = performance.now();
                    const duration = (endTime - startTime).toFixed(2);
                    responseTimeText.textContent = `${duration} ms`;

                    if (!data || typeof data !== 'object') {
                        throw new Error('Invalid data format: data is not an object');
                    }

                    displayData(data);
                })
                .catch(error => {
                    console.error('Error fetching or processing data:', error);
                    alert('Failed to fetch or process data from the provided API. Please check the URL and try again.');
                });
        } else {
            alert('Please enter a valid API URL');
        }
    });

    function displayData(data) {
        responseText.textContent = JSON.stringify(data, null, 2);

        if (data.errorRate !== undefined) {
            errorRateText.textContent = `${data.errorRate}%`;
        } else {
            errorRateText.textContent = 'No error rate data available';
        }
    }
});
