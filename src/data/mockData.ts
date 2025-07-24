import { Product, Restaurant, Category } from '@/types';
import burgerImg from '@/assets/burger.jpg';
import friesImg from '@/assets/fries.jpg';
import drinkImg from '@/assets/drink.jpg';

export const restaurant: Restaurant = {
  id: 'toque-de-amor',
  name: 'Toque de Amor Lanches e Hambúrguer',
  description: 'Hambúrgueres artesanais e lanches deliciosos com ingredientes frescos',
  image: '/placeholder-restaurant.jpg',
  rating: 4.5,
  deliveryTime: '30-45 min',
  deliveryFee: 4.99,
  minimumOrder: 25.00,
  isOpen: true,
  openTime: '11:00',
  categories: ['Hambúrgueres', 'Lanches', 'Batatas', 'Bebidas']
};

export const categories: Category[] = [
  { id: 'promocoes', name: 'Promoção do Dia', order: 1 },
  { id: 'especiais', name: 'Especial Da Casa', order: 2 },
  { id: 'pratos', name: 'Pratos Especiais', order: 3 },
  { id: 'combos', name: 'Combos promocionais - Hambúrguer', order: 4 },
  { id: 'batatas', name: 'Batata Frita', order: 5 },
  { id: 'tradicionais', name: 'Hambúrguer Tradicional', order: 6 },
  { id: 'artesanais', name: 'Hambúrguer Artesanais', order: 7 },
  { id: 'bebidas', name: 'Bebidas', order: 8 }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Batata Frita porção 400gr (in natura)',
    description: 'Batata frita porção 400gr (in natura). Crocante, sequinhas, levemente salgadas, perfeita para o seu lanche.',
    price: 31.90,
    originalPrice: 38.00,
    image: friesImg,
    category: 'batatas',
    serves: '4 pessoas',
    volume: '400g',
    isAvailable: true,
    isFeatured: true,
    tags: ['entrega rápida', 'entrega gratis', 'desconto', 'promoção', 'barato'],
    order: 1
  },
  {
    id: '2',
    name: 'Soda Italiana - bebida',
    description: 'A Soda italiana é uma bebida refrescante e leve, feita com água gaseificada, xarope aromatizado e gelo.',
    price: 12.90,
    originalPrice: 15.00,
    image: drinkImg,
    category: 'bebidas',
    serves: '1 pessoa',
    volume: '300ml',
    isAvailable: true,
    isFeatured: true,
    order: 1
  },
  {
    id: '3',
    name: 'Batata Frita + Refrigerante Lata',
    description: 'Delicie-se com o nosso combo promocional que é um verdadeiro clássico: Batata Frita + Refrigerante Lata. São aproximadamente 150 gramas de batatas crocantes e douradas, fritas na medida certa, acompanhadas de um refrigerante em lata de 350ml para matar a sede.',
    price: 19.90,
    originalPrice: 23.00,
    image: friesImg,
    category: 'combos',
    serves: '1 pessoa',
    isAvailable: true,
    isFeatured: true,
    order: 1
  },
  {
    id: '4',
    name: 'Promoção Dobradinha - compre 2 X-Burguer e ganhe 2 Guaracamp natural',
    description: 'Na compra de 2 X-Burguer ganhe 2 Guaracamp natural. Aproveite nossas promoções e descontos incríveis.',
    price: 32.90,
    originalPrice: 38.00,
    image: burgerImg,
    category: 'promocoes',
    serves: '2 pessoas',
    isAvailable: true,
    isFeatured: true,
    tags: ['bebida gelada'],
    order: 1
  },
  {
    id: '5',
    name: 'X-Burguer Artesanal',
    description: 'Hambúrguer artesanal com blend especial, queijo, alface, tomate, cebola e molho especial da casa.',
    price: 24.90,
    image: burgerImg,
    category: 'artesanais',
    serves: '1 pessoa',
    isAvailable: true,
    order: 1
  },
  {
    id: '6',
    name: 'X-Bacon Tradicional',
    description: 'Hambúrguer tradicional com bacon crocante, queijo, alface, tomate e maionese.',
    price: 22.90,
    image: burgerImg,
    category: 'tradicionais',
    serves: '1 pessoa',
    isAvailable: true,
    order: 1
  },
  {
    id: '7',
    name: 'Coca-Cola Lata 350ml',
    description: 'Refrigerante Coca-Cola gelado em lata de 350ml.',
    price: 6.90,
    image: drinkImg,
    category: 'bebidas',
    serves: '1 pessoa',
    volume: '350ml',
    isAvailable: true,
    order: 2
  },
  {
    id: '8',
    name: 'Batata Frita Pequena',
    description: 'Porção pequena de batata frita crocante e sequinha.',
    price: 15.90,
    image: friesImg,
    category: 'batatas',
    serves: '1-2 pessoas',
    volume: '200g',
    isAvailable: true,
    order: 2
  }
];