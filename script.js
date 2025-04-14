const input = document.getElementById('tareaInput');
const btn = document.getElementById('agregarBtn');
const lista = document.getElementById('listaTareas');
const noTareas = document.getElementById('noTareas');

// Botones de filtro
const todosBtn = document.getElementById('todosBtn');
const completadasBtn = document.getElementById('completadasBtn');
const pendientesBtn = document.getElementById('pendientesBtn');

// Cargar tareas al iniciar
window.onload = () => {
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
  tareasGuardadas.forEach(t =>
    agregarTarea(t.texto, t.completada, t.vencimiento)
  );
  verificarTareas();
};


// Event listener para agregar tarea
btn.addEventListener('click', () => {
  const texto = input.value.trim();
  const vencimiento = document.getElementById('vencimientoInput').value;

  if (texto !== '') {
    agregarTarea(texto, false, vencimiento || null);
    input.value = '';
    document.getElementById('vencimientoInput').value = '';
    verificarTareas();
  }
});


// Función para agregar tarea
function agregarTarea(texto, completada, vencimiento = null) {
  const li = document.createElement('li');
  li.textContent = texto;
  if (completada) li.classList.add('completed');

  // Mostrar vencimiento si existe
  if (vencimiento) {
    const vencimientoEl = document.createElement('small');
    vencimientoEl.textContent = `Vence: ${new Date(vencimiento).toLocaleString()}`;
    vencimientoEl.style.marginLeft = '10px';
    vencimientoEl.style.fontStyle = 'italic';
    li.appendChild(vencimientoEl);

// Marcar como vencida solo si NO está completada y pasó la fecha
const vencida = new Date(vencimiento) < new Date();
if (vencida && !completada) {
  li.classList.add('vencida');
}
const ahora = new Date();
const tiempoRestante = new Date(vencimiento) - ahora;

if (!completada && tiempoRestante > 0 && tiempoRestante <= 30 * 60 * 1000) {
  li.classList.add('por-vencer');
}


    li.setAttribute('data-vencimiento', vencimiento);
  }

  // Marcar como completada al hacer clic
  li.addEventListener('click', () => {
    li.classList.toggle('completed');

    if (li.classList.contains('completed')) {
      li.classList.remove('vencida');
      li.classList.remove('por-vencer');
    } else {
      // Si vuelve a pendiente y está vencida, volver a marcarla como vencida
      const vencimiento = li.getAttribute('data-vencimiento');
      if (vencimiento && new Date(vencimiento) < new Date()) {
        li.classList.add('vencida');
      }
    }
  
    guardarTareas();
  });
  

  // Botón eliminar
  const btnBorrar = document.createElement('button');
  btnBorrar.textContent = '🗑️';
  btnBorrar.style.marginLeft = '10px';
  btnBorrar.addEventListener('click', e => {
    e.stopPropagation();
    li.remove();
    guardarTareas();
    verificarTareas();
  });

  li.appendChild(btnBorrar);
  lista.appendChild(li);
  guardarTareas();
  verificarTareas();
}


// Función para guardar tareas en localStorage
function guardarTareas() {
  const tareas = [];
  lista.querySelectorAll('li').forEach(li => {
    if (li !== noTareas) {
      tareas.push({
        texto: li.firstChild.textContent.trim(),
        completada: li.classList.contains('completed'),
        vencimiento: li.getAttribute('data-vencimiento')
      });
    }
  });
  localStorage.setItem('tareas', JSON.stringify(tareas));
}


// Función para verificar si hay tareas y mostrar el mensaje correspondiente
function verificarTareas() {
  const tareas = lista.querySelectorAll('li');
  const tareasReales = Array.from(tareas).filter(li => li !== noTareas); // Filtrar las tareas reales
  if (tareasReales.length > 0) { // Si hay tareas reales, ocultar el mensaje
    noTareas.style.display = 'none';
  } else {
    noTareas.style.display = 'block'; // Mostrar el mensaje si no hay tareas
  }
}

// Función para filtrar tareas
function filtrarTareas(filtro) {
  const tareas = lista.querySelectorAll('li');
  tareas.forEach(tarea => {
    const completada = tarea.classList.contains('completed');
    switch (filtro) {
      case 'todos':
        tarea.style.display = 'flex'; // Mostrar todas las tareas
        break;
      case 'completadas':
        tarea.style.display = completada ? 'flex' : 'none'; // Mostrar solo completadas
        break;
      case 'pendientes':
        tarea.style.display = completada ? 'none' : 'flex'; // Mostrar solo pendientes
        break;
    }
  });
}

// Eventos de los botones de filtro
todosBtn.addEventListener('click', () => filtrarTareas('todos'));
completadasBtn.addEventListener('click', () => filtrarTareas('completadas'));
pendientesBtn.addEventListener('click', () => filtrarTareas('pendientes'));
