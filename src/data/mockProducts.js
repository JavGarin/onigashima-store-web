// Mock product data for demo purposes
// This replaces Supabase data with local simulated products

import artBookFantasyMagic from '../assets/img-products/artBookFantasyMagic.avif';
import artBookFantasyMagic2 from '../assets/img-products/artBookFantasyMagic_2.avif';
import aventuraRpgColeccionista from '../assets/img-products/Aventura_RPG_Edición_Coleccionista_2.avif';
import aventuraRpgColeccionistaGuys from '../assets/img-products/Aventura_RPG_Edición_Coleccionista_guys.avif';
import luffyGear5_1 from '../assets/img-products/luffy_gear5_1.avif';
import luffyGear5_2 from '../assets/img-products/luffy_gear5_2.avif';
import namiPirate1 from '../assets/img-products/nami_pirate1.avif';
import namiPirate2 from '../assets/img-products/nami_pirate2.avif';
import gundamWing1 from '../assets/img-products/Mobile_Suit_Gundam_Wing1.avif';
import gundamWing2 from '../assets/img-products/Mobile_Suit_Gundam_Wing2_converted.avif';
import powerCsm1 from '../assets/img-products/power_csm1_converted.avif';
import powerCsm2 from '../assets/img-products/power_csm2_converted.avif';

export const mockProducts = [
  {
    id: 1,
    name: 'Art Book "Fantasy & Magic"',
    description: 'Edición oficial de colección del Art Book "Fantasy & Magic". Incluye más de 250 páginas a todo color con ilustraciones exclusivas, arte conceptual, bocetos de producción y encuadernación de tapa dura de lujo con estampado foil dorado. Importado directamente desde Japón.',
    price: 89000,
    category: 'Libros y Mangas',
    stock: 12,
    image_url: artBookFantasyMagic,
    image_url_2: artBookFantasyMagic2,
    rating: 4.9,
    reviews: 84,
    tags: ['Edición Deluxe', 'Novedad'],
    created_at: '2026-02-10T10:00:00Z'
  },
  {
    id: 2,
    name: 'Aventura RPG: Edición Coleccionista',
    description: 'Juego de mesa de fantasía épica y rol táctico. Incluye un tablero modular de alta calidad, más de 40 miniaturas de héroes y criaturas míticas, 200+ cartas de hechizos y equipo, dados personalizados y un libro de misiones con campañas ramificadas. Diseñado para 1 a 5 jugadores.',
    price: 79990,
    category: 'Juegos de Mesa',
    stock: 15,
    image_url: aventuraRpgColeccionista,
    image_url_2: aventuraRpgColeccionistaGuys,
    rating: 4.9,
    reviews: 142,
    tags: ['Edición Coleccionista', 'Fantasía Épica'],
    created_at: '2026-02-09T14:30:00Z'
  },
  {
    id: 3,
    name: 'Monkey D. Luffy Gear 5 - "Sun God Nika"',
    description: 'Estatua de colección premium que captura a Monkey D. Luffy en su despertar definitivo: Gear 5, el Dios del Sol Nika. Fabricada con resina y PVC de alta definición, efectos de humo y nubes traslúcidas con acabado perlado, relámpagos dinámicos y base diorámica temática. Incluye piezas intercambiables.',
    price: 94990,
    category: 'Anime',
    stock: 8,
    image_url: luffyGear5_1,
    image_url_2: luffyGear5_2,
    rating: 5.0,
    reviews: 312,
    tags: ['Edición Limitada', 'Best Seller'],
    created_at: '2026-02-08T09:15:00Z'
  },
  {
    id: 4,
    name: 'Nami - Cat Burglar "Pirate Warrior"',
    description: 'Figura de colección de Nami, la astuta navegante de los Sombrero de Paja. Presentada en su icónica pose de combate portando una espada de bucanera, con escultura dinámica en su cabello y vestimenta, acabados de pintura de alta fidelidad y base con efectos marinos.',
    price: 68990,
    category: 'Anime',
    stock: 18,
    image_url: namiPirate1,
    image_url_2: namiPirate2,
    rating: 4.8,
    reviews: 156,
    tags: ['Edición Coleccionista', 'Novedad'],
    created_at: '2026-02-07T16:45:00Z'
  },
  {
    id: 5,
    name: 'Mobile Suit Gundam Wing Zero - Master Grade',
    description: 'Figura mecha de alta fidelidad del legendario Wing Gundam Zero (Endless Waltz). Cuenta con estructura interna articulada con piezas die-cast, alas emplumadas desplegables con apertura múltiple, Twin Buster Rifle combinable, sables de haz de energía y base expositora con soporte para vuelo dinámico.',
    price: 129990,
    category: 'Mecha',
    stock: 6,
    image_url: gundamWing1,
    image_url_2: gundamWing2,
    rating: 4.9,
    reviews: 98,
    tags: ['Edición Master Grade', 'Mecha'],
    created_at: '2026-02-06T11:20:00Z'
  },
  {
    id: 6,
    name: 'Power - Blood Fiend Chainsaw Man',
    description: 'Figura oficial de colección de Power, la Mujer Demonio de Sangre de Chainsaw Man. Esculpida capturando su energía caótica y expresión desafiante, con sus cuernos carmesí característicos, acabados de pintura de alta gama y base temática.',
    price: 58990,
    category: 'Anime',
    stock: 12,
    image_url: powerCsm1,
    image_url_2: powerCsm2,
    rating: 4.8,
    reviews: 178,
    tags: ['Best Seller', 'Trending'],
    created_at: '2026-02-05T13:00:00Z'
  }
];

// Helper function to get product by ID
export const getProductById = (id) => {
  return mockProducts.find(product => product.id === parseInt(id));
};

// Helper function to get featured products (first N products)
export const getFeaturedProducts = (limit = 6) => {
  return mockProducts.slice(0, limit);
};

// Helper function to get all products
export const getAllProducts = () => {
  return mockProducts;
};

// Helper function to get all unique categories
export const getAllCategories = () => {
  const categories = ['All', ...new Set(mockProducts.map(product => product.category))];
  return categories;
};

export default mockProducts;
