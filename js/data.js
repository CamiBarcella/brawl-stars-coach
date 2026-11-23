// Datos base de ejemplo. Actualiza periódicamente según balanceos/meta.
// Esta información es orientativa y fan-made.

window.BS_DATA = {
  modes: [
    { id: "gem-grab", name: "Atrapagemas", objective: "Controla la mina y mantén 10 gemas hasta la cuenta regresiva.", tips: ["Juega alrededor del centro.", "No persigas kills innecesarias con ventaja de gemas.", "Ten un portador seguro."] },
    { id: "brawl-ball", name: "Balón Brawl", objective: "Marca 2 goles. También ganas si tienes ventaja al terminar el tiempo.", tips: ["Rompe muros para abrir el mapa.", "Guarda supers para confirmar gol o defender.", "Pasa el balón para sorprender."] },
    { id: "bounty", name: "Caza Estelar", objective: "Consigue más estrellas que el enemigo sin morir con muchas estrellas.", tips: ["No te sobreextiendas con 7 estrellas.", "Juega por ventaja de rango.", "Cuenta las estrellas antes de pelear."] },
    { id: "knockout", name: "Noqueo", objective: "Elimina al equipo rival. Sin respawns por ronda.", tips: ["Juega paciente y por información.", "No gastes el gadget/super sin valor.", "Aprovecha la ventaja numérica."] },
    { id: "heist", name: "Atraco", objective: "Haz más daño a la caja fuerte enemiga.", tips: ["Equilibra presión y defensa.", "Brawlers de alto daño son valiosos.", "No ignores la caja propia."] },
    { id: "hot-zone", name: "Zona Restringida", objective: "Permanece en las zonas para capturar puntos.", tips: ["Lleva control de área.", "No todos deben estar en la zona si los eliminan fácil.", "Cicla supers de control."] }
  ],

  brawlers: [
    { id: "shelly", name: "Shelly", class: "Damage Dealer", range: "Corta", roles: ["Anti-tanque", "Control cercano"], strengths: ["Fuerte contra tanques", "Super defensivo", "Buena en arbustos"], weaknesses: ["Rango corto", "Sufre en mapas abiertos"] },
    { id: "colt", name: "Colt", class: "Damage Dealer", range: "Larga", roles: ["Daño", "Rompe muros"], strengths: ["Alto daño", "Rompe muros", "Presión en carriles"], weaknesses: ["Baja vida", "Depende de puntería"] },
    { id: "brock", name: "Brock", class: "Marksman", range: "Larga", roles: ["Poke", "Rompe muros"], strengths: ["Daño de área con super", "Control de carril"], weaknesses: ["Recarga lenta", "Vulnerable a asesinos"] },
    { id: "spike", name: "Spike", class: "Damage Dealer", range: "Larga", roles: ["Control", "Daño"], strengths: ["Control de zona", "Super fuerte", "Daño alto cerca"], weaknesses: ["Baja vida", "Difícil de dominar"] },
    { id: "poco", name: "Poco", class: "Support", range: "Larga", roles: ["Curación", "Soporte"], strengths: ["Curación en equipo", "Amplio ataque", "Bueno en Hot Zone"], weaknesses: ["Daño bajo", "Débil en duelos 1v1"] },
    { id: "el-primo", name: "El Primo", class: "Tank", range: "Corta", roles: ["Tanque", "Presión"], strengths: ["Mucha vida", "Presiona objetivos", "Bueno en mapas cerrados"], weaknesses: ["Sufre contra knockback/anti-tanque", "Depende de acercarse"] },
    { id: "bull", name: "Bull", class: "Tank", range: "Corta", roles: ["Tanque", "Agresivo"], strengths: ["Explosión de daño", "Fuerte en arbustos", "Presión lateral"], weaknesses: ["Predecible", "Débil a rango"] },
    { id: "crow", name: "Crow", class: "Assassin", range: "Larga", roles: ["Asesino", "Chip damage"], strengths: ["Veneno evita curación", "Movilidad", "Acosa enemigos"], weaknesses: ["Baja vida", "Daño directo moderado"] },
    { id: "nita", name: "Nita", class: "Damage Dealer", range: "Media", roles: ["Control", "Presión"], strengths: ["Oso presiona", "Ataque amplio", "Buena en Heist"], weaknesses: ["Dependiente del super", "Rango medio"] },
    { id: "8-bit", name: "8-Bit", class: "Damage Dealer", range: "Muy larga", roles: ["Daño", "Soporte de daño"], strengths: ["Daño enorme", "Potenciador útil"], weaknesses: ["Muy lento", "Vulnerable a asesinos"] },
    { id: "pam", name: "Pam", class: "Support", range: "Larga", roles: ["Curación", "Control"], strengths: ["Curación constante", "Mucha vida", "Controla zona"], weaknesses: ["Difícil rematar", "Vulnerable a burst"] },
    { id: "mortis", name: "Mortis", class: "Assassin", range: "Corta", roles: ["Asesino", "Movilidad"], strengths: ["Movilidad", "Castiga brawlers lentos", "Bueno con habilidad"], weaknesses: ["Muy débil contra counters", "Requiere práctica"] },
    { id: "gene", name: "Gene", class: "Controller", range: "Larga", roles: ["Control", "Utilidad"], strengths: ["Pull cambia rondas", "Buen poke", "Versátil"], weaknesses: ["Super puede fallar", "Daño moderado"] },
    { id: "max", name: "Max", class: "Support", range: "Larga", roles: ["Velocidad", "Agresión"], strengths: ["Movilidad para el equipo", "Presión constante"], weaknesses: ["Vida media-baja", "Necesita cargar super"] }
  ],

  // matchups: advice from perspective of "brawler" vs "opponent"
  matchups: [
    { brawler: "shelly", opponent: "el-primo", rating: "favorable", map: "Cavern Churn", mode: "gem-grab", tip: "Guarda el Super para cuando salte. Controla arbustos y no gastes munición." },
    { brawler: "shelly", opponent: "bull", rating: "favorable", map: "Cavern Churn", mode: "gem-grab", tip: "Mantén distancia media-corta. El Super frena su entrada." },
    { brawler: "shelly", opponent: "colt", rating: "desfavorable", map: "Shooting Star", mode: "bounty", tip: "Evita carriles abiertos. Busca muros y flanqueos por laterales." },
    { brawler: "colt", opponent: "brock", rating: "neutral", map: "Shooting Star", mode: "bounty", tip: "Usa la velocidad de balas para presionar, pero esquiva sus disparos." },
    { brawler: "colt", opponent: "el-primo", rating: "favorable", map: "Shooting Star", mode: "bounty", tip: "Mantén distancia y rompe muros para quitarle cobertura." },
    { brawler: "colt", opponent: "mortis", rating: "favorable", map: "Canal Grande", mode: "brawl-ball", tip: "Guarda dos balas y anticipa su dash. No dispares al aire." },
    { brawler: "el-primo", opponent: "shelly", rating: "desfavorable", map: "Cavern Churn", mode: "gem-grab", tip: "No entres directo. Espera a que gaste Super o entra con apoyo del equipo." },
    { brawler: "el-primo", opponent: "poco", rating: "favorable", map: "Parallel Plays", mode: "hot-zone", tip: "Presiona y divide al equipo; Poco no gana el duelo cercano." },
    { brawler: "poco", opponent: "mortis", rating: "favorable", map: "Parallel Plays", mode: "hot-zone", tip: "Mantén la distancia y cura al equipo. Mortis tiene poco valor si no puede rematar." },
    { brawler: "mortis", opponent: "poco", rating: "desfavorable", map: "Parallel Plays", mode: "hot-zone", tip: "Evita saltar sobre Poco con equipo cerca. Busca objetivos de baja vida aislados." },
    { brawler: "mortis", opponent: "8-bit", rating: "favorable", map: "Canal Grande", mode: "brawl-ball", tip: "Es un objetivo lento. Ataca cuando gaste balas o esté separado." },
    { brawler: "spike", opponent: "crow", rating: "neutral", map: "Layer Cake", mode: "bounty", tip: "Spike gana en daño, pero Crow puede molestar con veneno y movilidad." },
    { brawler: "pam", opponent: "8-bit", rating: "neutral", map: "Ring of Fire", mode: "hot-zone", tip: "Ambos controlan zona; Pam aguanta más, 8-Bit da más presión de daño." },
    { brawler: "nita", opponent: "bull", rating: "neutral", map: "Safe Zone", mode: "heist", tip: "Usa el oso para distraer a Bull y mantén distancia." },
    { brawler: "gene", opponent: "mortis", rating: "favorable", map: "Canal Grande", mode: "brawl-ball", tip: "Guarda el Super para castigar su dash. El poke constante lo incomoda." },
    { brawler: "max", opponent: "shelly", rating: "neutral", map: "Canal Grande", mode: "brawl-ball", tip: "Usa velocidad para mantener distancia; no entres en su rango de Super." }
  ],

  maps: [
    { id: "canal-grande", name: "Canal Grande", mode: "brawl-ball", type: "Abierto/Lateral", recommended: ["colt", "max", "gene", "mortis", "spike"], avoid: ["bull", "el-primo"], notes: "Carriles laterales importantes. Romper muros puede abrir goles." },
    { id: "cavern-churn", name: "Cavern Churn", mode: "gem-grab", type: "Cerrado con arbustos", recommended: ["shelly", "pam", "spike", "gene"], avoid: ["colt", "brock"], notes: "Control de arbustos y del centro. Los tanques pueden funcionar con apoyo." },
    { id: "shooting-star", name: "Shooting Star", mode: "bounty", type: "Abierto", recommended: ["colt", "brock", "spike", "gene"], avoid: ["el-primo", "bull", "mortis"], notes: "Mapa de rango largo. Cuidar posicionamiento y estrellas." },
    { id: "parallel-plays", name: "Parallel Plays", mode: "hot-zone", type: "Control de zona", recommended: ["pam", "poco", "spike", "gene"], avoid: ["mortis"], notes: "La curación y control de área brillan. Mantente vivo en zona." },
    { id: "safe-zone", name: "Safe Zone", mode: "heist", type: "Híbrido", recommended: ["colt", "nita", "spike", "8-bit"], avoid: ["mortis"], notes: "Equilibra daño a caja y defensa. Romper muros cambia la partida." },
    { id: "bell-rock", name: "Bell Rock", mode: "knockout", type: "Abierto con cobertura", recommended: ["brock", "gene", "spike", "colt"], avoid: ["el-primo"], notes: "Juega paciente. Cada eliminación vale una ronda." }
  ],

  lessons: [
    {
      id: "lesson-1",
      title: "Fundamentos de matchups",
      level: "Básico",
      content: [
        "Un matchup es cómo se desempeña tu brawler contra otro en una situación específica.",
        "No solo importa el brawler: también importan el mapa, el modo, la composición y tu habilidad.",
        "Antes de pelear, pregunta: ¿tengo ventaja de rango, daño, vida o utilidad?"
      ],
      keyPoints: ["Rango", "Daño", "Super", "Mapa"]
    },
    {
      id: "lesson-2",
      title: "Leer el mapa y el modo",
      level: "Básico",
      content: [
        "Los mapas abiertos favorecen brawlers de rango largo. Los mapas cerrados favorecen tanques y control cercano.",
        "El modo define la prioridad: en Bounty cuidas vidas; en Heist priorizas daño a objetivo; en Gem Grab controlas el centro.",
        "Elige brawlers que cumplan el objetivo, no solo los que consigan eliminaciones."
      ],
      keyPoints: ["Mapa", "Modo", "Objetivo"]
    },
    {
      id: "lesson-3",
      title: "Errores comunes y decisiones",
      level: "Intermedio",
      content: [
        "No gastes el Super solo por usarlo: guárdalo para confirmar una eliminación, defender o lograr el objetivo.",
        "Si tienes ventaja, juega seguro. Si vas perdiendo, busca una jugada calculada.",
        "Revisa repeticiones mentales: ¿por qué morí? ¿fue posicionamiento, matchup o mal uso de recursos?"
      ],
      keyPoints: ["Recursos", "Posicionamiento", "Adaptación"]
    }
  ],

  quizzes: [
    {
      id: "quiz-basics",
      title: "Prueba: Fundamentos",
      lessonId: "lesson-1",
      questions: [
        {
          id: "q1",
          text: "¿Qué factor NO debería ignorarse al evaluar un matchup?",
          options: ["El mapa", "El modo", "El color de la skin", "El rango del brawler"],
          answer: 2
        },
        {
          id: "q2",
          text: "Si usas Shelly contra El Primo en un mapa con arbustos, lo mejor suele ser:",
          options: ["Entrar corriendo al centro", "Guardar el Super para su salto", "Gastar munición al aire", "Ignorar el centro"],
          answer: 1
        },
        {
          id: "q3",
          text: "En mapas abiertos, generalmente tienen ventaja los brawlers de:",
          options: ["Rango corto", "Rango largo", "Sin ataque", "Solo cuerpo a cuerpo"],
          answer: 1
        }
      ]
    }
  ]
};
