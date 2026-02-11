// Mock product data for demo purposes
// This replaces Supabase data with local simulated products

import figuraJoker from '../assets/img-products/figuraJoker.png';
import figuraLevi from '../assets/img-products/figuraLevi.png';
import figuraLufy from '../assets/img-products/figuraLufy.png';
import figuraNamiPirata from '../assets/img-products/figuraNamiPirata.png';
import figuraOptimusPrime from '../assets/img-products/figuraOptimusPrime.png';
import figuraPowerCsm from '../assets/img-products/figuraPowerCsm.png';
import figuraSpiderman from '../assets/img-products/figuraSpiderman.png';
import figuraSungJinWoo from '../assets/img-products/figuraSungJinWoo.png';
import figuraTurboman from '../assets/img-products/figuraTurboman.png';

export const mockProducts = [
  {
    id: 1,
    name: 'Joker Premium Figure',
    description: 'Highly detailed Joker collectible figure featuring authentic costume design and premium paint application. Perfect for DC Comics enthusiasts and collectors. Includes display stand and interchangeable accessories.',
    price: 79.99,
    category: 'DC Comics',
    stock: 15,
    image_url: figuraJoker,
    rating: 4.8,
    reviews: 127,
    tags: ['Best Seller', 'Premium'],
    created_at: '2026-02-10T10:00:00Z'
  },
  {
    id: 2,
    name: 'Levi Ackerman Attack on Titan',
    description: 'Captain Levi in his iconic Survey Corps uniform. Masterfully crafted with exceptional attention to detail, featuring his signature blades and ODM gear. A must-have for Attack on Titan fans.',
    price: 69.99,
    category: 'Anime',
    stock: 22,
    image_url: figuraLevi,
    rating: 4.9,
    reviews: 203,
    tags: ['New Arrival', 'Fan Favorite'],
    created_at: '2026-02-09T14:30:00Z'
  },
  {
    id: 3,
    name: 'Monkey D. Luffy Gear 5',
    description: 'The legendary Straw Hat Captain in his ultimate form! This stunning figure captures Luffy\'s Gear 5 transformation with dynamic pose and vibrant colors. Premium quality construction with meticulous detailing.',
    price: 89.99,
    category: 'Anime',
    stock: 8,
    image_url: figuraLufy,
    rating: 5.0,
    reviews: 312,
    tags: ['Limited Edition', 'Best Seller'],
    created_at: '2026-02-08T09:15:00Z'
  },
  {
    id: 4,
    name: 'Nami Pirate Warrior Edition',
    description: 'The Navigator of the Straw Hat Pirates in her battle-ready outfit. Features her iconic Clima-Tact weapon and fierce expression. Exceptional paint work and sculpting quality.',
    price: 64.99,
    category: 'Anime',
    stock: 18,
    image_url: figuraNamiPirata,
    rating: 4.7,
    reviews: 156,
    tags: ['New Arrival'],
    created_at: '2026-02-07T16:45:00Z'
  },
  {
    id: 5,
    name: 'Optimus Prime Masterpiece',
    description: 'The legendary Autobot leader in all his glory. This masterpiece edition features premium die-cast parts, intricate transformation mechanism, and movie-accurate details. A centerpiece for any Transformers collection.',
    price: 149.99,
    category: 'Transformers',
    stock: 5,
    image_url: figuraOptimusPrime,
    rating: 4.9,
    reviews: 89,
    tags: ['Premium', 'Limited Edition'],
    created_at: '2026-02-06T11:20:00Z'
  },
  {
    id: 6,
    name: 'Power Chainsaw Man Figure',
    description: 'The Blood Fiend in her iconic look! Captures Power\'s chaotic energy and distinctive personality. High-quality sculpting with vibrant colors and dynamic pose. Includes her signature horns and menacing expression.',
    price: 74.99,
    category: 'Anime',
    stock: 12,
    image_url: figuraPowerCsm,
    rating: 4.8,
    reviews: 178,
    tags: ['Best Seller', 'Trending'],
    created_at: '2026-02-05T13:00:00Z'
  },
  {
    id: 7,
    name: 'Spider-Man Web Slinger Deluxe',
    description: 'Your friendly neighborhood Spider-Man in an action-packed pose! Features detailed web effects, interchangeable hands, and premium articulation. Perfect for Marvel collectors and Spidey fans.',
    price: 59.99,
    category: 'Marvel',
    stock: 25,
    image_url: figuraSpiderman,
    rating: 4.6,
    reviews: 241,
    tags: ['Fan Favorite'],
    created_at: '2026-02-04T08:30:00Z'
  },
  {
    id: 8,
    name: 'Sung Jin-Woo Shadow Monarch',
    description: 'The Shadow Monarch himself! This premium figure showcases Sung Jin-Woo in his powerful Shadow Monarch form with glowing effects and dramatic pose. Exceptional detail and craftsmanship from Solo Leveling.',
    price: 94.99,
    category: 'Anime',
    stock: 7,
    image_url: figuraSungJinWoo,
    rating: 5.0,
    reviews: 267,
    tags: ['Limited Edition', 'Premium', 'Best Seller'],
    created_at: '2026-02-03T15:45:00Z'
  },
  {
    id: 9,
    name: 'Turboman Action Hero Classic',
    description: 'The ultimate action hero from the classic film! Retro-styled collectible with authentic details and nostalgic charm. Features iconic costume and heroic pose. A perfect addition to any vintage toy collection.',
    price: 54.99,
    category: 'Retro',
    stock: 14,
    image_url: figuraTurboman,
    rating: 4.5,
    reviews: 92,
    tags: ['Retro Classic'],
    created_at: '2026-02-02T12:00:00Z'
  }
];

// Helper function to get product by ID
export const getProductById = (id) => {
  return mockProducts.find(product => product.id === parseInt(id));
};

// Helper function to get featured products (first N products)
export const getFeaturedProducts = (limit = 5) => {
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

// Helper function to get paginated products
export const getPaginatedProducts = (page = 0, perPage = 8) => {
  const start = page * perPage;
  const end = start + perPage;
  return {
    products: mockProducts.slice(start, end),
    total: mockProducts.length,
    hasMore: end < mockProducts.length
  };
};

export default mockProducts;
