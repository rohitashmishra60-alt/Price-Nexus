import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  // AUDIO
  {
    id: '1',
    name: 'Sony WH-CH520 Wireless Headphones',
    image: 'https://m.media-amazon.com/images/I/41lArSiD5hL._SX450_.jpg',
    category: 'Audio',
    rating: 4.4,
    features: ['50-hour Battery', 'Lightweight', 'Multipoint Connection'],
    offers: [
      { store: 'Amazon.in', price: 3990, url: 'https://www.amazon.in/s?k=Sony+WH-CH520', currency: 'INR', inStock: true },
      { store: 'Flipkart', price: 3499, url: 'https://www.flipkart.com/search?q=Sony+WH-CH520', currency: 'INR', inStock: true },
      { store: 'Croma', price: 3999, url: 'https://www.croma.com/search/?text=Sony+WH-CH520', currency: 'INR', inStock: true },
    ]
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Noise Cancelling',
    image: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SL1000_.jpg',
    category: 'Electronics',
    rating: 4.8,
    features: ['Best-in-class ANC', '30hr Battery', 'Alexa Built-in'],
    offers: [
      { store: 'Amazon.in', price: 26990, url: 'https://www.amazon.in/s?k=Sony+WH-1000XM5', currency: 'INR', inStock: true },
      { store: 'Reliance Digital', price: 26990, url: 'https://www.reliancedigital.in/search?q=Sony+WH-1000XM5', currency: 'INR', inStock: true },
    ]
  },
  {
    id: '3',
    name: 'Sony WH-CH720N Noise Cancelling',
    image: 'https://m.media-amazon.com/images/I/51+t0-N8ZUL._SX679_.jpg',
    category: 'Audio',
    rating: 4.5,
    features: ['V1 Processor', '35hr Battery', 'Dual Noise Sensor'],
    offers: [
      { store: 'Amazon.in', price: 9990, url: 'https://www.amazon.in/s?k=Sony+WH-CH720N', currency: 'INR', inStock: true },
      { store: 'Flipkart', price: 7990, url: 'https://www.flipkart.com/search?q=Sony+WH-CH720N', currency: 'INR', inStock: true },
    ]
  },
  // PHONES
  {
    id: 'p1',
    name: 'Apple iPhone 15 (128 GB)',
    image: 'https://m.media-amazon.com/images/I/71d7rfEX06L._SX679_.jpg',
    category: 'Smartphones',
    rating: 4.6,
    features: ['Dynamic Island', '48MP Main Camera', 'USB-C'],
    offers: [
        { store: 'Amazon.in', price: 71999, url: 'https://www.amazon.in/s?k=iphone+15', currency: 'INR', inStock: true },
        { store: 'Flipkart', price: 65999, url: 'https://www.flipkart.com/search?q=iphone+15', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://m.media-amazon.com/images/I/71CXhVxpW0L._SX679_.jpg',
    category: 'Smartphones',
    rating: 4.9,
    features: ['Galaxy AI', '200MP Camera', 'Titanium Frame'],
    offers: [
        { store: 'Amazon.in', price: 129999, url: 'https://www.amazon.in/s?k=s24+ultra', currency: 'INR', inStock: true },
        { store: 'Samsung Shop', price: 129999, url: 'https://www.samsung.com/in', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'p3',
    name: 'OnePlus 12 (16GB RAM)',
    image: 'https://m.media-amazon.com/images/I/717Qo4MH97L._SX679_.jpg',
    category: 'Smartphones',
    rating: 4.5,
    features: ['Snapdragon 8 Gen 3', 'Hasselblad Camera', '100W Charging'],
    offers: [
        { store: 'Amazon.in', price: 64999, url: 'https://www.amazon.in/s?k=oneplus+12', currency: 'INR', inStock: true },
        { store: 'OnePlus Store', price: 64999, url: 'https://www.oneplus.in', currency: 'INR', inStock: true }
    ]
  },
  // SHOES
  {
    id: 's1',
    name: 'Nike Air Jordan 1 Retro High',
    image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png',
    category: 'Fashion',
    rating: 4.7,
    features: ['Leather Upper', 'Air Cushioning', 'Classic Design'],
    offers: [
        { store: 'Nike.com', price: 16995, url: 'https://www.nike.com/in', currency: 'INR', inStock: true },
        { store: 'VegNonVeg', price: 18000, url: 'https://www.vegnonveg.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 's2',
    name: 'Adidas Ultraboost Light',
    image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0fbed4646c1d46e0a596afbd01175643_9366/Ultraboost_Light_Shoes_Black_HQ6339_01_standard.jpg',
    category: 'Fashion',
    rating: 4.5,
    features: ['Light BOOST', 'Primeknit', 'Running'],
    offers: [
        { store: 'Adidas', price: 18999, url: 'https://www.adidas.co.in', currency: 'INR', inStock: true },
        { store: 'Myntra', price: 15000, url: 'https://www.myntra.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 's3',
    name: 'Puma Velocity Nitro 2',
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/195337/01/sv01/fnd/IND/fmt/png/Velocity-NITRO-2-Men',
    category: 'Fashion',
    rating: 4.4,
    features: ['Nitro Foam', 'PUMAGRIP', 'Breathable Mesh'],
    offers: [
        { store: 'Puma', price: 8999, url: 'https://in.puma.com', currency: 'INR', inStock: true },
        { store: 'Amazon', price: 6500, url: 'https://www.amazon.in', currency: 'INR', inStock: true }
    ]
  },
  // GAMING
  {
    id: 'g1',
    name: 'Sony INZONE H3 Gaming Headset',
    image: 'https://m.media-amazon.com/images/I/61M4+w+gK6L._SX679_.jpg',
    category: 'Gaming',
    rating: 4.1,
    features: ['360 Spatial Sound', 'Flip-up Mic', 'PC/PS5'],
    offers: [
      { store: 'Amazon.in', price: 6990, url: 'https://www.amazon.in/s?k=Sony+INZONE+H3', currency: 'INR', inStock: true },
      { store: 'JioMart', price: 6499, url: 'https://www.jiomart.com/search/Sony%20INZONE%20H3', currency: 'INR', inStock: true },
    ]
  },
  // WATCHES & BAGS
  {
    id: 'w1',
    name: 'Fossil Gen 6 Smartwatch',
    image: 'https://m.media-amazon.com/images/I/61M-rP-vLGL._SX679_.jpg',
    category: 'Fashion',
    rating: 4.0,
    features: ['Wear OS', 'Fast Charging', 'SpO2'],
    offers: [
        { store: 'Amazon.in', price: 23995, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'Fossil', price: 23995, url: 'https://www.fossil.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'b1',
    name: 'American Tourister Backpack',
    image: 'https://m.media-amazon.com/images/I/81k1q6k7gmL._SX679_.jpg',
    category: 'Bags',
    rating: 4.3,
    features: ['32L Capacity', 'Laptop Compartment', 'Water Resistant'],
    offers: [
        { store: 'Amazon.in', price: 1599, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'Flipkart', price: 1499, url: 'https://www.flipkart.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'g2',
    name: 'Ray-Ban Aviator Sunglasses',
    image: 'https://m.media-amazon.com/images/I/51w+jXq+K+L._UX679_.jpg',
    category: 'Fashion',
    rating: 4.6,
    features: ['UV Protection', 'Metal Frame', 'Classic Style'],
    offers: [
        { store: 'Lenskart', price: 8590, url: 'https://www.lenskart.com', currency: 'INR', inStock: true },
        { store: 'Amazon', price: 7800, url: 'https://www.amazon.in', currency: 'INR', inStock: true }
    ]
  }
];

export const searchMockProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) return resolve([]);
      
      const lowerQuery = query.toLowerCase();
      
      // Improved filtering: Check individual words to be more permissive
      const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
      
      const filtered = MOCK_PRODUCTS.filter(p => {
        const text = (p.name + " " + p.category + " " + p.features.join(" ")).toLowerCase();
        // Return true if at least one significant query word matches
        if (queryWords.length === 0) return true;
        return queryWords.some(word => text.includes(word));
      });
      
      resolve(filtered);
    }, 800);
  });
};