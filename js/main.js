/* ================ NAVEGACIÓN MENÚ ================ */

(() => {
  const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

  hamburgerBtn.addEventListener("click", showNavMenu);
  closeNavBtn.addEventListener("click", hideNavMenu);

  function showNavMenu() {
    navMenu.classList.add("open");
    bodyScrollingToggle();
  }

  function hideNavMenu() {
    navMenu.classList.remove("open");
    fadeOutEffect();
    bodyScrollingToggle();;
  }

  function fadeOutEffect() {
    document.querySelector(".fade-out-effect").classList.add("active");
    setTimeout(() => {
      document.querySelector(".fade-out-effect").classList.remove("active");
    }, 300)
  }

  function navigateToSection(hash) {
    if (!hash || hash === "#") hash = "#inicio";
    // deactivate existing active 'section'
    const activeSection = document.querySelector(".section.active");
    if (activeSection) {
      activeSection.classList.add("hide");
      activeSection.classList.remove("active");
    }
    // activate new 'section'
    const targetSection = document.querySelector(hash);
    if (targetSection) {
      targetSection.classList.add("active");
      targetSection.classList.remove("hide");
    } else {
      // Fallback to inicio if section not found
      navigateToSection("#inicio");
      return;
    }

    /* deactivate existing active navigation menu 'link-item' */
    document.querySelectorAll(".link-item.active").forEach((activeNavLink) => {
      activeNavLink.classList.add("outer-shadow", "hover-in-shadow");
      activeNavLink.classList.remove("active", "inner-shadow");
    });

    /* activate the new navigation menu 'link-item' */
    document.querySelectorAll(".link-item").forEach((item) => {
      if (hash === item.hash) {
        item.classList.add("active", "inner-shadow");
        item.classList.remove("outer-shadow", "hover-in-shadow");
      }
    });

    if (navMenu.classList.contains("open")) {
      // hide navigation menu
      hideNavMenu();
    } else {
      fadeOutEffect();
    }
  }

  // Handle initial page load
  window.addEventListener("DOMContentLoaded", () => {
    let path = window.location.pathname.split("/").pop();
    if (!path || path === "index.html" || path === "") path = "inicio";
    navigateToSection("#" + path);
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    let path = window.location.pathname.replace(/^\/|\/$/g, "");
    if (!path) path = "inicio";
    navigateToSection("#" + path);
  });

  // attach an event handler to document
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains('link-item')) {
      /* make sure event.target.hash has a value before overridding defaul behavior */
      if (event.target.hash !== "") {
        // prevent defaul anchor click behavior
        event.preventDefault();
        const hash = event.target.hash;
        const path = hash.substring(1);

        // update URL without #
        history.pushState(null, null, "/" + path);

        navigateToSection(hash);
      }
    }
  })

})();

/* ================ CONTROL DE MÚSICA ================ */
(() => {
  const musicBtn = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-music");

  if (musicBtn && audio) {
    const playMusic = () => {
      audio.play().then(() => {
        musicBtn.querySelector("i").classList.remove("fa-play");
        musicBtn.querySelector("i").classList.add("fa-pause");
        // Remove the interaction listeners once music starts
        document.removeEventListener("click", playMusic);
        document.removeEventListener("touchstart", playMusic);
      }).catch(err => {
        console.log("Autoplay bloqueado. Esperando interacción del usuario...");
      });
    };

    // Attempt to play on load
    window.addEventListener("load", playMusic);

    // Also play on first user interaction if blocked
    document.addEventListener("click", playMusic);
    document.addEventListener("touchstart", playMusic);

    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent document click from triggering playMusic again
      if (audio.paused) {
        audio.play().then(() => {
          musicBtn.querySelector("i").classList.remove("fa-play");
          musicBtn.querySelector("i").classList.add("fa-pause");
        });
      } else {
        audio.pause();
        musicBtn.querySelector("i").classList.remove("fa-pause");
        musicBtn.querySelector("i").classList.add("fa-play");
        // If the user manually stops it, we don't want interaction to restart it
        document.removeEventListener("click", playMusic);
        document.removeEventListener("touchstart", playMusic);
      }
    });
  }
})();

/* ================ NAVEGACIÓN MENÚ FIN ================ */

