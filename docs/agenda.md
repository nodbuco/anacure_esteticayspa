# La agenda: cómo se conecta el sitio con Easy!Appointments

Easy!Appointments (EA) vive en `https://spa.agenda.nodbu.com`. El sitio no guarda citas: cada reserva
se crea directamente en EA a través de su API, y el equipo la ve en el panel de EA como cualquier otra.

## El modelo

| En el spa | En Easy!Appointments | Por qué |
|---|---|---|
| Sede (El Banco, Aguachica) | **Proveedor** (`Ana Cure Spa · El Banco`, `Ana Cure Spa · Aguachica`) | Cada sede tiene su propio calendario, horario y cupos. |
| Categoría (facial, medicina estética…) | Categoría de servicio | Orden en el panel. |
| Tratamiento (`data/servicios.ts`) | Servicio, con su duración | La duración define cuánto ocupa cada cita. Precio 0: en la web no se muestran precios. |
| Horario (`HORARIO` en `data/sedes.ts`) | Plan de trabajo del proveedor y de la empresa | L–V 7:30–18:00, sábados 8:00–15:00, domingos sin horario. |
| Festivos de Colombia (`lib/festivos.ts`) | Periodos bloqueados de toda la empresa | Un bloqueo de día completo por festivo, tres años por delante. |
| Servicios «solo por WhatsApp» (`soloWhatsApp: true`) | Servicio **privado** | Existen para que el equipo los agende a mano; la web no los ofrece en línea. |

Los ids de EA que usa el sitio están en `data/agenda.generated.json`. **No se edita a mano**: lo escribe el script.

## El script `npm run ea:setup`

```bash
npm run ea:setup -- --ver   # muestra lo que haría, sin cambiar nada
npm run ea:setup            # aplica
```

Lee `data/servicios.ts`, `data/sedes.ts` y `lib/festivos.ts` y deja EA igual que el sitio: ajustes generales,
categorías, servicios (crea los nuevos, actualiza duración y categoría de los existentes, por nombre),
proveedores (por correo), festivos (por fecha) y limpieza de los datos de ejemplo de la instalación
(solo si no hay ninguna cita). Es idempotente: se puede correr cuantas veces haga falta. Nunca borra citas.

Córrelo cada vez que:

- se añade o se renombra un tratamiento, o cambia su duración o su sede;
- cambia el horario en `data/sedes.ts`;
- empieza un año nuevo (para bloquear los festivos de tres años más). También puedes correrlo antes.

Necesita `.env.local` con `EA_BASE_URL` y `EA_API_KEY`. El token da acceso total a EA: no se sube a git
(está en `.gitignore`) ni se usa nunca desde el navegador.

Usuarios de proveedor que creó el script: `elbanco` y `aguachica`. La contraseña se mostró una sola vez en la
terminal al crearlos; cámbiala desde el panel de EA (Usuarios → Proveedores) cuando quieras.

## Qué pasa cuando alguien reserva en la web

1. `/agendar` (componente `components/agenda/Agendador.tsx`): sede → tratamiento → fecha y hora → datos.
2. Al elegir un día, el navegador pide `GET /api/agenda/disponibilidad?sede&servicio&fecha`. El servidor
   valida (sede real, servicio reservable en esa sede, fecha dentro de los próximos 30 días, ni domingo ni
   festivo) y consulta `/availabilities` de EA con el token. Responde `{ horas: ["07:30", …] }` en hora
   de Colombia.
3. Al confirmar, `POST /api/agenda/citas` con `{ sede, servicio, fecha, hora, nombre, apellido, whatsapp,
   email?, notas?, acepta: true }`. El servidor:
   - valida de nuevo (mismo esquema `EsquemaCita` de `lib/agenda.ts` que usa el navegador);
   - limita a 6 intentos por IP cada 10 minutos;
   - vuelve a comprobar que el cupo sigue libre (si no, responde `409` y la web devuelve al paso de la hora);
   - busca el cliente por celular (`+57…`); si no existe, lo crea con nombre, apellido, celular, correo
     opcional, ciudad de la sede, idioma español y zona `America/Bogota`;
   - crea la cita con `start`/`end` (duración del servicio), `location` (dirección de la sede), `status`
     `Booked` y unas `notes` con este formato:

     ```
     Reservado desde anacure.co
     Sede: Aguachica
     WhatsApp: +573001234567
     Correo: correo@ejemplo.com          (si lo dio)
     Nota de la persona: …               (si escribió algo)
     ```
