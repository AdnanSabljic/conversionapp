document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Conversion functionality
    setupConversion('weight');
    setupConversion('length');
    setupConversion('temperature');
    
    function setupConversion(type) {
        const convertBtn = document.getElementById(`${type}-convert`);
        const resultDiv = document.getElementById(`${type}-result`);
        
        convertBtn.addEventListener('click', async () => {
            const value = document.getElementById(`${type}-value`).value;
            const fromUnit = document.getElementById(`${type}-from`).value;
            const toUnit = document.getElementById(`${type}-to`).value;
            
            if (!value || isNaN(value)) {
                showResult(resultDiv, 'Please enter a valid number', true);
                return;
            }
            
            try {
                const response = await fetch('/convert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: type,
                        value: value,
                        fromUnit: fromUnit,
                        toUnit: toUnit
                    })
                });
                
                const data = await response.json();
                
                if (data.error) {
                    showResult(resultDiv, `Error: ${data.error}`, true);
                } else {
                    let unitSymbol = '';
                    if (type === 'temperature') {
                        if (toUnit === 'C') unitSymbol = '°C';
                        else if (toUnit === 'F') unitSymbol = '°F';
                        else if (toUnit === 'K') unitSymbol = 'K';
                    }
                    
                    showResult(
                        resultDiv, 
                        `Result: ${value} ${fromUnit} = ${data.result} ${toUnit}${unitSymbol}`,
                        false
                    );
                }
            } catch (error) {
                showResult(resultDiv, `Error: Could not connect to server`, true);
            }
        });
    }
    
    function showResult(element, message, isError) {
        element.textContent = message;
        element.style.display = 'block';
        
        if (isError) {
            element.classList.add('error');
        } else {
            element.classList.remove('error');
        }
    }
});