/* ================ SECCIÓN DE ACERCA ================ */

(() => {
  const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

  tabsContainer.addEventListener("click", (event) => {
    /* if event.target contains 'tab-item' class and not contains 'active' class */
    if (event.target.classList.contains("tab-item") &&
      !event.target.classList.contains("active")) {
      const target = event.target.getAttribute("data-target");
      // deactivate existing active 'tab-item'
      tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
      // activate new 'tab-item'
      event.target.classList.add("active", "outer-shadow");
      // deactivate existing active 'tab-content'
      aboutSection.querySelector(".tab-content.active").classList.remove("active");
      // activate new 'tab-content'
      aboutSection.querySelector(target).classList.add("active");
    }
  })
})();

function bodyScrollingToggle() {
  document.body.classList.toggle("hidden-scrolling");
}

/* ================ SECCIÓN DE ACERCA - FIN================ */

/* ================ SECCIÓN DE PORTAFOLIO (FILTRO Y VENTANA EMERGENTE) ================ */

(() => {

  const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close-btn"),
    projectDetailsContainer = popup.querySelector(".pp-project-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
  let itemIndex, slideIndex, screenshots;

  /* filter portfolio items */
  filterContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("filter-item") &&
      !event.target.classList.contains("active")) {
      // deactivate existing active 'filter-item'
      filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
      //activate new 'filter item'
      event.target.classList.add("active", "outer-shadow");
      const target = event.target.getAttribute("data-target");
      portfolioItems.forEach((item) => {
        const categories = item.getAttribute("data-category").split(" ");
        if (categories.includes(target) || target === 'all') {
          item.classList.remove("hide");
          item.classList.add("show");
        }
        else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      })
    }
  })

  portfolioItemsContainer.addEventListener("click", (event) => {
    if (event.target.closest(".portfolio-item-inner")) {
      const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
      //get the portfolio index
      itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
      screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
      // convert screenshots into array
      screenshots = screenshots.split(",");
      if (screenshots.length === 1) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      }
      else {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
      }
      slideIndex = 0;
      popupToggle();
      popupSlideshow();
      popupDetails();
    }
  })

  closeBtn.addEventListener("click", () => {
    popupToggle();
    if (projectDetailsContainer.classList.contains("active")) {
      popupDetailsToggle();
    }
  })

  function popupToggle() {
    popup.classList.toggle("open");
    bodyScrollingToggle();
  }

  function popupSlideshow() {
    const imgSrc = screenshots[slideIndex];
    const popupImg = popup.querySelector(".pp-img");
    // activate loader until the popupImg loaded
    popup.querySelector(".pp-loader").classList.add("active");
    popupImg.src = imgSrc;
    popupImg.onload = () => {
      // deactivate loader after the popupImg loaded
      popup.querySelector(".pp-loader").classList.remove("active");
    }
    popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " + screenshots.length;
  }

  // next slide
  nextBtn.addEventListener("click", () => {
    if (slideIndex === screenshots.length - 1) {
      slideIndex = 0;
    }
    else {
      slideIndex++;
    }
    popupSlideshow();
  })

  // prev slide
  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = screenshots.length - 1
    }
    else {
      slideIndex--;
    }
    popupSlideshow();
  })

  function popupDetails() {
    // if portfolio-item-details not exists
    if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
      projectDetailsBtn.style.display = "none";
      return; // end function execution
    }
    projectDetailsBtn.style.display = "block";
    // get the project details
    const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
    // set the project details
    projectDetailsContainer.innerHTML = details;
    // get the project title
    const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
    // set the project title
    popup.querySelector(".pp-title h2").innerHTML = title;
    // get the project category
    const category = portfolioItems[itemIndex].getAttribute("data-category");
    // set the project category
    popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");

    // Ensure details are open by default
    projectDetailsContainer.classList.add("active");
    projectDetailsContainer.style.maxHeight = ''; // Remove inline style to allow CSS to take over
    projectDetailsContainer.style.opacity = '';
    projectDetailsBtn.innerHTML = 'Ver menos detalles <i class="fas fa-minus"></i>';
  }


  projectDetailsBtn.addEventListener("click", () => {
    popupDetailsToggle();
  })

  function popupDetailsToggle() {
    if (projectDetailsContainer.classList.contains("active")) {
      projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
      projectDetailsBtn.querySelector("i").classList.add("fa-plus");
      projectDetailsContainer.classList.remove("active");
      projectDetailsContainer.style.maxHeight = 0 + "px";
      projectDetailsContainer.style.opacity = 0;
      projectDetailsBtn.innerHTML = 'Ver detalles del proyecto <i class="fas fa-plus"></i>';
    }
    else {
      projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
      projectDetailsBtn.querySelector("i").classList.add("fa-minus");
      projectDetailsContainer.classList.add("active");
      projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
      projectDetailsContainer.style.opacity = 1;
      projectDetailsBtn.innerHTML = 'Ver menos detalles <i class="fas fa-minus"></i>';
      popup.scrollTo(0, projectDetailsContainer.offsetTop);
    }
  }


})();

