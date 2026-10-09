(function () {
  const ID_RAIZ = "app-root";
  const raiz = document.getElementById(ID_RAIZ);
  let tokenSesion = null;
  let datosUsuario = null;
  let temporizadorInactividad = null;

  
  const TIEMPO_INACTIVIDAD = 10 * 1000;

  
  function reiniciarTemporizador() {
    clearTimeout(temporizadorInactividad);
    if (tokenSesion) {
      temporizadorInactividad = setTimeout(expirarSesion, TIEMPO_INACTIVIDAD);
    }
  }

  function expirarSesion() {
    tokenSesion = null;
    datosUsuario = null;
    document.getElementById("app-nav").style.display = "none";
    document.getElementById("app-usuario").textContent = "No autenticado";
    document.getElementById("alerta-sesion").style.display = "block";

    
    window.dispatchEvent(
      new CustomEvent("auth:session_expired", {
        detail: { reason: "timeout", version: "v1" },
      }),
    );

    location.hash = "#/login";
    navegar();
  }

 
  ["mousemove", "keydown", "click"].forEach((evt) => {
    window.addEventListener(evt, reiniciarTemporizador);
  });


  window.addEventListener("auth:login_success", (e) => {
    tokenSesion = e.detail.token;
    datosUsuario = e.detail.user;
    document.getElementById("app-usuario").textContent =
      "Asociado: " + datosUsuario;
    document.getElementById("app-nav").style.display = "inline";
    document.getElementById("alerta-sesion").style.display = "none";
    reiniciarTemporizador();
    location.hash = "#/transaccional";
  });

 
  function navegar() {
    const ruta = location.hash.replace("#", "") || "/login";
    raiz.innerHTML = "";

    if (!tokenSesion && ruta !== "/login") {
      location.hash = "#/login";
      return;
    }

    switch (ruta) {
      case "/login":
        window.mountAutenticacion
          ? window.mountAutenticacion(ID_RAIZ)
          : cargarScript("http://localhost:8081/autenticacion.js", () =>
              window.mountAutenticacion(ID_RAIZ),
            );
        break;
      case "/transaccional":
        window.mountTransaccional
          ? window.mountTransaccional(ID_RAIZ)
          : cargarScript("http://localhost:8082/transaccional.js", () =>
              window.mountTransaccional(ID_RAIZ),
            );
        break;
      case "/certificados":
        raiz.innerHTML =
          '<iframe src="http://localhost:8083/index.html" style="width:100%; height:400px; border:none;"></iframe>';
        break;
      case "/perfil":
        
        raiz.innerHTML = `
          <h3>MFE Autenticación y Perfil</h3>
          <p><strong>Usuario Asociado:</strong> ${datosUsuario}</p>
          <p><strong>Estado de la Sesión:</strong> Activa (JWT Verificado)</p>
          <p><strong>Segundo Factor (OTP):</strong> Validado</p>
          <hr>
          <button id="btn-cerrar-sesion" style="background:#d9534f; color:white; border:none; padding:8px 14px; border-radius:4px; cursor:pointer;">Cerrar Sesión Activa</button>
        `;
        document.getElementById("btn-cerrar-sesion").onclick = expirarSesion;
        break;
    }
  }

  function cargarScript(url, callback) {
    const s = document.createElement("script");
    s.src = url;
    s.onload = callback;
    document.head.appendChild(s);
  }

  window.addEventListener("hashchange", navegar);
  navegar();
})();
