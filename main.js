document.addEventListener('DOMContentLoaded', function() {
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const apiUrlInput = document.getElementById('apiUrl');
    const responseTimeLabel = document.getElementById('responseTimeLabel');
    const errorRateLabel = document.getElementById('errorRateLabel');

    fetchDataBtn.addEventListener('click', function() {
        const apiUrl = apiUrlInput.value;
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data from API. HTTP status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data || typeof data !== 'object') {
                        throw new Error('Invalid data format: data is not an object');
                    }
                    updateLabels(data);
                })
                .catch(error => {
                    console.error('Error fetching or processing data:', error);
                    alert('Failed to fetch or process data from the provided API. Please check the URL and try again.');
                });
        } else {
            alert('Please enter a valid API URL');
        }
    });

    function updateLabels(data) {
        if (!data || data.length === 0) {
            console.error('Invalid data format:', data);
            alert('Failed to parse data from the API response. Please check the data format and try again.');
            return;
        }
    
        responseTimeLabel.textContent = 'Response Time:';
        errorRateLabel.textContent = 'Error Rate:';
    
        data.forEach((item, index) => {
            const responseTimeItem = document.createElement('div');
            responseTimeItem.textContent = `#${index + 1}: ${JSON.stringify(item)}`;
            responseTimeLabel.appendChild(responseTimeItem);
    
            const responseCopyButton = createCopyButton(responseTimeItem.textContent);
            responseTimeItem.appendChild(responseCopyButton);
        });
    
        const errorRateItem = document.createElement('div');
        errorRateItem.textContent = JSON.stringify(data.errorRate);
        errorRateLabel.appendChild(errorRateItem);
    
        const errorRateCopyButton = createCopyButton(errorRateItem.textContent);
        errorRateItem.appendChild(errorRateCopyButton);
    }
    
    function createCopyButton(text) {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.classList.add('btn', 'btn-primary', 'btn-sm', 'ms-2');
        button.addEventListener('click', function() {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert('Copied to clipboard');
                })
                .catch(error => {
                    console.error('Error copying text to clipboard:', error);
                    alert('Failed to copy text to clipboard');
                });
        });
        return button;
    }                
});