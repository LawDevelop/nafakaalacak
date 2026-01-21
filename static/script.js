// Global state
let periods = [];
let editingPeriodId = null;

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount) + ' ₺';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const firstCard = document.querySelector('.card');
    firstCard.parentNode.insertBefore(alertDiv, firstCard);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Generate periods from form
async function generatePeriods() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const monthlyAmount = document.getElementById('monthlyAmount').value;
    const dueDay = document.getElementById('dueDay').value;
    const annualIncreaseRate = document.getElementById('annualIncreaseRate').value || 0;
    const increaseMonth = document.getElementById('increaseMonth').value;

    // Validation
    if (!startDate || !endDate || !monthlyAmount || !dueDay) {
        showAlert('Lütfen tüm zorunlu alanları doldurun!', 'error');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showAlert('Başlangıç tarihi bitiş tarihinden sonra olamaz!', 'error');
        return;
    }

    try {
        const response = await fetch('/generate_periods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                monthly_amount: parseFloat(monthlyAmount),
                due_day: parseInt(dueDay),
                annual_increase_rate: parseFloat(annualIncreaseRate),
                increase_month: parseInt(increaseMonth)
            })
        });

        const data = await response.json();

        if (data.success) {
            periods = data.periods;
            renderPeriodsTable();
            showAlert(`${periods.length} dönem başarıyla oluşturuldu!`, 'success');
            
            // Show step 2 and 3
            document.getElementById('step2').style.display = 'block';
            document.getElementById('step3').style.display = 'block';
            
            // Scroll to step 2
            document.getElementById('step2').scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Set default calculation end date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('calculationEndDate').value = today;
        } else {
            showAlert('Hata: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Bir hata oluştu: ' + error.message, 'error');
    }
}

// Render periods table
function renderPeriodsTable() {
    const tbody = document.getElementById('periodsTableBody');
    tbody.innerHTML = '';

    periods.forEach((period, index) => {
        const tr = document.createElement('tr');
        const interestRateDisplay = period.interest_rate !== null && period.interest_rate !== undefined 
            ? `%${period.interest_rate}` 
            : '<span style="color: #64748b;">Varsayılan</span>';
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatDate(period.due_date)}</td>
            <td class="editable-cell" data-field="amount" data-id="${period.id}">
                ${formatCurrency(period.amount)}
            </td>
            <td class="editable-cell" data-field="interest_rate" data-id="${period.id}">
                ${interestRateDisplay}
            </td>
            <td class="editable-cell" data-field="description" data-id="${period.id}">
                ${period.description}
            </td>
            <td class="action-buttons">
                <button class="btn-icon btn-edit" onclick="editPeriod(${period.id})" title="Düzenle">✏️</button>
                <button class="btn-icon btn-delete" onclick="deletePeriod(${period.id})" title="Sil">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update period count
    document.getElementById('periodCount').textContent = `Toplam ${periods.length} dönem`;

    // Add click handlers for editable cells
    document.querySelectorAll('.editable-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            makeEditable(this);
        });
    });
}

// Make cell editable
function makeEditable(cell) {
    const field = cell.dataset.field;
    const id = parseInt(cell.dataset.id);
    const period = periods.find(p => p.id === id);
    
    let currentValue;
    if (field === 'amount') {
        currentValue = period.amount;
    } else if (field === 'interest_rate') {
        currentValue = period.interest_rate !== null ? period.interest_rate : '';
    } else {
        currentValue = period.description;
    }

    const input = document.createElement('input');
    input.type = (field === 'amount' || field === 'interest_rate') ? 'number' : 'text';
    input.value = currentValue;
    input.step = (field === 'amount' || field === 'interest_rate') ? '0.01' : undefined;
    input.placeholder = field === 'interest_rate' ? 'Varsayılan' : '';
    
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', function() {
        saveCellEdit(cell, id, field, input.value);
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
}

// Save cell edit
function saveCellEdit(cell, id, field, newValue) {
    const period = periods.find(p => p.id === id);
    
    if (field === 'amount') {
        period.amount = parseFloat(newValue) || 0;
        cell.innerHTML = formatCurrency(period.amount);
    } else if (field === 'interest_rate') {
        if (newValue === '' || newValue === null) {
            period.interest_rate = null;
            cell.innerHTML = '<span style="color: #64748b;">Varsayılan</span>';
        } else {
            period.interest_rate = parseFloat(newValue);
            cell.innerHTML = `%${period.interest_rate}`;
        }
    } else {
        period.description = newValue;
        cell.innerHTML = newValue;
    }
}

