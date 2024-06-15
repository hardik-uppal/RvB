async function fetchGPT35Data(city) {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_API_KEY`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `Provide real estate investment insights for ${city}. Include:
1. Current market trends.
2. Average property price.
3. Average rental yield.
4. Investment advice.`,
            max_tokens: 150, // Adjust as needed
            temperature: 0.7
        })
    });
    const data = await response.json();
    return data.choices[0].text;
}

async function calculate() {
    const city = document.getElementById('city').value;
    const propertyValue = parseFloat(document.getElementById('propertyValue').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const mortgageRate = parseFloat(document.getElementById('mortgageRate').value);
    const mortgageTerm = parseInt(document.getElementById('mortgageTerm').value);
    const propertyTaxesPercent = parseFloat(document.getElementById('propertyTaxesPercent').value);
    const insurance = parseFloat(document.getElementById('insurance').value);
    const maintenance = parseFloat(document.getElementById('maintenance').value);
    const strataFees = parseFloat(document.getElementById('strataFees').value);
    const miscellaneousExpenses = parseFloat(document.getElementById('miscellaneousExpenses').value);
    const appreciationRate = parseFloat(document.getElementById('appreciationRate').value);
    const rent = parseFloat(document.getElementById('rent').value);
    const rentInflationRate = parseFloat(document.getElementById('rentInflationRate').value);
    const investmentReturnRate = parseFloat(document.getElementById('investmentReturnRate').value);
    const periodYears = parseInt(document.getElementById('periodYears').value);

    const buyingResult = calculateTotalBuyingCost(propertyValue, downPayment, mortgageRate, mortgageTerm, propertyTaxesPercent, insurance, maintenance, strataFees, miscellaneousExpenses, appreciationRate, periodYears);
    const rentingCost = calculateTotalRentingCost(rent, rentInflationRate, periodYears);

    let suggestion = '';
    if (buyingResult.totalCost < rentingCost) {
        suggestion = 'Buy';
    } else {
        suggestion = 'Rent';
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p>Suggestion: ${suggestion}</p>
        <p>Total Buying Cost: $${buyingResult.totalCost.toFixed(2)}</p>
        <p>Total Renting Cost: $${rentingCost.toFixed(2)}</p>
        <p>Future Property Value: $${buyingResult.propertyValueFuture.toFixed(2)}</p>
    `;

    const gpt35Data = await fetchGPT35Data(city);
    const externalDataDiv = document.getElementById('externalData');
    externalDataDiv.innerHTML = `
        <h2>External Insights for ${city}</h2>
        <p>${gpt35Data}</p>
    `;
}

function calculateMonthlyMortgage(principal, annualRate, termYears) {
    const monthlyRate = annualRate / 12 / 100;
    const numPayments = termYears * 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}

function calculateTotalBuyingCost(propertyValue, downPayment, mortgageRate, mortgageTerm, propertyTaxesPercent, insurance, maintenance, strataFees, miscellaneousExpenses, appreciationRate, periodYears) {
    const principal = propertyValue - downPayment;
    const mortgagePayment = calculateMonthlyMortgage(principal, mortgageRate, mortgageTerm);
    const monthlyTaxes = (propertyTaxesPercent / 100 * propertyValue) / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyMaintenance = maintenance / 12;
    const monthlyStrataFees = strataFees;
    const monthlyMiscellaneousExpenses = miscellaneousExpenses;

    let totalCost = 0;
    let propertyValueFuture = propertyValue;
    for (let year = 0; year < periodYears; year++) {
        const annualCost = (mortgagePayment + monthlyTaxes + monthlyInsurance + monthlyMaintenance + monthlyStrataFees + monthlyMiscellaneousExpenses) * 12;
        totalCost += annualCost;
        propertyValueFuture *= (1 + appreciationRate / 100);
    }

    return { totalCost, propertyValueFuture };
}

function calculateTotalRentingCost(rent, rentInflationRate, periodYears) {
    let totalCost = 0;
    let rentFuture = rent;
    for (let year = 0; year < periodYears; year++) {
        totalCost += rentFuture * 12;
        rentFuture *= (1 + rentInflationRate / 100);
    }

    return totalCost;
}

// Fetch external data on page load
document.addEventListener('DOMContentLoaded', fetchExternalData);