4. La web muestra la confirmación, un botón «Confirmar por WhatsApp» con el mensaje ya escrito, y un
   enlace para añadir la cita a Google Calendar. Se registra el evento de analítica `cita_completada`.

Ni el token ni ninguna llamada a EA pasan por el navegador: solo por `lib/ea.ts` (marcado `server-only`).

## Zona horaria

Los proveedores están en `America/Bogota`, así que las horas libres y las citas se guardan y se muestran en
hora de Colombia. El contenedor de EA corre en UTC: eso solo afecta a la marca «reservada el» (`book`),
que sale con cinco horas de diferencia. Para que también salga en hora local, añade la variable
`TZ=America/Bogota` al servicio de Easy!Appointments en Coolify y reinícialo.

## Correos de confirmación

Los envía Easy!Appointments, no la web, cuando tiene un servidor de correo configurado (SMTP). Está
pendiente hasta que exista el correo de anacure.co. Mientras tanto, la confirmación es por WhatsApp.

## Webhooks hacia n8n y Chatwoot

Los webhooks se configuran en EA (Ajustes → Integraciones → Webhooks). Este sitio no los toca. Cuando hay
uno activo, EA hace un `POST` con JSON a la URL configurada:

```json
{
  "action": "appointment_save",
  "payload": {
    "id": 12,
    "book_datetime": "2026-09-15 00:26:48",
    "start_datetime": "2026-09-16 09:00:00",
    "end_datetime": "2026-09-16 09:30:00",
    "hash": "EYse01wzGAxI",
    "location": "Cra 33 # 3-27, Aguachica",
    "notes": "Reservado desde anacure.co\nSede: Aguachica\nWhatsApp: +573001234567",
    "status": "Booked",
    "color": "#7cbae8",
    "is_unavailability": false,
    "id_users_provider": 5,
    "id_users_customer": 6,
    "id_services": 2,
    "id_google_calendar": null,
    "id_caldav_calendar": null,
    "create_datetime": "2026-09-15 00:26:48",
    "update_datetime": "2026-09-15 00:26:48"
  }
}
```

- Acciones que disparan las reservas de la web: `customer_save` (cuando se crea un cliente nuevo; el
  `payload` es el cliente, con `first_name`, `last_name`, `email`, `phone_number`, `city`, `notes`…) y
  `appointment_save` (la cita). Cancelar desde el panel dispara `appointment_delete`.
- El `payload` de la cita **no trae el nombre ni el celular** de la persona: solo ids. Para escribirle por
  WhatsApp desde n8n hay dos caminos: leer el celular de `notes` (siempre va en la línea `WhatsApp: +57…`
  cuando la cita viene de la web) o pedir `GET /index.php/api/v1/customers/{id_users_customer}` con el
  token. Lo mismo con `services/{id_services}` (nombre y duración) y `providers/{id_users_provider}`
  (sede: `lastName` es «El Banco» o «Aguachica»).
- Si en el webhook se configuró «cabecera secreta» y «token secreto», EA los manda como cabecera HTTP en
  cada llamada; n8n puede comprobarlos.
- Las citas que el equipo crea a mano en el panel disparan los mismos webhooks, sin las `notes` de la web.

## Tareas frecuentes

| Quiero… | Dónde |
|---|---|
| Ver o mover citas | Panel de EA: `https://spa.agenda.nodbu.com/index.php/backend` |
| Cerrar por vacaciones o un día concreto | EA → Calendario → «Periodo bloqueado» (toda la empresa) o, para una sola sede, editar el proveedor → Plan de trabajo → Excepciones |
| Cambiar el horario de siempre | `HORARIO` en `data/sedes.ts` y `npm run ea:setup` (también actualiza el pie de página y los datos para Google) |
| Añadir un tratamiento | Nuevo objeto en `data/servicios.ts` (slug, nombre, categoría, resumen, descripción, duración, sedes) y `npm run ea:setup` |
| Que un tratamiento no se reserve en línea | `soloWhatsApp: true` en `data/servicios.ts` y `npm run ea:setup` |
| Cambiar con cuánta anticipación mínima se puede reservar | `book_advance_timeout` en `scripts/ea-setup.ts` (minutos; hoy 120) |
| Reservar con más de 30 días de anticipación | `HORIZONTE_DIAS` en `lib/agenda.ts` |
| Borrar una cita de prueba | Panel de EA → Calendario → abrir la cita → Eliminar |
