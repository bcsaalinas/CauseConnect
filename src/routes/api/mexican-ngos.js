import express from "express";
import NodeCache from "node-cache";

const router = express.Router();

// In-memory cache with TTL
const cache = new NodeCache({
  stdTTL: 3600, // 1 hour cache
  checkperiod: 300,
});

/**
 * Curated list of verified Mexican NGOs with real data
 * This serves as our primary data source until we integrate with official registries
 */
const MEXICAN_NGOS = [
  {
    id: "mx-001",
    name: "Cruz Roja Mexicana",
    mission:
      "Prevenir y aliviar el sufrimiento humano, proteger la vida y la salud, y hacer respetar a la persona humana, en particular en tiempo de conflicto armado y en otras situaciones de urgencia.",
    cause: "Health",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.cruzrojamexicana.org.mx",
    phone: "+52 55 5395 1111",
    email: "contacto@cruzrojamexicana.org.mx",
    yearFounded: 1910,
    active: true,
    verified: true,
  },
  {
    id: "mx-002",
    name: "Banco de Alimentos de México (BAMX)",
    mission:
      "Rescatar alimentos de la industria alimentaria y redistribuirlos a comunidades vulnerables, combatiendo el hambre y reduciendo el desperdicio de alimentos.",
    cause: "Hunger",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.bamx.org.mx",
    phone: "+52 55 5096 2020",
    email: "info@bamx.org.mx",
    yearFounded: 1995,
    active: true,
    verified: true,
  },
  {
    id: "mx-003",
    name: "Un Kilo de Ayuda",
    mission:
      "Combatir la desnutrición infantil en las comunidades más marginadas de México mediante programas integrales de nutrición, salud y desarrollo infantil temprano.",
    cause: "Children",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.unkilodeayuda.org.mx",
    phone: "+52 55 5201 8210",
    email: "contacto@unkilodeayuda.org.mx",
    yearFounded: 1995,
    active: true,
    verified: true,
  },
  {
    id: "mx-004",
    name: "Fundación Gonzalo Río Arronte",
    mission:
      "Contribuir al mejoramiento de la calidad de vida de los mexicanos mediante el apoyo a proyectos educativos, culturales y de desarrollo comunitario.",
    cause: "Education",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.fundacionarronte.org.mx",
    phone: "+52 55 5211 8949",
    email: "info@fundacionarronte.org.mx",
    yearFounded: 1989,
    active: true,
    verified: true,
  },
  {
    id: "mx-005",
    name: "Pronatura México",
    mission:
      "Conservar la flora, fauna y ecosistemas prioritarios de México, promoviendo el desarrollo de la sociedad en armonía con la naturaleza.",
    cause: "Environment",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.pronatura.org.mx",
    phone: "+52 55 5635 5054",
    email: "informes@pronatura.org.mx",
    yearFounded: 1981,
    active: true,
    verified: true,
  },
  {
    id: "mx-006",
    name: "Techo México",
    mission:
      "Trabajar en la construcción de viviendas de emergencia y en el desarrollo comunitario de asentamientos precarios para superar la situación de pobreza.",
    cause: "Housing",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.techo.org/mexico",
    phone: "+52 55 5543 2970",
    email: "info.mexico@techo.org",
    yearFounded: 2006,
    active: true,
    verified: true,
  },
  {
    id: "mx-007",
    name: "Fundación DIBUJANDO UN MAÑANA",
    mission:
      "Transformar la vida de niñas, niños y adolescentes en situación de calle mediante programas educativos y de reinserción social.",
    cause: "Children",
    location: {
      city: "Guadalajara",
      state: "Jalisco",
      region: "Occidente",
    },
    website: "https://www.dibujandounmanana.org",
    phone: "+52 33 3616 4828",
    email: "contacto@dibujandounmanana.org",
    yearFounded: 2005,
    active: true,
    verified: true,
  },
  {
    id: "mx-008",
    name: "Fondo Unido de México",
    mission:
      "Crear alianzas que transformen vidas mediante programas de educación, salud y desarrollo comunitario en todo México.",
    cause: "Education",
    location: {
      city: "Tlaquepaque",
      state: "Jalisco",
      region: "Occidente",
    },
    website: "http://www.fondounido.org.mx",
    phone: "+52 33 3617 3881",
    email: "info@fondounido.org.mx",
    yearFounded: 2002,
    active: true,
    verified: true,
  },
  {
    id: "mx-009",
    name: "IMDEC - Instituto Mexicano para el Desarrollo Comunitario",
    mission:
      "Promover el desarrollo comunitario y la justicia ambiental mediante procesos de educación popular y organización social.",
    cause: "Environment",
    location: {
      city: "Guadalajara",
      state: "Jalisco",
      region: "Occidente",
    },
    website: "https://www.imdec.net",
    phone: "+52 33 3826 6998",
    email: "imdec@imdec.net",
    yearFounded: 1963,
    active: true,
    verified: true,
  },
  {
    id: "mx-010",
    name: "Casa Cem",
    mission:
      "Centro comunitario enfocado en educación ambiental y prácticas sustentables para la comunidad de Guadalajara.",
    cause: "Environment",
    location: {
      city: "Guadalajara",
      state: "Jalisco",
      region: "Occidente",
    },
    website: "http://casacem.com",
    phone: "+52 33 3615 4499",
    email: "contacto@casacem.com",
    yearFounded: 2010,
    active: true,
    verified: true,
  },
  {
    id: "mx-011",
    name: "Reforestamos México",
    mission:
      "Restaurar los bosques y selvas de México mediante la participación activa de las comunidades locales.",
    cause: "Environment",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.reforestamos.org",
    phone: "+52 55 5240 5254",
    email: "contacto@reforestamos.org",
    yearFounded: 2011,
    active: true,
    verified: true,
  },
  {
    id: "mx-012",
    name: "Fundación Mexicana para la Planeación Familiar (Mexfam)",
    mission:
      "Promover la salud sexual y reproductiva en México mediante servicios de calidad, educación e incidencia política.",
    cause: "Health",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.mexfam.org.mx",
    phone: "+52 55 5659 8700",
    email: "mexfam@mexfam.org.mx",
    yearFounded: 1965,
    active: true,
    verified: true,
  },
  {
    id: "mx-013",
    name: "Enseña por México",
    mission:
      "Desarrollar el potencial de liderazgo de jóvenes profesionistas para que enseñen en escuelas de comunidades vulnerables.",
    cause: "Education",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.ensenapormexico.org",
    phone: "+52 55 5559 8270",
    email: "contacto@ensenapormexico.org",
    yearFounded: 2011,
    active: true,
    verified: true,
  },
  {
    id: "mx-014",
    name: "Pro Mujer México",
    mission:
      "Empoderar a mujeres de escasos recursos mediante servicios financieros, capacitación empresarial y servicios de salud.",
    cause: "Women",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.promujer.org/es/mexico",
    phone: "+52 55 5286 5959",
    email: "mexico@promujer.org",
    yearFounded: 2001,
    active: true,
    verified: true,
  },
  {
    id: "mx-015",
    name: "Save the Children México",
    mission:
      "Inspirar avances en la forma en que el mundo trata a los niños y niñas, y lograr cambios inmediatos y duraderos en sus vidas.",
    cause: "Children",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.savethechildren.mx",
    phone: "+52 55 5554 3442",
    email: "contacto@savethechildren.mx",
    yearFounded: 1973,
    active: true,
    verified: true,
  },
  {
    id: "mx-016",
    name: "Cáritas México",
    mission:
      "Promover la caridad y justicia social en México, atendiendo a las personas más vulnerables mediante programas de desarrollo integral.",
    cause: "Social Justice",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.caritasmexico.org",
    phone: "+52 55 5546 0560",
    email: "nacional@caritasmexico.org",
    yearFounded: 1964,
    active: true,
    verified: true,
  },
  {
    id: "mx-017",
    name: "Ashoka México y Centroamérica",
    mission:
      "Identificar y apoyar a emprendedores sociales que generan cambios sistémicos en México y Centroamérica.",
    cause: "Social Innovation",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.ashoka.org/es-mx/country/mexico",
    phone: "+52 55 5554 5109",
    email: "mexico@ashoka.org",
    yearFounded: 1993,
    active: true,
    verified: true,
  },
  {
    id: "mx-018",
    name: "Habitat for Humanity México",
    mission:
      "Construir casas y esperanza en comunidades vulnerables de México, promoviendo el derecho a una vivienda digna.",
    cause: "Housing",
    location: {
      city: "Ciudad de México",
      state: "Ciudad de México",
      region: "Centro",
    },
    website: "https://www.habitatmexico.org",
    phone: "+52 55 5999 1616",
    email: "info@habitatmexico.org",
    yearFounded: 2001,
    active: true,
    verified: true,
  },
  {
    id: "mx-019",
    name: "Fundación Tláloc",
    mission:
      "Contribuir a la conservación del medio ambiente y al desarrollo sustentable de las comunidades rurales de México.",
    cause: "Environment",
    location: {
      city: "Guadalajara",
      state: "Jalisco",
      region: "Occidente",
    },
    website: "https://www.fundaciontlaloc.org",
    phone: "+52 33 3647 7550",
    email: "info@fundaciontlaloc.org",
    yearFounded: 2005,
    active: true,
    verified: true,
  },
  {
    id: "mx-020",
    name: "Asociación Mexicana de Ayuda a Niños con Cáncer (AMANC)",
    mission:
      "Brindar apoyo integral a niños con cáncer y sus familias durante el proceso de tratamiento médico.",
    cause: "Health",
    location: {
      city: "Guadalajara",
      state: "Jalisco",
      region: "Occidente",
    },
    website: "https://www.amanc.org",
    phone: "+52 33 3642 5906",
    email: "guadalajara@amanc.org",
    yearFounded: 1982,
    active: true,
    verified: true,
  },
];