// Edit period
function editPeriod(id) {
    const period = periods.find(p => p.id === id);
    
    document.getElementById('manualDueDate').value = period.due_date;
    document.getElementById('manualAmount').value = period.amount;
    document.getElementById('manualDescription').value = period.description;
    document.getElementById('manualInterestRate').value = period.interest_rate !== null ? period.interest_rate : '';
    
    editingPeriodId = id;
    document.getElementById('manualPeriodModal').style.display = 'block';
}

// Delete period
function deletePeriod(id) {
    if (confirm('Bu dönemi silmek istediğinizden emin misiniz?')) {
        periods = periods.filter(p => p.id !== id);
        
        // Reassign IDs
        periods.forEach((p, index) => {
            p.id = index + 1;
        });
        
        renderPeriodsTable();
        showAlert('Dönem silindi', 'success');
    }
}

// Add period manually
function addPeriodManual() {
    editingPeriodId = null;
    document.getElementById('manualDueDate').value = '';
    document.getElementById('manualAmount').value = '';
    document.getElementById('manualDescription').value = '';
    document.getElementById('manualInterestRate').value = '';
    document.getElementById('manualPeriodModal').style.display = 'block';
}

// Save manual period
function saveManualPeriod() {
    const dueDate = document.getElementById('manualDueDate').value;
    const amount = document.getElementById('manualAmount').value;
    const description = document.getElementById('manualDescription').value;
    const interestRate = document.getElementById('manualInterestRate').value;

    if (!dueDate || !amount) {
        showAlert('Tarih ve tutar zorunludur!', 'error');
        return;
    }

    if (editingPeriodId !== null) {
        // Edit existing period
        const period = periods.find(p => p.id === editingPeriodId);
        period.due_date = dueDate;
        period.amount = parseFloat(amount);
        period.description = description;
        period.interest_rate = interestRate ? parseFloat(interestRate) : null;
        showAlert('Dönem güncellendi', 'success');
    } else {
        // Add new period
        const newPeriod = {
            id: periods.length > 0 ? Math.max(...periods.map(p => p.id)) + 1 : 1,
            due_date: dueDate,
            amount: parseFloat(amount),
            description: description,
            interest_rate: interestRate ? parseFloat(interestRate) : null
        };
        periods.push(newPeriod);
        
        // Sort by date
        periods.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        
        // Reassign IDs
        periods.forEach((p, index) => {
            p.id = index + 1;
        });
        
        showAlert('Yeni dönem eklendi', 'success');
    }

    renderPeriodsTable();
    closeManualModal();
}

// Close manual modal
function closeManualModal() {
    document.getElementById('manualPeriodModal').style.display = 'none';
    editingPeriodId = null;
}

// Calculate interest
async function calculateInterest() {
    const calculationEndDate = document.getElementById('calculationEndDate').value;
    const interestRate = document.getElementById('interestRate').value;
    const dayBasis = document.querySelector('input[name="dayBasis"]:checked').value;

    // Validation
    if (!calculationEndDate || !interestRate) {
        showAlert('Lütfen tüm alanları doldurun!', 'error');
        return;
    }

    if (periods.length === 0) {
        showAlert('Önce dönemleri oluşturun!', 'error');
        return;
    }

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                periods: periods,
                calculation_end_date: calculationEndDate,
                interest_rate: parseFloat(interestRate),
                day_basis: parseInt(dayBasis)
            })
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data.results);
            showAlert('Hesaplama tamamlandı!', 'success');
            
            // Scroll to results
            setTimeout(() => {
                document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        } else {
            showAlert('Hata: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Bir hata oluştu: ' + error.message, 'error');
    }
}

