import type { Metadata } from "next";
import { Encabezado } from "@/components/paginas/Encabezado";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LISTA_SEDES } from "@/data/sedes";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de privacidad y tratamiento de datos",
  description: "Cómo Ana Cure Estética & Spa trata tus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.",
  robots: { index: true, follow: false },
};

export default function PrivacidadPage() {
  const L = SITE.legal;
  return (
    <main className="relative">
      <Encabezado eyebrow="Legal" titulo="Política de tratamiento de datos personales" texto="Ley 1581 de 2012 y Decreto 1377 de 2013 de Colombia. Última actualización: septiembre de 2026." />
      <div className="relative z-10 pb-section">
        <Container>
          <article className="prosa space-y-10 text-[0.98rem] leading-relaxed text-tinta-suave">
            <section>
              <Heading tamano="sm">1. Responsable del tratamiento</Heading>
              <p className="mt-3">
                <strong className="text-tinta">{L.razonSocial}</strong>, NIT {L.nit}, con domicilio en {L.direccion}. Representante legal: {L.representante}. Nombre comercial: {SITE.nombre}. Canales de atención: los WhatsApp de cada sede ({LISTA_SEDES.map((s) => `${s.nombre}: ${s.whatsappBonito}`).join("; ")}) y el correo {L.correoDatos}.
              </p>
            </section>
            <section>
              <Heading tamano="sm">2. Qué datos recogemos</Heading>
              <p className="mt-3">Datos de identificación y contacto (nombre, apellido, teléfono o WhatsApp, correo electrónico), datos de la cita (sede, servicio, fecha y hora) y, cuando agendas o recibes un tratamiento, datos relacionados con tu salud y tu piel, que son datos sensibles. Los datos sensibles solo se tratan con tu autorización explícita y no estás obligada u obligado a suministrarlos.</p>
            </section>
            <section>
              <Heading tamano="sm">3. Para qué los usamos</Heading>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>Agendar, confirmar, recordar y reprogramar tus citas.</li>
                <li>Realizar la valoración, diseñar tu protocolo y hacer seguimiento a tu evolución.</li>
                <li>Responder tus mensajes por WhatsApp y otros canales.</li>
                <li>Enviarte información sobre nuestros servicios, siempre que lo autorices, y con la posibilidad de retirar esa autorización cuando quieras.</li>
                <li>Cumplir obligaciones legales, contables y sanitarias.</li>
              </ul>
            </section>
            <section>
              <Heading tamano="sm">4. Fotografías y testimonios</Heading>
              <p className="mt-3">Las fotografías, videos y testimonios de pacientes que aparecen en este sitio y en nuestras redes se publican únicamente con la autorización previa, expresa y escrita de cada persona. Puedes revocar esa autorización en cualquier momento por los canales indicados y retiraremos el material.</p>
            </section>
            <section>
              <Heading tamano="sm">5. Tus derechos</Heading>
              <p className="mt-3">Conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización otorgada; ser informada o informado del uso que se les ha dado; presentar quejas ante la Superintendencia de Industria y Comercio; revocar la autorización y solicitar la supresión de los datos cuando no exista un deber legal o contractual de conservarlos; y acceder gratuitamente a ellos.</p>
              <p className="mt-3">Para ejercerlos escribe a {L.correoDatos} o al WhatsApp de tu sede, indicando tu nombre, el derecho que ejerces y un medio de contacto. Respondemos consultas en un máximo de diez días hábiles y reclamos en un máximo de quince, según la ley.</p>
            </section>
            <section>
              <Heading tamano="sm">6. Con quién compartimos los datos</Heading>
              <p className="mt-3">Con los profesionales que te atienden y con los proveedores tecnológicos que necesitamos para operar (sistema de agenda, mensajería de WhatsApp y alojamiento web), que actúan como encargados bajo contrato y con las medidas de seguridad exigidas. No vendemos ni cedemos tus datos a terceros para fines comerciales.</p>
            </section>
            <section>
              <Heading tamano="sm">7. Seguridad y conservación</Heading>
              <p className="mt-3">Aplicamos medidas técnicas y administrativas para proteger tus datos frente a acceso, uso o pérdida no autorizados. Los conservamos mientras dure la relación contigo y durante los plazos que exija la ley; después se eliminan o anonimizan.</p>
            </section>
            <section>
              <Heading tamano="sm">8. Analítica y cookies</Heading>
              <p className="mt-3">Este sitio mide visitas de forma agregada y anónima, sin cookies de seguimiento ni identificación individual. Los mapas y los enlaces a Instagram y WhatsApp son servicios de terceros que se cargan solo cuando los abres y tienen sus propias políticas.</p>
            </section>
            <section>
              <Heading tamano="sm">9. Cambios</Heading>
              <p className="mt-3">Podemos actualizar esta política. La versión vigente estará siempre publicada en esta página con su fecha de actualización.</p>
            </section>
          </article>
        </Container>
      </div>
    </main>
  );
}
