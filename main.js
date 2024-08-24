document.addEventListener('DOMContentLoaded', function () {
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const apiUrlInput = document.getElementById('apiUrl');
    const responseTimeText = document.getElementById('responseTimeText');
    const responseText = document.getElementById('responseText');
    const errorRateText = document.getElementById('errorRateText');
    const downloadJsonBtn = document.getElementById('downloadJsonBtn');
    const confirmDownloadBtn = document.getElementById('confirmDownloadBtn');
    const downloadModal = new bootstrap.Modal(document.getElementById('downloadModal'));

    let jsonData = null;

    fetchDataBtn.addEventListener('click', function () {
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

                    jsonData = data;
                    responseText.textContent = JSON.stringify(data, null, 2);

                    if (data.errorRate !== undefined) {
                        errorRateText.textContent = `${data.errorRate}%`;
                    } else {
                        errorRateText.textContent = 'No error rate data available';
                    }
                })
                .catch(error => {
                    console.error('Error fetching or processing data:', error);
                    alert('Failed to fetch or process data from the provided API. Please check the URL and try again.');
                });
        } else {
            alert('Please enter a valid API URL');
        }
    });

    downloadJsonBtn.addEventListener('click', function () {
        if (jsonData) {
            downloadModal.show();
        } else {
            alert('No data available to download');
        }
    });

    confirmDownloadBtn.addEventListener('click', function () {
        downloadJsonAsFile(jsonData);
        downloadModal.hide();
    });

    function downloadJsonAsFile(data) {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'response_data.json';
        link.click();
        URL.revokeObjectURL(url);
    }
});
