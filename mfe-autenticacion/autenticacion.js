(function () {
  window.mountAutenticacion = function (containerId) {
    const el = document.getElementById(containerId);
    el.innerHTML = `
      <h3>MFE Autenticación y Perfil</h3>
      <form id="form-login">
        <label>Usuario / Cédula:</label><br>
        <input type="text" id="usr" value="1065234890" style="padding:8px; margin:8px 0; width:100%; max-width:300px;"><br>
        <label>Clave Dinámica (OTP):</label><br>
        <input type="password" id="otp" value="123456" style="padding:8px; margin:8px 0; width:100%; max-width:300px;"><br>
        <button type="submit" style="background:#003366; color:white; border:none; padding:10px 15px; border-radius:4px; cursor:pointer;">Ingresar</button>
      </form>
    `;

    document.getElementById("form-login").addEventListener("submit", (e) => {
      e.preventDefault();
      const usuario = document.getElementById("usr").value;

      
      window.dispatchEvent(
        new CustomEvent("auth:login_success", {
          detail: {
            token: "jwt-mock-coopahorro-2026",
            user: usuario,
            version: "v1",
          },
        }),
      );
    });
  };

  window.unmountAutenticacion = function (containerId) {
    document.getElementById(containerId).innerHTML = "";
  };
})();
