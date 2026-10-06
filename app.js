document.addEventListener("DOMContentLoaded", () => {
  const btnTomar = document.getElementById("btn-tomar");
  const statusMessage = document.getElementById("status-message");
  const fechaHeader = document.getElementById("fecha-hoy");
  const calendarGrid = document.getElementById("calendar-grid");

  // Configuración de fechas
  const hoy = new Date();
  const currentYear = hoy.getFullYear();
  const currentMonth = hoy.getMonth();
  const currentDay = hoy.getDate();

  // Formato de clave para guardar en local (ej: "2026-10-05")
  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;

  // Mostrar fecha en texto (ej: "5 de octubre de 2026")
  const opcionesFecha = { day: "numeric", month: "long", year: "numeric" };
  fechaHeader.textContent = hoy.toLocaleDateString("es-ES", opcionesFecha);

  // Cargar historial de LocalStorage
  let historial = JSON.parse(localStorage.getItem("historial_pastillas")) || {};

  // 1. Revisar estado de HOY
  if (historial[dateKey]) {
    marcarComoTomada();
  } else {
    btnTomar.addEventListener("click", () => {
      // 1. Guardar localmente para el calendario
      historial[dateKey] = true;
      localStorage.setItem("historial_pastillas", JSON.stringify(historial));
      marcarComoTomada();
      renderCalendar();

      // 2. Avisarle a OneSignal para cancelar las notificaciones de hoy
      if (window.OneSignal) {
        window.OneSignalDeferred.push(function (OneSignal) {
          // Le enviamos la fecha de hoy. Ej: ultima_toma: "2026-10-05"
          OneSignal.User.addTag("ultima_toma", dateKey).then(() => {
            console.log("Notificaciones silenciadas exitosamente por hoy.");
          });
        });
      }
    });
  }

  function marcarComoTomada() {
    btnTomar.style.display = "none";
    statusMessage.textContent = "¡Perfecto! Ya tomaste tu pastilla hoy 🌸";
    statusMessage.style.color = "#4CAF50";
  }

  // 2. Generar el Calendario del Mes Actual
  function renderCalendar() {
    calendarGrid.innerHTML = ""; // Limpiar grilla
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.textContent = i;

      const checkKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      if (i > currentDay) {
        dayDiv.classList.add("future"); // Días futuros
      } else if (i === currentDay) {
        // Si es hoy, revisar si la tomó
        if (historial[checkKey]) dayDiv.classList.add("taken");
      } else {
        // Días pasados
        if (historial[checkKey]) {
          dayDiv.classList.add("taken");
        } else {
          dayDiv.classList.add("missed"); // No la registró ese día
        }
      }

      calendarGrid.appendChild(dayDiv);
    }
  }

  renderCalendar();
});
