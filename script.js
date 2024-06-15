function calculateMonthlyMortgage(principal, annualRate, termYears) {
    const monthlyRate = annualRate / 12 / 100;
    const numPayments = termYears * 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}

function calculateTotalBuyingCost(propertyValue, downPayment, mortgageRate, mortgageTerm, propertyTaxes, insurance, maintenance, appreciationRate, periodYears) {
    const principal = propertyValue - downPayment;
    const mortgagePayment = calculateMonthlyMortgage(principal, mortgageRate, mortgageTerm);
    const monthlyTaxes = propertyTaxes / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyMaintenance = maintenance / 12;

    let totalCost = 0;
    let propertyValueFuture = propertyValue;
    for (let year = 0; year < periodYears; year++) {
        const annualCost = (mortgagePayment + monthlyTaxes + monthlyInsurance + monthlyMaintenance) * 12;
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

function calculate() {
    const propertyValue = parseFloat(document.getElementById('propertyValue').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const mortgageRate = parseFloat(document.getElementById('mortgageRate').value);
    const mortgageTerm = parseInt(document.getElementById('mortgageTerm').value);
    const propertyTaxes = parseFloat(document.getElementById('propertyTaxes').value);
    const insurance = parseFloat(document.getElementById('insurance').value);
    const maintenance = parseFloat(document.getElementById('maintenance').value);
    const appreciationRate = parseFloat(document.getElementById('appreciationRate').value);
    const rent = parseFloat(document.getElementById('rent').value);
    const rentInflationRate = parseFloat(document.getElementById('rentInflationRate').value);
    const investmentReturnRate = parseFloat(document.getElementById('investmentReturnRate').value);
    const periodYears = parseInt(document.getElementById('periodYears').value);

    const buyingResult = calculateTotalBuyingCost(propertyValue, downPayment, mortgageRate, mortgageTerm, propertyTaxes, insurance, maintenance, appreciationRate, periodYears);
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
}