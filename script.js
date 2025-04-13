const input = document.getElementById('tareaInput');
const btn = document.getElementById('agregarBtn');
const lista = document.getElementById('listaTareas');

// Cargar tareas al iniciar
window.onload = () => {
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
  tareasGuardadas.forEach(t => agregarTarea(t.texto, t.completada));
};

btn.addEventListener('click', () => {
  const texto = input.value.trim();
  if (texto !== '') {
    agregarTarea(texto, false);
    input.value = '';
  }
});

function agregarTarea(texto, completada) {
  const li = document.createElement('li');
  li.textContent = texto;
  if (completada) li.classList.add('completed');

  // Marcar como completada al hacer clic
  li.addEventListener('click', () => {
    li.classList.toggle('completed');
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
  });

  li.appendChild(btnBorrar);
  lista.appendChild(li);
  guardarTareas();
}

function guardarTareas() {
  const tareas = [];
  lista.querySelectorAll('li').forEach(li => {
    tareas.push({
      texto: li.childNodes[0].textContent,
      completada: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tareas', JSON.stringify(tareas));
}