/* ================ SECCIÓN DE PORTAFOLIO (FILTRO Y VENTANA EMERGENTE) ================ */

/* ================ SECCIÓN DE TESTIMONIO (SLIDER) ================ */

// (() =>{

//   const sliderContainer = document.querySelector(".testi-slider-container"),
//   slides = sliderContainer.querySelectorAll(".testi-item"),
//   slideWidth = sliderContainer.offsetWidth,
//   prevBtn = document.querySelector(".testi-slider-nav .prev"),
//   nextBtn = document.querySelector(".testi-slider-nav .next");
//   activeSlide = sliderContainer.querySelector(".testi-item.active");
//   let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);

//   // set width of all slides
//   slides.forEach((slide) =>{
//     slide.style.width = slideWidth + "px";
//   })
//   // set width of sliderContainer
//   sliderContainer.style.width = slideWidth * slides.length + "px"; 

//   nextBtn.addEventListener("click", () =>{
//     if(slideIndex === slides.length-1){
//       slideIndex = 0;
//     }
//     else{
//       slideIndex++;
//     }
//     slider();
//    })

//    prevBtn.addEventListener("click", () =>{
//      if(slideIndex === 0){
//        slideIndex = slides.length-1;
//      }
//      else{
//        slideIndex--;
//      }
//      slider();
//     }) 

//     function slider(){
//      // deactivate existing active slides
//      sliderContainer.querySelector(".testi-item.active").classList.remove("active");
//      // activate new slide
//      slides[slideIndex].classList.add("active");
//      sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px"; 
//     }

//     slider();

// })();

/* ================ SECCIÓN DE TESTIMONIO (SLIDER) - FIN ================ */

/* ================ OCULTAR TODAS LAS SESSIONES EXCEPTO LAS ACTIVAS ================ */

(() => {

  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (!section.classList.contains("active")) {
      section.classList.add("hide");
    }
  })

})();

window.addEventListener("load", () => {
  // preloader
  document.querySelector(".preloader").classList.add("fade-out");
  setTimeout(() => {
    document.querySelector(".preloader").style.display = "none";
  }, 600)
});

/* ================ OCULTAR TODAS LAS SESSIONES EXCEPTO LAS ACTIVAS - FIN================ */

/* ================ SECCIÓN DE CONTACTO (VENTANA MODAL FORMULARIO) ================ */
/* ********** ContactForm ********** */


const $form = document.querySelector(".contact-form"),
  $loader = document.querySelector(".contact-form-loader"),
  $response = document.querySelector(".contact-form-response");

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  $loader.classList.remove("none");
  fetch("https://formsubmit.co/ajax/contacto@robermejia.com", {
    method: "POST",
    body: new FormData(e.target),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);
      location.hash = "#gracias";
      $form.reset();
    })
    .catch((err) => {
      console.log(err);
      let message =
        err.statusText || "Ocurrió un error al enviar, intenta nuevamente";
      $response.querySelector(
        "h3"
      ).innerHTML = `Error ${err.status}: ${message}`;
    })
    .finally(() => {
      $loader.classList.add("none");
      setTimeout(() => {
        location.hash = "#close";
      }, 3000);
    });
});

/* ================ SECCIÓN DE CONTACTO (VENTANA MODAL FORMULARIO) - FIN ================ */