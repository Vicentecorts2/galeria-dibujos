const visor = document.getElementById('visor');
const visorImagen = document.getElementById('visor-imagen');
const visorTitulo = document.getElementById('visor-titulo');

// Al presionar cualquier dibujo, copia su imagen al visor y lo abre
document.querySelectorAll('.dibujo img').forEach(img => {
  img.addEventListener('click', () => {
    visorImagen.src = img.src;
    visorImagen.alt = img.alt;
    visorTitulo.textContent = img.alt;
    visor.showModal();
  });
});

// Al presionar en cualquier parte del visor, se cierra (Esc también lo cierra)
visor.addEventListener('click', () => {
  visor.close();
});
