import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  // AUDIO (8 items)
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
  {
    id: '4',
    name: 'JBL Tune 770NC Wireless',
    image: 'https://m.media-amazon.com/images/I/514NPRZ1AQL._SX679_.jpg',
    category: 'Audio',
    rating: 4.2,
    features: ['Adaptive Noise Cancelling', '70H Battery', 'Fast Pair'],
    offers: [
        { store: 'Amazon.in', price: 5499, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'JBL.com', price: 5999, url: 'https://www.jbl.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: '5',
    name: 'Sennheiser Accentum Plus',
    image: 'https://m.media-amazon.com/images/I/51V1+u1n8+L._SX679_.jpg',
    category: 'Audio',
    rating: 4.6,
    features: ['Hybrid ANC', '50H Battery', 'Touch Control'],
    offers: [
        { store: 'Amazon.in', price: 14990, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'HeadphoneZone', price: 14990, url: 'https://www.headphonezone.in', currency: 'INR', inStock: true }
    ]
  },
  {
    id: '6',
    name: 'Bose QuietComfort Ultra',
    image: 'https://m.media-amazon.com/images/I/51rPbN8JtDL._SX679_.jpg',
    category: 'Audio',
    rating: 4.7,
    features: ['Spatial Audio', 'World-class ANC', 'CustomTune'],
    offers: [
        { store: 'Amazon.in', price: 35900, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'Tata Cliq', price: 35900, url: 'https://www.tatacliq.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: '7',
    name: 'Nothing Ear (2)',
    image: 'https://m.media-amazon.com/images/I/61N+VwLg6+L._SX679_.jpg',
    category: 'Audio',
    rating: 4.3,
    features: ['Hi-Res Audio', 'Smart ANC', 'Personalized Sound'],
    offers: [
        { store: 'Flipkart', price: 6999, url: 'https://www.flipkart.com', currency: 'INR', inStock: true },
        { store: 'Croma', price: 6999, url: 'https://www.croma.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: '8',
    name: 'Realme Buds Air 5 Pro',
    image: 'https://m.media-amazon.com/images/I/61-9mK6gGPL._SL1500_.jpg',
    category: 'Audio',
    rating: 4.4,
    features: ['50dB ANC', 'LDAC', '40H Playback'],
    offers: [
        { store: 'Amazon.in', price: 4499, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'Realme.com', price: 4999, url: 'https://www.realme.com', currency: 'INR', inStock: true }
    ]
  },
  // PHONES (8 items)
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
  {
    id: 'p4',
    name: 'Google Pixel 8 Pro',
    image: 'https://m.media-amazon.com/images/I/7120GgCjCjL._SX679_.jpg',
    category: 'Smartphones',
    rating: 4.4,
    features: ['Tensor G3', 'Gemini Nano', 'Best Take'],
    offers: [
        { store: 'Flipkart', price: 98999, url: 'https://www.flipkart.com', currency: 'INR', inStock: true },
        { store: 'Croma', price: 99999, url: 'https://www.croma.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'p5',
    name: 'Nothing Phone (2a)',
    image: 'https://m.media-amazon.com/images/I/717M-Am9F3L._SL1500_.jpg', 
    category: 'Smartphones',
    rating: 4.3,
    features: ['Glyph Interface', 'Dimensity 7200', 'Unique Design'],
    offers: [
        { store: 'Flipkart', price: 23999, url: 'https://www.flipkart.com', currency: 'INR', inStock: true },
        { store: 'Croma', price: 24999, url: 'https://www.croma.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'p6',
    name: 'Xiaomi 14 Ultra',
    image: 'https://m.media-amazon.com/images/I/71ecRz1bapL._SX679_.jpg',
    category: 'Smartphones',
    rating: 4.7,
    features: ['Leica Optics', 'Snapdragon 8 Gen 3', 'WQHD+ AMOLED'],
    offers: [
        { store: 'Amazon.in', price: 99999, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'Mi.com', price: 99999, url: 'https://www.mi.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'p7',
    name: 'Vivo X100 Pro',
    image: 'https://m.media-amazon.com/images/I/61imgC3JykL._SX679_.jpg',
    category: 'Smartphones',
    rating: 4.6,
    features: ['Zeiss APO Camera', 'Dimensity 9300', '100W FlashCharge'],
    offers: [
        { store: 'Flipkart', price: 89999, url: 'https://www.flipkart.com', currency: 'INR', inStock: true },
        { store: 'Croma', price: 89999, url: 'https://www.croma.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'p8',
    name: 'Motorola Edge 50 Pro',
    image: 'https://m.media-amazon.com/images/I/7151-1-Y-IL._SL1500_.jpg',
    category: 'Smartphones',
    rating: 4.3,
    features: ['Pantone Validated', '125W Charging', '144Hz pOLED'],
    offers: [
        { store: 'Flipkart', price: 31999, url: 'https://www.flipkart.com', currency: 'INR', inStock: true },
        { store: 'Motorola', price: 31999, url: 'https://www.motorola.in', currency: 'INR', inStock: true }
    ]
  },
  // SHOES (8 items)
  {
    id: 's1',
    name: 'Nike Air Jordan 1 Retro High',
    image: 'https://m.media-amazon.com/images/I/71+1J2kVqGL._SY695_.jpg',
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
    image: 'https://m.media-amazon.com/images/I/71s8sA4yVLL._SY695_.jpg',
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
    image: 'https://m.media-amazon.com/images/I/712y1d17F4L._SY695_.jpg',
    category: 'Fashion',
    rating: 4.4,
    features: ['Nitro Foam', 'PUMAGRIP', 'Breathable Mesh'],
    offers: [
        { store: 'Puma', price: 8999, url: 'https://in.puma.com', currency: 'INR', inStock: true },
        { store: 'Amazon', price: 6500, url: 'https://www.amazon.in', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 's4',
    name: 'New Balance 574 Core',
    image: 'https://m.media-amazon.com/images/I/71w6g0-sFLL._SY695_.jpg',
    category: 'Fashion',
    rating: 4.6,
    features: ['ENCAP Midsole', 'Suede Mesh', 'Heritage Style'],
    offers: [
        { store: 'New Balance', price: 8999, url: 'https://www.newbalance.co.in', currency: 'INR', inStock: true },
        { store: 'Ajio', price: 7999, url: 'https://www.ajio.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 's5',
    name: 'Nike Air Max 90',
    image: 'https://m.media-amazon.com/images/I/71uXXjC8c+L._SY695_.jpg',
    category: 'Fashion',
    rating: 4.7,
    features: ['Max Air Unit', 'Waffle Sole', 'Comfort'],
    offers: [
        { store: 'Nike.com', price: 11895, url: 'https://www.nike.com', currency: 'INR', inStock: true },
        { store: 'Myntra', price: 10999, url: 'https://www.myntra.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 's6',
    name: 'Converse Chuck 70 High',
    image: 'https://m.media-amazon.com/images/I/71s+m3p0b3L._SY695_.jpg',
    category: 'Fashion',
    rating: 4.8,
    features: ['Canvas Upper', 'OrthoLite Cushioning', 'Vintage Style'],
    offers: [
        { store: 'Converse.in', price: 5999, url: 'https://www.converse.in', currency: 'INR', inStock: true },
        { store: 'VegNonVeg', price: 5999, url: 'https://www.vegnonveg.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 's7',
    name: 'Vans Old Skool',
    image: 'https://m.media-amazon.com/images/I/81e5S+7gJGL._SY695_.jpg',
    category: 'Fashion',
    rating: 4.5,
    features: ['Suede/Canvas', 'Waffle Sole', 'Skate Ready'],
    offers: [
        { store: 'Vans.in', price: 5499, url: 'https://www.vans.in', currency: 'INR', inStock: true },
        { store: 'Ajio', price: 4999, url: 'https://www.ajio.com', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 's8',
    name: 'ASICS Gel-Kayano 30',
    image: 'https://m.media-amazon.com/images/I/61Q6S4w5d2L._SY695_.jpg',
    category: 'Fashion',
    rating: 4.7,
    features: ['4D GUIDANCE SYSTEM', 'PureGEL', 'Stability'],
    offers: [
        { store: 'ASICS', price: 15999, url: 'https://www.asics.com', currency: 'INR', inStock: true },
        { store: 'Amazon', price: 14500, url: 'https://www.amazon.in', currency: 'INR', inStock: true }
    ]
  },
  // GAMING & ACCESSORIES
  {
    id: 'g1',
    name: 'Sony INZONE H3 Gaming Headset',
    image: 'https://m.media-amazon.com/images/I/61d4+vL+2BL._SL1500_.jpg',
    category: 'Gaming',
    rating: 4.1,
    features: ['360 Spatial Sound', 'Flip-up Mic', 'PC/PS5'],
    offers: [
      { store: 'Amazon.in', price: 6990, url: 'https://www.amazon.in/s?k=Sony+INZONE+H3', currency: 'INR', inStock: true },
      { store: 'JioMart', price: 6499, url: 'https://www.jiomart.com/search/Sony%20INZONE%20H3', currency: 'INR', inStock: true },
    ]
  },
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
  },
  {
    id: 'g3',
    name: 'Logitech G502 HERO Mouse',
    image: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._SX679_.jpg',
    category: 'Gaming',
    rating: 4.8,
    features: ['25K Sensor', 'RGB', 'Tunable Weights'],
    offers: [
        { store: 'Amazon.in', price: 3995, url: 'https://www.amazon.in', currency: 'INR', inStock: true },
        { store: 'Mdcomputers', price: 3800, url: 'https://www.mdcomputers.in', currency: 'INR', inStock: true }
    ]
  },
  {
    id: 'g4',
    name: 'Keychron K2 Mechanical Keyboard',
    image: 'https://m.media-amazon.com/images/I/7154g6K22+L._SX679_.jpg',
    category: 'Gaming',
    rating: 4.7,
    features: ['Wireless', 'Mac/Windows', 'Gateron Switches'],
    offers: [
        { store: 'Keychron.in', price: 7999, url: 'https://www.keychron.in', currency: 'INR', inStock: true },
        { store: 'Meckeys', price: 7499, url: 'https://www.meckeys.com', currency: 'INR', inStock: true }
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