document.addEventListener('DOMContentLoaded', () => {
    const btnTomar = document.getElementById('btn-tomar');
    const statusMessage = document.getElementById('status-message');
    const fechaHeader = document.getElementById('fecha-hoy');
    const calendarGrid = document.getElementById('calendar-grid');

    const hoy = new Date();
    const currentYear = hoy.getFullYear();
    const currentMonth = hoy.getMonth();
    const currentDay = hoy.getDate();
    
    // Clave única para hoy (ej: "2026-10-05")
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

    const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
    fechaHeader.textContent = hoy.toLocaleDateString('es-ES', opcionesFecha);

    let historial = JSON.parse(localStorage.getItem('historial_pastillas')) || {};

    if (historial[dateKey]) {
        marcarComoTomada();
    } else {
        btnTomar.addEventListener('click', () => {
            // Guardar en el celular
            historial[dateKey] = true;
            localStorage.setItem('historial_pastillas', JSON.stringify(historial));
            marcarComoTomada();
            renderCalendar(); 
            
            // Avisar a OneSignal para detener notificaciones
            if (window.OneSignalDeferred) {
                window.OneSignalDeferred.push(function(OneSignal) {
                    OneSignal.User.addTag("estado_hoy", "tomada");
                    console.log("Aviso enviado a OneSignal: Pastilla tomada");
                });
            }
        });
    }

    function marcarComoTomada() {
        btnTomar.style.display = 'none';
        statusMessage.textContent = "¡Perfecto! Ya tomaste tu pastilla hoy 🌸";
        statusMessage.style.color = "#4CAF50";
    }

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = i;

            const checkKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            if (i > currentDay) {
                dayDiv.classList.add('future');
            } else if (i === currentDay) {
                if (historial[checkKey]) dayDiv.classList.add('taken');
            } else {
                if (historial[checkKey]) {
                    dayDiv.classList.add('taken');
                } else {
                    dayDiv.classList.add('missed');
                }
            }
            calendarGrid.appendChild(dayDiv);
        }
    }

    renderCalendar();
});