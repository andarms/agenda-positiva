import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { $eventos, generar_slug_evento } from '../server/db/schema';

// Cargar las variables de entorno
config({ path: '.env.local' });
config({ path: '.env' }); // Fallback si no existe .env.local

const db = drizzle({ 
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }
});

const eventos_ejemplo = [
  {
    nombre: "Conferencia Anual de Liderazgo 2026",
    descripcion: "Una conferencia transformadora sobre liderazgo cristiano moderno. Contaremos con speakers internacionales, talleres interactivos y momentos de adoración inspiradores. Ideal para pastores, líderes de ministerios y aquellos que buscan desarrollar su potencial de liderazgo.",
    fecha_inicio: "2026-03-15T09:00:00",
    fecha_fin: "2026-03-17T18:00:00",
    ubicacion: "Centro de Convenciones La Esperanza, Bogotá, Colombia"
  },
  {
    nombre: "Retiro Espiritual de Cuaresma",
    descripcion: "Un tiempo especial de reflexión y renovación espiritual durante la temporada de Cuaresma. Incluye sesiones de oración, meditación bíblica, testimonios personales y actividades comunitarias para fortalecer la fe.",
    fecha_inicio: "2026-02-28T18:00:00",
    fecha_fin: "2026-03-02T16:00:00",
    ubicacion: "Retiro Las Águilas, Villa de Leyva, Boyacá"
  },
  {
    nombre: "Seminario de Matrimonios y Familia",
    descripcion: "Fortalece tu matrimonio y familia con principios bíblicos sólidos. Talleres prácticos sobre comunicación, finanzas familiares, crianza de hijos y restauración de relaciones. Para parejas de todas las edades.",
    fecha_inicio: "2026-04-12T08:30:00",
    fecha_fin: "2026-04-12T17:30:00",
    ubicacion: "Iglesia Central, Medellín, Antioquia"
  },
  {
    nombre: "Congreso de Jóvenes: Generación de Impacto",
    descripcion: "Un evento dinámico diseñado para jóvenes de 15-30 años. Música contemporánea, conferencias motivacionales, testimonios de transformación y actividades para conectar con otros jóvenes que buscan hacer la diferencia.",
    fecha_inicio: "2026-05-08T10:00:00",
    fecha_fin: "2026-05-10T20:00:00",
    ubicacion: "Coliseo Mayor, Cali, Valle del Cauca"
  },
  {
    nombre: "Encuentro de Mujeres: Mujeres de Propósito",
    descripcion: "Un evento especialmente diseñado para mujeres que buscan descubrir y desarrollar su propósito en la vida. Incluye conferencias inspiracionales, talleres de desarrollo personal y momentos de fellowship.",
    fecha_inicio: "2026-06-20T09:00:00",
    fecha_fin: "2026-06-21T17:00:00",
    ubicacion: "Hotel Cosmos 100, Barranquilla, Atlántico"
  },
  {
    nombre: "Conferencia de Evangelismo y Misiones",
    descripcion: "Capacitación integral para evangelistas y misioneros. Estrategias modernas de evangelismo, historias misioneras inspiradoras, formación en discipulado y comisionamiento de nuevos misioneros.",
    fecha_inicio: "2026-07-25T08:00:00",
    fecha_fin: "2026-07-27T19:00:00",
    ubicacion: "Centro Misionero Internacional, Bucaramanga, Santander"
  },
  // Evento en curso (para testing)
  {
    nombre: "Jornada de Ayuno y Oración",
    descripcion: "Un tiempo especial de búsqueda de Dios a través del ayuno y la oración comunitaria. Momentos de adoración, intercesión por la nación y peticiones personales.",
    fecha_inicio: "2026-02-21T06:00:00",
    fecha_fin: "2026-02-21T22:00:00",
    ubicacion: "Iglesia Casa de Oración, Pereira, Risaralda"
  },
  // Evento pasado (para testing del historial)
  {
    nombre: "Conferencia de Adoración 2025",
    descripcion: "Una conferencia que transformó corazones a través de la adoración profunda. Con músicos reconocidos y momentos sobrenaturales de la presencia de Dios.",
    fecha_inicio: "2025-12-10T19:00:00",
    fecha_fin: "2025-12-12T21:00:00",
    ubicacion: "Auditorio León de Greiff, Universidad Nacional, Bogotá"
  }
];

async function seed_eventos() {
  console.log('🌱 Iniciando inserción de eventos de ejemplo...');
  
  try {
    for (const evento_data of eventos_ejemplo) {
      const slug = generar_slug_evento(evento_data.nombre);
      
      const evento_completo = {
        ...evento_data,
        slug: slug
      };
      
      await db.insert($eventos).values(evento_completo);
      console.log(`✅ Evento creado: "${evento_data.nombre}" (${slug})`);
    }
    
    console.log(`\n🎉 Se han insertado ${eventos_ejemplo.length} eventos de ejemplo exitosamente!`);
    console.log('\n📋 Eventos creados:');
    eventos_ejemplo.forEach((evento, index) => {
      console.log(`${index + 1}. ${evento.nombre}`);
      console.log(`   📅 ${new Date(evento.fecha_inicio).toLocaleDateString('es-ES')} - ${new Date(evento.fecha_fin).toLocaleDateString('es-ES')}`);
      console.log(`   📍 ${evento.ubicacion}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error al insertar eventos:', error);
    process.exit(1);
  }
}

// Ejecutar el seeding
seed_eventos()
  .then(() => {
    console.log('✨ Seeding completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error en el proceso de seeding:', error);
    process.exit(1);
  });