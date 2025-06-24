/* ================ INTERRUPTOR================ */

const styleSwitcherToggler = document.querySelector(".style-switcher-toggler");

styleSwitcherToggler.addEventListener("click", () => {
  document.querySelector(".style-switcher").classList.toggle("open");
});

// hide style - switcher on scroll
window.addEventListener("scroll", () => {
  if (document.querySelector(".style-switcher").classList.contains("open")) {
    document.querySelector(".style-switcher").classList.remove("open");
  }
});

/* ================ TEMAS DE COLORES ================ */
const alternateStyle = document.querySelectorAll(".alternate-style");

function setActiveStyle(color) {
  localStorage.setItem("color", color);
  changeColor();
}

function changeColor() {
  alternateStyle.forEach((style) => {
    if (localStorage.getItem("color") === style.getAttribute("title")) {
      style.removeAttribute("disabled");
    } else {
      style.setAttribute("disabled", "true");
    }
  });
}
// checking if 'color' key exists
if (localStorage.getItem("color") !== null) {
  changeColor();
}

/* ================  TEMA CLARO Y OSCURO ================ */

const dayNight = document.querySelector(".day-night");

dayNight.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
  updateIcon();
});

function themeMode() {
  // checking if 'theme' key exists
  if (localStorage.getItem("theme") !== null) {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  }
  updateIcon();
}
themeMode();

function updateIcon() {
  if (document.body.classList.contains("dark")) {
    dayNight.querySelector("i").classList.remove("fa-moon");
    dayNight.querySelector("i").classList.add("fa-sun");
  } else {
    dayNight.querySelector("i").classList.remove("fa-sun");
    dayNight.querySelector("i").classList.add("fa-moon");
  }
}

/* ================  Logo light and dark ================ */
// let imagenLogo = "dark";

// function miFuncion() {
//   var logotipo = document.getElementById("logo-imagen");
//   if (imagenLogo == "dark") {
//     logotipo.src = "https://xn--robertio-j3a.com/img/logos/logo-light.png";
//     imagenLogo = "light";
//   } else {
//     logotipo.src = "https://xn--robertio-j3a.com/img/logos/logo-dark.png";
//     imagenLogo = "dark";
//   }
// }

//Esperamos a que la pagina este completamente cargada
/*
window.addEventListener('load',() => {
  var logotipo = document.getElementById('logo-imagen');
  var image_storage = window.localStorage; //Obtenemos el sessionStorage
  //Comprobamos si ya existe algun tema guardado en el sessionStorage y si existe usamos ese tema
  if (image_storage.getItem('theme')){
      logotipo.src = image_storage.getItem('theme_url');
  }
  //Le he puesto un id al boton para añadirle un listener (me parece mejor asi para no tener codigo javascript dentro del html)
  var boton = document.getElementById('boton');
  boton.addEventListener('click', () => {
      //Validamos el tema, si esta en dark al hacer click se hara light y viceversa
      if (image_storage.getItem('theme') == 'light'){
          logotipo.src = 'img/logos/logo_dark.png';
          image_storage.setItem('theme_url','img/logos/logo_dark.png');
          image_storage.setItem('theme','light');
      }else{
          logotipo.src = 'img/logos/logo_light.png';
          image_storage.setItem('theme_url','img/logos/logo_light.png');
          image_storage.setItem('theme','dark');
      }
  });
});
*/
window.addEventListener('load', () => {
  const logoImg = document.getElementById('logo-imagen'); // Obtenemos la imagen del logo
  const imageStorage = window.localStorage; // Obtenemos el almacenamiento local

  //Establecemos un tema por defecto si no hay uno guardado.
  let currentTheme = imageStorage.getItem('theme') || 'light'; 

  function setLogo() {
    const isDarkMode = currentTheme === 'dark'; // Comprobamos si el tema actual es oscuro
    const isMobile = window.innerWidth < 768; // Comprobamos si la pantalla es móvil (ajusta el punto de ruptura según sea necesario)

    let src; // Variable para almacenar la ruta de la imagen
    if (isMobile) {
      // Si es móvil, usamos los logos móviles
      src = isDarkMode ? 'img/logos/isologo_mobile_light.png' : 'img/logos/isologo_mobile_dark.png';
    } else {
      // Si no es móvil, usamos los logos normales
      src = isDarkMode ? 'img/logos/logo_light.png' : 'img/logos/logo_dark.png';
    }
    logoImg.src = src; // Cambiamos la ruta de la imagen del logo
  }

  // Se establece el logo inicial al cargar la página
  setLogo();

  //Escuchador de eventos para el cambio de tema
  const themeButton = document.getElementById('boton'); //Asumiendo que tienes un botón con el id 'boton'
  if (themeButton) {
      themeButton.addEventListener('click', () => {
          currentTheme = currentTheme === 'dark' ? 'light' : 'dark'; //Cambiamos el tema
          imageStorage.setItem('theme', currentTheme); //Guardamos el tema en el almacenamiento local
          setLogo(); //Actualizamos el logo
      });
  }

  // Escuchador de eventos para el cambio de tamaño de la ventana
  window.addEventListener('resize', setLogo); //Actualizamos el logo si cambia el tamaño de la ventana

});