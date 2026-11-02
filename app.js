let paginaActual = 'landing';
let historialPaginas = [];

function showPage(pageId, sinHistorial) {
    if (!sinHistorial && pageId !== paginaActual) {
        historialPaginas.push(paginaActual);
    }
    paginaActual = pageId;

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
    
    if (pageId === 'landing' || pageId === 'login' || pageId === 'register') {
        document.getElementById('navbar-normal').style.display = 'flex';
        document.getElementById('navbar-logged').style.display = 'none';
    } else {
        document.getElementById('navbar-normal').style.display = 'none';
        document.getElementById('navbar-logged').style.display = 'flex';
    }

    if (pageId === 'dashboard-arrendador') {
        setTimeout(showReminders, 1000);
    }
}

function volver() {
    let anterior = historialPaginas.pop();
    if (!anterior) anterior = 'landing';
    showPage(anterior, true);
}

function logout() {
    document.getElementById('navbar-normal').style.display = 'flex';
    document.getElementById('navbar-logged').style.display = 'none';
    showPage('landing');
}

function sendSMS() {
    const phone = document.getElementById('loginPhone').value;
    if (!phone || phone.length < 8) {
        alert('Ingresa un número válido');
        return;
    }
    document.getElementById('sendSmsBtn').style.display = 'none';
    document.getElementById('smsVerificationBox').style.display = 'block';
    setTimeout(() => {
        document.querySelector('.sms-code-input input').focus();
    }, 100);
}

function resendCode() {
    alert('Código reenviado');
}

function moveToNext(input, index) {
    if (input.value.length === 1) {
        const inputs = document.querySelectorAll('.sms-code-input input');
        if (index < inputs.length) inputs[index].focus();
    }
}

function handleLogin(e) {
    e.preventDefault();
    document.getElementById('navbar-normal').style.display = 'none';
    document.getElementById('navbar-logged').style.display = 'flex';
    showPage('role-selection');
}

function handleRegister(e) {
    e.preventDefault();
    showPage('photo-upload');
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadArea = document.getElementById('uploadArea');
            uploadArea.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            uploadArea.classList.add('has-image');
            document.getElementById('continueBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

function goToLiveness() {
    showPage('liveness');
    startCamera();
}

function startCamera() {
    const video = document.getElementById('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { video.srcObject = stream; })
            .catch(err => { console.log('Error:', err); });
    }
}

function completeVerification() {
    showPage('registro-exitoso');
}

function selectRole(role) {
    if (role === 'arrendatario') {
        showPage('dashboard-arrendatario');
    } else {
        showPage('dashboard-arrendador');
    }
}

function triggerFileInput(num) {
    document.getElementById('photo' + num).click();
}

function previewPhoto6(input, num) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const box = input.parentElement;
            box.innerHTML = `<img src="${e.target.result}" alt="Foto ${num}">`;
        };
        reader.readAsDataURL(file);
    }
}

function calculatePrices() {
    const daily = document.getElementById('dailyPrice').value;
    if (daily) {
        const weekly = Math.round(daily * 7 * 0.85);
        const monthly = Math.round(daily * 30 * 0.75);
        document.getElementById('weeklyPrice').value = weekly;
        document.getElementById('monthlyPrice').value = monthly;
    }
}

function showDashboardSection(section, element) {
    document.querySelectorAll('.dashboard-content-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    document.getElementById('dashboard-content-' + section).style.display = 'block';
    
    document.querySelectorAll('.sidebar-menu a').forEach(a => {
        a.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }

    const mainContent = document.getElementById('arrendador-main-content');
    const sectionContent = document.getElementById('dashboard-content-' + section);
    if (mainContent && sectionContent) {
        mainContent.innerHTML = '';
        mainContent.appendChild(sectionContent);
        sectionContent.style.display = 'block';
    }
}

function showRequestsTab(tab, btn) {
    document.querySelectorAll('.requests-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    document.getElementById('requests-nuevas-content').style.display = 'none';
    document.getElementById('requests-historial-content').style.display = 'none';
    document.getElementById('requests-futuros-content').style.display = 'none';
    
    document.getElementById('requests-' + tab + '-content').style.display = 'block';
}

function aceptarSolicitud(btn) {
    btn.textContent = 'Aceptado';
    btn.disabled = true;
    btn.style.background = '#28a745';
    
    const chatBtn = btn.parentElement.querySelector('.btn-chat');
    chatBtn.disabled = false;
    chatBtn.onclick = function() {
        showPage('chat');
    };
    
    showReminder('payment', 'Pago Pendiente', 'Carlos Mendoza debe realizar el pago en las próximas 24 horas', '24 horas');
}

function programarMantenimiento() {
    const auto = document.getElementById('mantenimientoAuto').value;
    const fecha = document.getElementById('fechaMantenimiento').value;
    const tipo = document.getElementById('tipoMantenimiento').value;
    
    if (!auto || !fecha) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    alert('Mantenimiento programado exitosamente');
    showReminder('maintenance', 'Mantenimiento Programado', `Tienes ${tipo.replace('_', ' ')} programado para el ${fecha}`, fecha);
}

function contactarSoporte() {
    alert('Contactando soporte...\n\nEmail: soporte@arriendoseguro.cl\nTeléfono: +56 2 1234 5678\nHorario: Lunes a Viernes 9:00 - 18:00');
}

function eliminarCuenta() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        alert('Cuenta eliminada. Redirigiendo...');
        logout();
    }
}

function showReminders() {
    setTimeout(() => {
        showReminder('payment', '💰 Pago Recibido', 'Has recibido $125.000 CLP por el arriendo de Toyota Corolla', 'Hace 2 horas');
    }, 2000);
    
    setTimeout(() => {
        showReminder('return', '🔄 Devolución Próxima', 'El Honda Civic debe ser devuelto mañana a las 18:00', 'Mañana 18:00');
    }, 5000);
    
    setTimeout(() => {
        showReminder('maintenance', '🔧 Mantenimiento Programado', 'Cambio de aceite del Toyota Corolla en 3 días', '15 Oct 2025');
    }, 8000);
    
    setTimeout(() => {
        showReminder('contract', '📄 Contrato por Firmar', 'Tienes un contrato pendiente de firma digital', 'Vence en 24h');
    }, 11000);
}

function showReminder(type, title, text, date) {
    const container = document.getElementById('remindersContainer');
    const reminder = document.createElement('div');
    reminder.className = `reminder-float-card ${type}`;
    reminder.innerHTML = `
        <div class="reminder-title">${title}</div>
        <div class="reminder-text">${text}</div>
        <div class="reminder-date">⏰ ${date}</div>
    `;
    container.appendChild(reminder);
    
    setTimeout(() => {
        reminder.style.opacity = '0';
        reminder.style.transform = 'translateX(100%)';
        setTimeout(() => reminder.remove(), 500);
    }, 10000);
}

function filterByCity(city) {
    console.log('Filtrando por ciudad:', city);
}

function handlePublicar(e) {
    e.preventDefault();
    alert('Auto publicado exitosamente');
    showPage('dashboard-arrendador');
}

function switchPriceTab(type, btn) {
    document.querySelectorAll('.pricing-tab').forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    showPage('landing', true);
});
