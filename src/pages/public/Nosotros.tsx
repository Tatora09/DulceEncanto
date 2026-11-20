import React from "react";
import { Link } from "react-router-dom";

const PILARES: [string, string, string][] = [
  ["🍓", "Materia prima noble", "Frambuesas naturales de huertos sureños, lúcuma pura y manjar cocido lentamente en pailas de cobre."],
  ["👩‍🍳", "Mano experta", "Cada flor de azúcar, hojarasca y bañado en merengue es elaborado a mano por pasteleros titulados."],
  ["⏳", "Tiempos sagrados", "Pedimos 72 horas para postres personalizados porque el bizcocho y los rellenos requieren reposo óptimo."],
  ["🌱", "Sustentabilidad", "Cajas biodegradables y convenios directos con pequeños apicultores y agricultores nacionales."],
];

const EQUIPO: [string, string, string][] = [
  ["Elena Rosales", "Fundadora y maestra repostera", "Guardiana de las recetas tradicionales de hojarasca y kuchenes alemanes."],
  ["Carlos Vera", "Especialista en fondant y escultura", "Transforma cualquier temática y dedicatoria en una obra de arte comestible."],
  ["Lucía Morales", "Chef de masa madre y panadería", "Responsable de nuestras hogazas rústicas de fermentación lenta de 36 horas."],
];

const Nosotros: React.FC = () => (
  <div>
    <section className="mb-5">
      <span className="de-section-tag">Nuestras raíces</span>
      <h1 className="h2">La historia de Dulce Encanto</h1>
      <p className="text-muted">Una pasión heredada de generación en generación, horneada cada mañana con cariño y materias primas chilenas.</p>
      <div className="row g-4 align-items-center">
        <div className="col-lg-8">
          <h2 className="h4">De la cocina familiar a tu mesa</h2>
          <p>
            Dulce Encanto nació a comienzos del año 2004 en una cálida cocina familiar de la Región de Los Lagos. Nuestra fundadora,
            Elena Rosales, aprendió los secretos del hojaldre crujiente y los kuchenes de frambuesa de su abuela de origen colono en Frutillar.
          </p>
          <p>
            Lo que comenzó como una pequeña producción para amigos y festividades locales se convirtió en una reconocida panadería y
            repostería artesanal en Santiago, manteniendo intacta la regla dorada: cero premezclas industriales y 100% sabor a hogar.
          </p>
          <Link to="/categorias" className="de-btn de-btn-primary">Descubrir nuestras tortas</Link>
        </div>
        <div className="col-lg-4">
          <div className="card text-center p-4">
            <strong className="display-5">+20 años</strong>
            <span className="text-muted">de tradición repostera</span>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-5">
      <h2 className="h3 mb-3">Los 4 pilares de nuestra repostería</h2>
      <div className="row g-3">
        {PILARES.map(([emoji, titulo, texto]) => (
          <div className="col-12 col-md-6 col-lg-3" key={titulo}>
            <div className="card h-100 p-3">
              <div className="fs-1">{emoji}</div>
              <h3 className="h6">{titulo}</h3>
              <p className="text-muted small mb-0">{texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="h3 mb-3">El equipo que da vida a tus postres</h2>
      <div className="row g-3">
        {EQUIPO.map(([nombre, cargo, texto]) => (
          <div className="col-12 col-md-4" key={nombre}>
            <div className="card h-100 p-3">
              <h3 className="h5 mb-0">{nombre}</h3>
              <small className="text-muted d-block mb-2">{cargo}</small>
              <p className="mb-0">{texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Nosotros;
