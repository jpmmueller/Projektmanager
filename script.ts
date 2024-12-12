async function loadOptions(file: string, elementId: string): Promise<void> {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }
        const text = await response.text();
        const options = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const selectElement = document.getElementById(elementId) as HTMLSelectElement;
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            selectElement.appendChild(optionElement);
        });
    } catch (error) {
        console.error(error);
    }
}

async function initializeForm(): Promise<void> {
    await loadOptions('projects.txt', 'projectName');
    await loadOptions('clients.txt', 'clientName');
}

function generateTimesheet(): void {
    const projectName = (document.getElementById('projectName') as HTMLSelectElement).value;
    const clientName = (document.getElementById('clientName') as HTMLSelectElement).value;
    const startDate = new Date((document.getElementById('startDate') as HTMLInputElement).value);
    const endDate = new Date((document.getElementById('endDate') as HTMLInputElement).value);
    const timesheetDiv = document.getElementById('timesheet') as HTMLDivElement;

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
    html += `<button type="button" onclick="generateInvoice()">Rechnung erstellen</button>`;
    timesheetDiv.innerHTML = html;

    saveProjectData(projectName, clientName, startDate, endDate);
}

function saveProjectData(projectName: string, clientName: string, startDate: Date, endDate: Date): void {
    const data = {
        projectName,
        clientName,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function generateInvoice(): void {
    const rows = document.querySelectorAll('#timesheet table tr') as NodeListOf<HTMLTableRowElement>;
    let totalHours = 0;

    rows.forEach((row, index) => {
        if (index > 0) {
            const cells = row.cells as HTMLCollectionOf<HTMLTableCellElement>;
            const hours = parseFloat((cells[1].querySelector('input') as HTMLInputElement).value);
            totalHours += hours;
        }
    });

    const invoiceDiv = document.createElement('div');
    invoiceDiv.innerHTML = `<h2>Rechnung</h2><p>Gesamtarbeitsstunden: ${totalHours}</p>`;
    document.body.appendChild(invoiceDiv);
}

// Export functions to window object
(window as any).generateTimesheet = generateTimesheet;
(window as any).generateInvoice = generateInvoice;
(window as any).initializeForm = initializeForm;
