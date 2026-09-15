/*!
 * NODBU · Firma de autor para webs · v1.0.0 · https://nodbu.com
 *
 *   <nodbu-firma></nodbu-firma>
 *
 * Sin dependencias, sin peticiones externas, sin cookies.
 * Estilos encapsulados (Shadow DOM): ni el CSS del cliente la rompe
 * ni ella toca el CSS del cliente.
 *
 * Atributos opcionales
 *   texto="Diseño web por"   cambia el texto previo a la marca
 *   fondo="claro|oscuro"     fuerza el color; por defecto hereda el del pie
 *   mono                     punto del mismo color que el texto (sin naranja)
 *   quieto                   sin latido continuo (conserva la entrada y el hover)
 *   nofollow                 añade rel="nofollow" al enlace
 *
 * Variables CSS (se ponen desde fuera)
 *   --nodbu-firma-tamano     tamaño de letra (13px por defecto)
 */
(() => {
  if (!('customElements' in window) || customElements.get('nodbu-firma')) return;

  const WEB = 'https://nodbu.com/';
  const NARANJA = '#FF5C00';
  const reducido = matchMedia('(prefers-reduced-motion: reduce)');

  const plantilla = document.createElement('template');
  plantilla.innerHTML = `<style>
:host{display:inline-block;vertical-align:middle;font-size:var(--nodbu-firma-tamano,13px);line-height:1}
:host([hidden]){display:none}
:host([fondo="claro"]){color:#090909}
:host([fondo="oscuro"]){color:#fff}
a{position:relative;display:inline-flex;align-items:center;padding:.5em .35em;margin:-.5em -.35em;
  color:inherit;font:inherit;letter-spacing:.01em;text-decoration:none;white-space:nowrap;
  border-radius:6px;-webkit-tap-highlight-color:transparent}
a:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.texto{opacity:.68;margin-inline-end:.45em;transition:opacity 220ms cubic-bezier(.2,0,0,1)}
.marca{font-weight:600;letter-spacing:.06em}
svg{flex:none;overflow:visible}
.simbolo{width:max(16px,1.2em);height:max(16px,1.2em);margin-inline-end:.34em}
.anillo{fill:none;stroke:currentColor;stroke-width:36.689;stroke-linecap:round}
.guia{fill:none}
.punto,.halo{fill:${NARANJA}}
:host([mono]) .punto,:host([mono]) .halo{fill:currentColor}
.halo{opacity:0}
.orbita,.punto,.halo{transform-box:fill-box;transform-origin:center}
.flecha{width:.72em;height:.72em;margin-inline-start:.22em;fill:none;stroke:currentColor;stroke-width:1.7;
  stroke-linecap:round;stroke-linejoin:round;opacity:0;transform:translate(-3px,3px);
  transition:opacity 220ms cubic-bezier(.2,0,0,1),transform 220ms cubic-bezier(.2,0,0,1)}
a:hover .texto,a:focus-visible .texto{opacity:.92}
a:hover .flecha,a:focus-visible .flecha{opacity:.75;transform:none}
.oculto{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

@media (prefers-reduced-motion:no-preference){
  .espera .anillo{stroke-dasharray:1 1;stroke-dashoffset:1;opacity:0}
  .espera .punto{transform:scale(0)}
  .entra .anillo{stroke-dasharray:1 1;animation:trazo 760ms cubic-bezier(.65,0,.35,1) both}
  .entra .punto{animation:aparece 460ms 560ms cubic-bezier(.34,1.56,.64,1) both}
  .entra .halo{animation:latido 1300ms 780ms cubic-bezier(0,0,0,1) both}
  .vivo .halo{animation:latido 6s 2s cubic-bezier(0,0,0,1) infinite}
  .pausa .halo{animation-play-state:paused}
  :host([quieto]) .vivo .halo{animation:none}
  .orbita.gira{animation:orbita 900ms cubic-bezier(.65,0,.35,1)}
}
@keyframes trazo{from{stroke-dashoffset:1;opacity:0}10%{opacity:1}to{stroke-dashoffset:0;opacity:1}}
@keyframes aparece{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes latido{0%{opacity:.5;transform:scale(1)}22%,100%{opacity:0;transform:scale(2.3)}}
@keyframes orbita{to{transform:rotate(360deg)}}
</style><a part="enlace" target="_blank"><span class="texto"></span><svg class="simbolo" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false"><path class="anillo" pathLength="1" d="M73.644-1.285A73.656 73.656 0 1 1 1.285-73.644"/><g class="orbita"><circle class="guia" r="160"/><circle class="halo" cx="52.082" cy="-52.082" r="23.57"/><circle class="punto" cx="52.082" cy="-52.082" r="23.57"/></g></svg><span class="marca">NODBU</span><svg class="flecha" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3.5 8.5l5-5M4.5 3.5h4v4"/></svg><span class="oculto"></span></a>`;

  class NodbuFirma extends HTMLElement {
    static observedAttributes = ['texto', 'nofollow', 'lang'];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).append(plantilla.content.cloneNode(true));
      this.enlace = this.shadowRoot.querySelector('a');
      this.orbita = this.shadowRoot.querySelector('.orbita');

      this.enlace.addEventListener('animationend', (e) => {
        if (e.animationName === 'orbita') this.orbita.classList.remove('gira');
        if (e.animationName === 'latido' && this.enlace.classList.contains('entra')) {
          this.enlace.classList.replace('entra', 'vivo');
        }
      });
      const girar = () => { if (!reducido.matches) this.orbita.classList.add('gira'); };
      this.enlace.addEventListener('pointerenter', girar);
      this.enlace.addEventListener('focus', girar);
    }

    connectedCallback() {
      this.pintar();
      if (this.observador || !('IntersectionObserver' in window)) return;

      // La animación de entrada espera a que el pie sea visible, y el latido
      // se congela cuando sale de pantalla: no gasta nada mientras nadie mira.
      this.enlace.classList.add('espera');
      this.observador = new IntersectionObserver(([registro]) => {
        const lista = this.enlace.classList;
        if (registro.isIntersecting && lista.contains('espera')) lista.replace('espera', 'entra');
        lista.toggle('pausa', !registro.isIntersecting);
      }, { threshold: 0.5 });
      this.observador.observe(this);
    }

    disconnectedCallback() {
      this.observador?.disconnect();
      this.observador = null;
      this.enlace.classList.remove('espera', 'entra', 'vivo', 'pausa');
    }

    attributeChangedCallback() {
      if (this.isConnected) this.pintar();
    }

    pintar() {
      const idioma = this.getAttribute('lang') || document.documentElement.lang || 'es';
      const ingles = /^en\b/i.test(idioma);

      const url = new URL(WEB);
      url.searchParams.set('utm_source', location.hostname || 'local');
      url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', 'firma-web');

      this.enlace.href = url.href;
      this.enlace.rel = this.hasAttribute('nofollow') ? 'noopener nofollow' : 'noopener';
      // El espacio final no se ve (flex lo descarta) pero los lectores de pantalla lo necesitan.
      this.shadowRoot.querySelector('.texto').textContent =
        (this.getAttribute('texto') || (ingles ? 'Built by' : 'Desarrollado por')) + ' ';
      this.shadowRoot.querySelector('.oculto').textContent =
        ingles ? ' (opens in a new tab)' : ' (se abre en una pestaña nueva)';
    }
  }

  customElements.define('nodbu-firma', NodbuFirma);
})();