/**
 * Filter organizations based on search query
 */
function filterNGOs(ngos, { q = "", cause = "", location = "", state = "" }) {
  return ngos.filter((ngo) => {
    // Text search (name or mission)
    const searchMatch =
      !q ||
      ngo.name.toLowerCase().includes(q.toLowerCase()) ||
      ngo.mission.toLowerCase().includes(q.toLowerCase());

    // Cause filter
    const causeMatch =
      !cause || ngo.cause.toLowerCase() === cause.toLowerCase();

    // Location filter (city)
    const locationMatch =
      !location ||
      ngo.location.city.toLowerCase().includes(location.toLowerCase());

    // State filter
    const stateMatch =
      !state || ngo.location.state.toLowerCase().includes(state.toLowerCase());

    return searchMatch && causeMatch && locationMatch && stateMatch;
  });
}

/**
 * Get unique values for filter dropdowns
 */
function getFilterOptions(ngos) {
  const causes = [...new Set(ngos.map((n) => n.cause))].sort();
  const cities = [...new Set(ngos.map((n) => n.location.city))].sort();
  const states = [...new Set(ngos.map((n) => n.location.state))].sort();

  return { causes, cities, states };
}

/**
 * GET /api/mexican-ngos
 * Returns all Mexican NGOs or filtered results
 */
