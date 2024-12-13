let projectNameSelect, clientNameSelect, mainCustomerSelect, startDateInput, endDateInput, generateButton;
let mainCustomers = {};

function setup() {
    noCanvas();

    // Create form elements
    createElement('label', 'Projektname:').parent('formContainer');
    projectNameSelect = createSelect().parent('formContainer');
    loadOptions('projects.txt', projectNameSelect);

    createElement('label', 'Kundenname:').parent('formContainer');
    clientNameSelect = createSelect().parent('formContainer');
    loadOptions('clients.txt', clientNameSelect);

    createElement('label', 'Auftraggeber:').parent('formContainer');
    mainCustomerSelect = createSelect().parent('formContainer');
    loadMainCustomers('auftraggeber.txt', mainCustomerSelect);

    createElement('label', 'Startdatum:').parent('formContainer');
    startDateInput = createInput('', 'date').parent('formContainer');

    createElement('label', 'Enddatum:').parent('formContainer');
    endDateInput = createInput('', 'date').parent('formContainer');

    generateButton = createButton('Zeiterfassung erstellen').parent('formContainer');
    generateButton.mousePressed(generateTimesheet);
}

function loadOptions(file, selectElement) {
    fetch(file)
        .then(response => response.text())
        .then(text => {
            const options = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            options.forEach(option => {
                selectElement.option(option);
            });
        })
        .catch(error => console.error('Error loading options:', error));
}

function loadMainCustomers(file, selectElement) {
    fetch(file)
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            lines.forEach(line => {
                const [name, ...addressParts] = line.split(',');
                const address = addressParts.join(',').trim();
                mainCustomers[name] = address;
                selectElement.option(name);
            });
        })
        .catch(error => console.error('Error loading main customers:', error));
}

function generateTimesheet() {
    const projectName = projectNameSelect.value();
    const clientName = clientNameSelect.value();
    const mainCustomer = mainCustomerSelect.value();
    const startDate = new Date(startDateInput.value());
    const endDate = new Date(endDateInput.value());
    const timesheetDiv = select('#timesheet');

    if (startDate > endDate) {
        alert('Das Startdatum muss vor dem Enddatum liegen.');
        return;
    }

    let html = `<h2>Zeiterfassung für ${projectName}</h2>`;
    html += `<p>Kunde: ${clientName}</p>`;
    html += `<table border="1"><tr><th>Datum</th><th>Arbeitsstunden</th></tr>`;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        html += `<tr><td>${dateStr}</td><td><input type="number" min="0" max="24" step="0.5" value="0"></td></tr>`;
    }

    html += `</table>`;
    html += `<button onclick="generateInvoice()">Rechnung erstellen</button>`;
    timesheetDiv.html(html);

    saveProjectData(projectName, clientName, mainCustomer, startDate, endDate);
}

function saveProjectData(projectName, clientName, mainCustomer, startDate, endDate) {
    const data = {
        projectName,
        clientName,
        mainCustomer,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = createA(url, `${projectName}_data.json`);
    a.attribute('download', `${projectName}_data.json`);
    a.html('Download Projektdaten');
    a.parent('timesheet');
}

function generateInvoice() {
    const rows = selectAll('#timesheet table tr');
    let totalHours = 0;

    rows.forEach((row, index) => {
        if (index > 0) {
            const hours = parseFloat(row.child()[1].child()[0].value());
            totalHours += hours;
        }
    });

    const mainCustomer = mainCustomerSelect.value();
    const address = mainCustomers[mainCustomer];

    const invoiceDiv = createDiv(`<h2>Rechnung</h2><p>Gesamtarbeitsstunden: ${totalHours}</p><p>Auftraggeber: ${mainCustomer}</p><p>Adresse: ${address}</p>`);
    invoiceDiv.parent('timesheet');
}
