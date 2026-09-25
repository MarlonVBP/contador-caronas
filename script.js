// Default Settings
const DEFAULT_SETTINGS = {
    fullPrice: 10,
    halfPrice: 5
};

// State
let settings = { ...DEFAULT_SETTINGS };
let data = {}; // Key: 'YYYY-MM-DD', Value: { fullCount, halfCount, discountAmount, discountReason, isClosing }
let currentDate = new Date();
let selectedDateStr = null;

// DOM Elements
const currentTotalEl = document.getElementById('current-total');
const lastClosingDateEl = document.getElementById('last-closing-date');
const calendarGridEl = document.getElementById('calendar-grid');
const currentMonthYearEl = document.getElementById('current-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsModal = document.getElementById('close-settings-modal');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const settingFullPrice = document.getElementById('setting-full-price');
const settingHalfPrice = document.getElementById('setting-half-price');

const dayModal = document.getElementById('day-modal');
const closeDayModal = document.getElementById('close-day-modal');
const selectedDateTitle = document.getElementById('selected-date-title');
const countFullEl = document.getElementById('count-full');
const countHalfEl = document.getElementById('count-half');
const discountAmountEl = document.getElementById('discount-amount');
const discountReasonEl = document.getElementById('discount-reason');
const isClosingCheckbox = document.getElementById('is-closing-checkbox');
const dayCalculatedTotalEl = document.getElementById('day-calculated-total');
const closingTotalBox = document.getElementById('closing-total-box');
const periodCalculatedTotalEl = document.getElementById('period-calculated-total');
const saveDayBtn = document.getElementById('save-day-btn');
const hintFullPrice = document.getElementById('hint-full-price');
const hintHalfPrice = document.getElementById('hint-half-price');

// Initialization
function init() {
    loadData();
    renderCalendar();
    updateSummary();
    setupEventListeners();
}

// Data Management
function loadData() {
    const storedSettings = localStorage.getItem('carpool_settings');
    if (storedSettings) {
        settings = JSON.parse(storedSettings);
    }
    const storedData = localStorage.getItem('carpool_data');
    if (storedData) {
        data = JSON.parse(storedData);
    }
}

function saveData() {
    localStorage.setItem('carpool_settings', JSON.stringify(settings));
    localStorage.setItem('carpool_data', JSON.stringify(data));
}

// Logic & Calculations
function getDayTotal(dateStr) {
    const d = data[dateStr];
    if (!d) return 0;
    const total = (d.fullCount * settings.fullPrice) + (d.halfCount * settings.halfPrice) - (d.discountAmount || 0);
    return total;
}

function getSortedDates() {
    return Object.keys(data).sort();
}

function updateSummary() {
    const dates = getSortedDates();
    const todayStr = getLocalISOString(new Date());
    let latestClosingDate = null;
    let balance = 0;

    // Find the latest closing date
    for (let i = dates.length - 1; i >= 0; i--) {
        if (data[dates[i]].isClosing) {
            latestClosingDate = dates[i];
            break;
        }
    }

    if (latestClosingDate === todayStr) {
        // If today is a closing day, show the total for this period
        let prevClosingDate = null;
        for (let i = dates.length - 1; i >= 0; i--) {
            if (dates[i] < latestClosingDate && data[dates[i]].isClosing) {
                prevClosingDate = dates[i];
                break;
            }
        }
        
        for (const dateStr of dates) {
            if ((!prevClosingDate || dateStr > prevClosingDate) && dateStr <= latestClosingDate) {
                balance += getDayTotal(dateStr);
            }
        }
    } else {
        // Calculate balance since latest closing
        for (const dateStr of dates) {
            if (!latestClosingDate || dateStr > latestClosingDate) {
                balance += getDayTotal(dateStr);
            }
        }
    }

    currentTotalEl.textContent = formatCurrency(balance);
    if (latestClosingDate) {
        lastClosingDateEl.textContent = formatDateBr(latestClosingDate);
    } else {
        lastClosingDateEl.textContent = 'Nenhum';
    }
}

function calculateClosingTotal(targetDateStr) {
    const dates = getSortedDates();
    let prevClosingDate = null;
    
    // Find previous closing date before targetDateStr
    for (let i = dates.length - 1; i >= 0; i--) {
        if (dates[i] < targetDateStr && data[dates[i]].isClosing) {
            prevClosingDate = dates[i];
            break;
        }
    }

    let total = 0;
    for (const dateStr of dates) {
        if ((!prevClosingDate || dateStr > prevClosingDate) && dateStr <= targetDateStr) {
            total += getDayTotal(dateStr);
        }
    }
    return total;
}

// Calendar Rendering
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    currentMonthYearEl.textContent = `${monthNames[month]} ${year}`;

    calendarGridEl.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const todayStr = getLocalISOString(new Date());

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = 'day-cell empty';
        calendarGridEl.appendChild(div);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const dateStr = getLocalISOString(d);
        const dayData = data[dateStr];

        const div = document.createElement('div');
        div.className = 'day-cell';
        if (dateStr === todayStr) div.classList.add('today');

        let html = `<span>${i}</span>`;
        let indicators = '';

        if (dayData && (dayData.fullCount > 0 || dayData.halfCount > 0 || dayData.discountAmount > 0 || dayData.isClosing)) {
            if (dayData.fullCount > 0 && dayData.halfCount > 0) {
                div.classList.add('has-data-both');
            } else if (dayData.fullCount > 0) {
                div.classList.add('has-data-full');
            } else if (dayData.halfCount > 0) {
                div.classList.add('has-data-half');
            } else {
                div.classList.add('has-data');
            }

            if (dayData.isClosing) div.classList.add('is-closing');
            
            indicators += '<div class="day-indicators">';
            if (dayData.fullCount > 0) indicators += '<div class="indicator ind-full"></div>';
            if (dayData.halfCount > 0) indicators += '<div class="indicator ind-half"></div>';
            if (dayData.discountAmount > 0) indicators += '<div class="indicator ind-discount"></div>';
            indicators += '</div>';
        }

        div.innerHTML = html + indicators;
        
        div.addEventListener('click', () => openDayModal(dateStr));
        
        calendarGridEl.appendChild(div);
    }
}

