(function () {
  let saldo = 2500000;

  window.mountTransaccional = function (containerId) {
    const el = document.getElementById(containerId);

    function render() {
      el.innerHTML = `
        <h3>MFE Transaccional</h3>
        <p>Saldo disponible en Cuenta de Ahorros: <strong>$${saldo.toLocaleString("es-CO")} COP</strong></p>
        <hr>
        <h4>Realizar Transferencia</h4>
        <input type="number" id="monto" placeholder="Monto a transferir" style="padding:8px; margin-right:8px;">
        <button id="btn-transferir" style="background:#28a745; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer;">Transferir</button>
      `;

      document.getElementById("btn-transferir").onclick = () => {
        const valor = Number(document.getElementById("monto").value);
        if (valor > 0 && valor <= saldo) {
          saldo -= valor;

          
          window.dispatchEvent(
            new CustomEvent("transfer:success", {
              detail: { newBalance: saldo, currency: "COP", version: "v1" },
            }),
          );

          alert("Transferencia realizada con éxito.");
          render();
        } else {
          alert("Monto inválido o saldo insuficiente.");
        }
      };
    }

    render();

    
    window.addEventListener("auth:session_expired", () => {
      console.log(
        "[MFE Transaccional] Limpiando datos sensibles de memoria por expiración.",
      );
      saldo = 0;
    });
  };

  window.unmountTransaccional = function (containerId) {
    document.getElementById(containerId).innerHTML = "";
  };
})();
