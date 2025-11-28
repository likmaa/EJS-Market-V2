// Données mockées des produits - À remplacer par un appel API réel

export interface MockProduct {
  id: string;
  name: string;
  creator: string;
  category: string;
  categoryLabel: string;
  image: string;
  price: number;
}

export const mockProducts: MockProduct[] = [
  // Électronique - Apple
  { id: '1', name: 'iPhone 15 Pro', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', price: 1199 },
  { id: '2', name: 'iPhone 15 Pro Max', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', price: 1399 },
  { id: '3', name: 'MacBook Pro M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', price: 1999 },
  { id: '4', name: 'MacBook Air M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', price: 1299 },
  { id: '5', name: 'iPad Pro 12.9"', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', price: 1099 },
  { id: '6', name: 'Apple Watch Ultra 2', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500', price: 899 },
  { id: '7', name: 'AirPods Pro 2', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500', price: 279 },
  { id: '8', name: 'iMac 24" M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', price: 1499 },
  
  // Électronique - Gaming
  { id: '9', name: 'PlayStation 5', creator: 'Sony', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', price: 499 },
  { id: '10', name: 'Xbox Series X', creator: 'Microsoft', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', price: 499 },
  { id: '11', name: 'Nintendo Switch OLED', creator: 'Nintendo', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500', price: 349 },
  { id: '12', name: 'Steam Deck', creator: 'Valve', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=500', price: 549 },
  
  // Photo & Vidéo
  { id: '13', name: 'Sony Alpha 7 IV', creator: 'Sony', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 2799 },
  { id: '14', name: 'Canon EOS R5', creator: 'Canon', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 3899 },
  { id: '15', name: 'DJI Mavic 3 Pro', creator: 'DJI', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500', price: 2199 },
  { id: '16', name: 'GoPro Hero 12', creator: 'GoPro', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=500', price: 449 },
  { id: '17', name: 'Sony FX3 Cinema Camera', creator: 'Sony', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 3999 },
  
  // Jardinage
  { id: '18', name: 'Robot Tondeuse Automower 430X', creator: 'Husqvarna', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 2499 },
  { id: '19', name: 'Tondeuse Robot Gardena', creator: 'Gardena', category: 'garden', categoryLabel: 'Univers Jardin', image: '/jard2.jpg', price: 899 },
  { id: '20', name: 'Tronçonneuse STIHL MS 271', creator: 'STIHL', category: 'garden', categoryLabel: 'Univers Jardin', image: '/jard3.jpg', price: 349 },
  { id: '21', name: 'Tondeuse Robot Worx Landroid', creator: 'Worx', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 1299 },
  { id: '22', name: 'Aspirateur Souffleur STIHL', creator: 'STIHL', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 199 },
  { id: '23', name: 'Taille-haie Électrique Bosch', creator: 'Bosch', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 149 },
  { id: '24', name: 'Système d\'Arrosage Connecté Gardena', creator: 'Gardena', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 299 },
  { id: '25', name: 'Robot Tondeuse Automower 315X', creator: 'Husqvarna', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 1799 },
  
  // Mobilité
  { id: '26', name: 'Trottinette Électrique Xiaomi Pro 2', creator: 'Xiaomi', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 399 },
  { id: '27', name: 'Trottinette Électrique Segway Ninebot', creator: 'Segway', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 599 },
  { id: '28', name: 'Hoverboard Smart Balance', creator: 'Smart Balance', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 249 },
  { id: '29', name: 'Vélo Électrique Trek', creator: 'Trek', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 2499 },
  { id: '30', name: 'Skateboard Électrique Boosted', creator: 'Boosted', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 1299 },
  
  // Outils
  { id: '31', name: 'Perceuse Visseuse Sans Fil Bosch', creator: 'Bosch', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 129 },
  { id: '32', name: 'Scie Circulaire Makita', creator: 'Makita', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 199 },
  { id: '33', name: 'Ponceuse Excentrique Festool', creator: 'Festool', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 449 },
  { id: '34', name: 'Meuleuse d\'Angle DeWalt', creator: 'DeWalt', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 179 },
  
  // Électronique - Autres
  { id: '35', name: 'Aspirateur Robot Roomba i7+', creator: 'iRobot', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', price: 599 },
  { id: '36', name: 'Enceinte Sonos Era 300', creator: 'Sonos', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', price: 449 },
  { id: '37', name: 'Écran Gaming Samsung Odyssey', creator: 'Samsung', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', price: 799 },
  { id: '38', name: 'Casque Sony WH-1000XM5', creator: 'Sony', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', price: 399 },
];