// Modal logic
function openDayModal(dateStr) {
    selectedDateStr = dateStr;
    const d = data[dateStr] || { fullCount: 0, halfCount: 0, discountAmount: '', discountReason: '', isClosing: false };
    
    selectedDateTitle.textContent = formatDateBr(dateStr);
    hintFullPrice.textContent = formatCurrency(settings.fullPrice);
    hintHalfPrice.textContent = formatCurrency(settings.halfPrice);

    countFullEl.textContent = d.fullCount || 0;
    countHalfEl.textContent = d.halfCount || 0;
    discountAmountEl.value = d.discountAmount || '';
    discountReasonEl.value = d.discountReason || '';
    isClosingCheckbox.checked = d.isClosing || false;

    updateDayModalTotals();

    dayModal.classList.add('active');
}

function updateDayModalTotals() {
    const full = parseInt(countFullEl.textContent) || 0;
    const half = parseInt(countHalfEl.textContent) || 0;
    const discount = parseFloat(discountAmountEl.value) || 0;
    const isClosing = isClosingCheckbox.checked;

    const dayTotal = (full * settings.fullPrice) + (half * settings.halfPrice) - discount;
    dayCalculatedTotalEl.textContent = formatCurrency(dayTotal);

    if (isClosing) {
        // Temporarily save to calculate correct closing total
        const tempData = { ...data };
        data[selectedDateStr] = {
            fullCount: full,
            halfCount: half,
            discountAmount: discount,
            isClosing: true
        };
        const closingTotal = calculateClosingTotal(selectedDateStr);
        periodCalculatedTotalEl.textContent = formatCurrency(closingTotal);
        closingTotalBox.style.display = 'block';
        data = tempData; // restore
    } else {
        closingTotalBox.style.display = 'none';
    }
}

function saveDay() {
    const full = parseInt(countFullEl.textContent) || 0;
    const half = parseInt(countHalfEl.textContent) || 0;
    const discount = parseFloat(discountAmountEl.value) || 0;
    const reason = discountReasonEl.value.trim();
    const isClosing = isClosingCheckbox.checked;

    if (full === 0 && half === 0 && discount === 0 && !isClosing) {
        delete data[selectedDateStr];
    } else {
        data[selectedDateStr] = {
            fullCount: full,
            halfCount: half,
            discountAmount: discount,
            discountReason: reason,
            isClosing: isClosing
        };
    }

    saveData();
    updateSummary();
    renderCalendar();
    dayModal.classList.remove('active');
}

// Event Listeners
function setupEventListeners() {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Settings
    settingsBtn.addEventListener('click', () => {
        settingFullPrice.value = settings.fullPrice;
        settingHalfPrice.value = settings.halfPrice;
        settingsModal.classList.add('active');
    });

    closeSettingsModal.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    saveSettingsBtn.addEventListener('click', () => {
        settings.fullPrice = parseFloat(settingFullPrice.value) || 0;
        settings.halfPrice = parseFloat(settingHalfPrice.value) || 0;
        saveData();
        updateSummary();
        renderCalendar();
        settingsModal.classList.remove('active');
    });

    // Day Modal
    closeDayModal.addEventListener('click', () => {
        dayModal.classList.remove('active');
    });

    document.getElementById('btn-dec-full').addEventListener('click', () => {
        let v = parseInt(countFullEl.textContent);
        if (v > 0) countFullEl.textContent = v - 1;
        updateDayModalTotals();
    });
    document.getElementById('btn-inc-full').addEventListener('click', () => {
        countFullEl.textContent = parseInt(countFullEl.textContent) + 1;
        updateDayModalTotals();
    });

    document.getElementById('btn-dec-half').addEventListener('click', () => {
        let v = parseInt(countHalfEl.textContent);
        if (v > 0) countHalfEl.textContent = v - 1;
        updateDayModalTotals();
    });
    document.getElementById('btn-inc-half').addEventListener('click', () => {
        countHalfEl.textContent = parseInt(countHalfEl.textContent) + 1;
        updateDayModalTotals();
    });

    discountAmountEl.addEventListener('input', updateDayModalTotals);
    isClosingCheckbox.addEventListener('change', updateDayModalTotals);

    saveDayBtn.addEventListener('click', saveDay);

    // Close modals on clicking outside
    [dayModal, settingsModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
}

// Utils
function getLocalISOString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDateBr(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Run
init();