router.get("/", (req, res) => {
  const { q, cause, location, state } = req.query;

  try {
    // Filter NGOs based on query parameters
    const filtered = filterNGOs(MEXICAN_NGOS, { q, cause, location, state });

    // Get filter options
    const filterOptions = getFilterOptions(MEXICAN_NGOS);

    res.json({
      success: true,
      total: filtered.length,
      filters: {
        q: q || null,
        cause: cause || null,
        location: location || null,
        state: state || null,
      },
      filterOptions,
      ngos: filtered,
    });
  } catch (error) {
    console.error("Error fetching Mexican NGOs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch NGOs",
      message: error.message,
    });
  }
});

/**
 * GET /api/mexican-ngos/:id
 * Returns a single NGO by ID
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const ngo = MEXICAN_NGOS.find((n) => n.id === id);

  if (!ngo) {
    return res.status(404).json({
      success: false,
      error: "NGO not found",
      message: `No NGO found with ID: ${id}`,
    });
  }

  res.json({
    success: true,
    ngo,
  });
});

/**
 * GET /api/mexican-ngos/filters/options
 * Returns available filter options
 */
router.get("/filters/options", (req, res) => {
  const filterOptions = getFilterOptions(MEXICAN_NGOS);

  res.json({
    success: true,
    ...filterOptions,
  });
});

export default router;