// Display results
function displayResults(results) {
    const { details, summary } = results;

    // Update summary cards
    document.getElementById('totalPrincipal').textContent = formatCurrency(summary.total_principal);
    document.getElementById('totalInterest').textContent = formatCurrency(summary.total_interest);
    document.getElementById('grandTotal').textContent = formatCurrency(summary.grand_total);

    // Update calculation info
    document.getElementById('calculationInfo').innerHTML = `
        <div><strong>Hesaplama Tarihi:</strong> ${summary.calculation_date}</div>
        <div><strong>Varsayılan Faiz Oranı:</strong> %${summary.default_interest_rate}</div>
        <div><strong>Faize Esas Gün:</strong> ${summary.day_basis} gün</div>
        <div><strong>Dönem Sayısı:</strong> ${summary.period_count}</div>
    `;

    // Render results table
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';

    details.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.due_date_formatted}</td>
            <td>${item.description}</td>
            <td>${formatCurrency(item.principal)}</td>
            <td>${item.days}</td>
            <td>%${item.interest_rate}</td>
            <td class="highlight">${formatCurrency(item.interest)}</td>
            <td><strong>${formatCurrency(item.total)}</strong></td>
        `;
        tbody.appendChild(tr);
    });

    // Show results section
    document.getElementById('results').style.display = 'block';
}

// Print results
function printResults() {
    window.print();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('manualPeriodModal');
    if (event.target === modal) {
        closeManualModal();
    }
}

// Validate calendar
async function validateCalendar() {
    const resultsDiv = document.getElementById('validationResults');
    
    // Toggle: Eğer görünürse kapat
    if (resultsDiv.style.display === 'block') {
        resultsDiv.style.display = 'none';
        return;
    }

    const startYear = parseInt(document.getElementById('validationStartYear').value);
    const endYear = parseInt(document.getElementById('validationEndYear').value);

    if (startYear > endYear) {
        showAlert('Başlangıç yılı bitiş yılından büyük olamaz!', 'error');
        return;
    }

    try {
        const response = await fetch('/validate_calendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_year: startYear,
                end_year: endYear
            })
        });

        const data = await response.json();

        if (data.success) {
            displayValidationResults(data);
            showAlert(data.message, 'success');
        } else {
            showAlert('Hata: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Bir hata oluştu: ' + error.message, 'error');
    }
}

// Display validation results
function displayValidationResults(data) {
    const resultsDiv = document.getElementById('validationResults');
    
    // Summary
    let html = `
        <div class="validation-summary">
            <div class="validation-stat">
                <div class="validation-stat-label">Toplam Yıl</div>
                <div class="validation-stat-value">${data.total_years}</div>
            </div>
            <div class="validation-stat">
                <div class="validation-stat-label">Toplam Gün</div>
                <div class="validation-stat-value">${data.total_days.toLocaleString('tr-TR')}</div>
            </div>
            <div class="validation-stat">
                <div class="validation-stat-label">Artık Yıllar</div>
                <div class="validation-stat-value">${data.validation_results.filter(y => y.is_leap_year).length}</div>
            </div>
        </div>
        <div class="year-details">
    `;

    // Year details
    data.validation_results.forEach(year => {
        html += `
            <div class="year-card">
                <div class="year-card-header">
                    <div class="year-title">${year.year}</div>
                    <div>
                        ${year.is_leap_year ? '<span class="leap-year-badge">🌟 Artık Yıl</span>' : ''}
                        <span style="margin-left: 1rem; color: #64748b;">${year.total_days} Gün</span>
                    </div>
                </div>
                <div class="months-grid">
        `;

        year.months.forEach(month => {
            // Tarihleri parse et ve gün isimlerini bul
            const firstDate = new Date(month.first_day.split('.').reverse().join('-'));
            const lastDate = new Date(month.last_day.split('.').reverse().join('-'));
            const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
            const firstDayName = dayNames[firstDate.getDay()];
            const lastDayName = dayNames[lastDate.getDay()];
            
            html += `
                <div class="month-item">
                    <div class="month-name">${month.month}</div>
                    <div class="month-info">${month.days} gün</div>
                    <div class="month-info">Başlangıç: ${month.first_day} (${firstDayName})</div>
                    <div class="month-info">Bitiş: ${month.last_day} (${lastDayName})</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>';
    
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
}

