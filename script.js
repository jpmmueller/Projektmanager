var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function loadOptions(file, elementId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, options, selectElement_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(file)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to load ".concat(file));
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    options = text.split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line.length > 0; });
                    selectElement_1 = document.getElementById(elementId);
                    options.forEach(function (option) {
                        var optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.text = option;
                        selectElement_1.appendChild(optionElement);
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function initializeForm() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadOptions('projects.txt', 'projectName')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadOptions('clients.txt', 'clientName')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function generateTimesheet() {
    var projectName = document.getElementById('projectName').value;
    var clientName = document.getElementById('clientName').value;
    var startDate = new Date(document.getElementById('startDate').value);
    var endDate = new Date(document.getElementById('endDate').value);
    var timesheetDiv = document.getElementById('timesheet');
    if (startDate > endDate) {
        alert('Das Startdatum muss vor dem Enddatum liegen.');
        return;
    }
    var html = "<h2>Zeiterfassung f\u00FCr ".concat(projectName, "</h2>");
    html += "<p>Kunde: ".concat(clientName, "</p>");
    html += "<table border=\"1\"><tr><th>Datum</th><th>Arbeitsstunden</th></tr>";
    for (var d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        var dateStr = d.toISOString().split('T')[0];
        html += "<tr><td>".concat(dateStr, "</td><td><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\" value=\"0\"></td></tr>");
    }
    html += "</table>";
    html += "<button type=\"button\" onclick=\"generateInvoice()\">Rechnung erstellen</button>";
    timesheetDiv.innerHTML = html;
    saveProjectData(projectName, clientName, startDate, endDate);
}
function saveProjectData(projectName, clientName, startDate, endDate) {
    var data = {
        projectName: projectName,
        clientName: clientName,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = "".concat(projectName, "_data.json");
    a.click();
    URL.revokeObjectURL(url);
}
function generateInvoice() {
    var rows = document.querySelectorAll('#timesheet table tr');
    var totalHours = 0;
    rows.forEach(function (row, index) {
        if (index > 0) {
            var cells = row.cells;
            var hours = parseFloat(cells[1].querySelector('input').value);
            totalHours += hours;
        }
    });
    var invoiceDiv = document.createElement('div');
    invoiceDiv.innerHTML = "<h2>Rechnung</h2><p>Gesamtarbeitsstunden: ".concat(totalHours, "</p>");
    document.body.appendChild(invoiceDiv);
}
// Export functions to window object
window.generateTimesheet = generateTimesheet;
window.generateInvoice = generateInvoice;
window.initializeForm = initializeForm;