// Export to CSV
function exportToCSV() {
    if (!document.getElementById('results') || document.getElementById('results').style.display === 'none') {
        showAlert('Önce hesaplama yapmalısınız!', 'error');
        return;
    }

    const table = document.getElementById('resultsTable');
    let csv = [];
    
    // Header
    const headers = [];
    table.querySelectorAll('thead th').forEach(th => {
        headers.push(th.textContent);
    });
    csv.push(headers.join(','));
    
    // Rows
    table.querySelectorAll('tbody tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push('"' + td.textContent.replace(/"/g, '""') + '"');
        });
        csv.push(row.join(','));
    });
    
    // Summary
    csv.push('');
    csv.push('Özet Bilgiler');
    csv.push('"Toplam Anapara","' + document.getElementById('totalPrincipal').textContent + '"');
    csv.push('"Toplam Faiz","' + document.getElementById('totalInterest').textContent + '"');
    csv.push('"Genel Toplam","' + document.getElementById('grandTotal').textContent + '"');
    
    // Download
    const csvContent = '\uFEFF' + csv.join('\n'); // UTF-8 BOM for Turkish characters
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nafaka_hesaplama_' + new Date().toISOString().split('T')[0] + '.csv';
    link.click();
    
    showAlert('CSV dosyası indirildi!', 'success');
}

// Export to Excel (Gerçek Excel dosyası - openpyxl ile)
async function exportToExcel() {
    if (!document.getElementById('results') || document.getElementById('results').style.display === 'none') {
        showAlert('Önce hesaplama yapmalısınız!', 'error');
        return;
    }

    try {
        // Collect data
        const resultsData = {
            summary: {
                total_principal: document.getElementById('totalPrincipal').textContent,
                total_interest: document.getElementById('totalInterest').textContent,
                grand_total: document.getElementById('grandTotal').textContent
            },
            details: []
        };

        // Get table data
        const tbody = document.getElementById('resultsTableBody');
        tbody.querySelectorAll('tr').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            resultsData.details.push({
                sira: cells[0].textContent,
                tarih: cells[1].textContent,
                aciklama: cells[2].textContent,
                anapara: cells[3].textContent,
                gun: cells[4].textContent,
                faiz_orani: cells[5].textContent,
                faiz: cells[6].textContent,
                toplam: cells[7].textContent
            });
        });

        const response = await fetch('/generate_excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resultsData)
        });

        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'nafaka_hesaplama_' + new Date().toISOString().split('T')[0] + '.xlsx';
            link.click();
            showAlert('Excel dosyası indirildi!', 'success');
        } else {
            showAlert('Excel oluşturulurken hata oluştu!', 'error');
        }
    } catch (error) {
        showAlert('Bir hata oluştu: ' + error.message, 'error');
    }
}

// Export to PDF
async function exportToPDF() {
    if (!document.getElementById('results') || document.getElementById('results').style.display === 'none') {
        showAlert('Önce hesaplama yapmalısınız!', 'error');
        return;
    }

    try {
        // Collect data
        const resultsData = {
            summary: {
                total_principal: document.getElementById('totalPrincipal').textContent,
                total_interest: document.getElementById('totalInterest').textContent,
                grand_total: document.getElementById('grandTotal').textContent,
                calculation_info: document.getElementById('calculationInfo').textContent
            },
            details: []
        };

        // Get table data
        const tbody = document.getElementById('resultsTableBody');
        tbody.querySelectorAll('tr').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            resultsData.details.push({
                sira: cells[0].textContent,
                tarih: cells[1].textContent,
                aciklama: cells[2].textContent,
                anapara: cells[3].textContent,
                gun: cells[4].textContent,
                faiz_orani: cells[5].textContent,
                faiz: cells[6].textContent,
                toplam: cells[7].textContent
            });
        });

        const response = await fetch('/generate_pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resultsData)
        });

        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'nafaka_hesaplama_' + new Date().toISOString().split('T')[0] + '.pdf';
            link.click();
            showAlert('PDF dosyası indirildi!', 'success');
        } else {
            showAlert('PDF oluşturulurken hata oluştu!', 'error');
        }
    } catch (error) {
        showAlert('Bir hata oluştu: ' + error.message, 'error');
    }
}

// Set default date to today on page load
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Set end date to today by default
    const endDateInput = document.getElementById('endDate');
    if (endDateInput) {
        endDateInput.value = today;
    }
    
    // Set calculation end date to today by default
    const calcEndDateInput = document.getElementById('calculationEndDate');
    if (calcEndDateInput) {
        calcEndDateInput.value = today;
    }
});
