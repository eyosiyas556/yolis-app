export interface Product {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  specs: {
    voltage?: string;
    power?: string;
    warranty: string;
    dimensions?: string;
    grade: string;
  };
  benefits: Array<{ title: string; desc: string }>;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export interface BankSettings {
  telebirrPhone: string;
  telebirrName: string;
  cbeAccount: string;
  cbeName: string;
  cbeBranch: string;
  currency: string;
}

export const INITIAL_BANK_SETTINGS: BankSettings = {
  telebirrPhone: "+251 911 234 567",
  telebirrName: "Yolanda Beauty Equipment Ltd",
  cbeAccount: "1000 4829 1948 2",
  cbeName: "Yolanda Beauty Equipment Import PLC",
  cbeBranch: "Finfine Main Branch, Addis Ababa",
  currency: "ETB",
};

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Hair Salon Equipment",
    slug: "hair-salon",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    itemCount: 18,
  },
  {
    id: "cat-2",
    name: "Facial & Spa Machines",
    slug: "facial-spa",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    itemCount: 14,
  },
  {
    id: "cat-3",
    name: "Makeup & Vanity Stations",
    slug: "makeup-vanity",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    itemCount: 12,
  },
  {
    id: "cat-4",
    name: "Nail & Pedicure Thrones",
    slug: "nail-pedicure",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
    itemCount: 9,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Pro Hydra-Facial Dermabrasion 9-in-1",
    category: "Facial & Spa Machines",
    subtitle: "Deep pore infusion & skin rejuvenation",
    price: 48500,
    originalPrice: 56000,
    rating: 4.9,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    isNewArrival: true,
    isBestSeller: true,
    specs: {
      voltage: "220V - 50Hz (Ethiopian Standard)",
      power: "350W Medical Pump",
      warranty: "2-Year Salon Warranty",
      dimensions: "45 x 38 x 92 cm",
      grade: "Commercial Spa Grade",
    },
    benefits: [
      { title: "Deep Hydration", desc: "Infuses serums directly into dermal layers" },
      { title: "Pore Cleansing", desc: "Vacuum suction extraction" },
      { title: "Skin Tightening", desc: "RF radiofrequency wand" },
      { title: "All Skin Types", desc: "Safe for sensitive & acne-prone skin" },
    ],
    description: "The gold standard for modern Ethiopian beauty clinics and luxury spas. Features vacuum hydra-peeling, cold hammer, RF contouring, oxygen spray gun, and ultrasonic scrubbers in one heavy-duty chassis.",
  },
  {
    id: "prod-2",
    name: "Ozone Salon Hooded Hair Steamer & Dryer",
    category: "Hair Salon Equipment",
    subtitle: "Deep oil conditioning & rapid color processing",
    price: 18900,
    originalPrice: 22500,
    rating: 4.8,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    isBestSeller: true,
    specs: {
      voltage: "220V Salon Voltage",
      power: "650W High Output",
      warranty: "1-Year Commercial Warranty",
      dimensions: "Height Adjustable 110-150cm",
      grade: "Heavy Duty Metal Stand",
    },
    benefits: [
      { title: "Steam Infusion", desc: "Opens hair cuticles for deep treatments" },
      { title: "Ozone Sterilization", desc: "Purifies scalp & eliminates dandruff" },
      { title: "Smooth Curls", desc: "Reduces frizz and split ends" },
      { title: "Timer Control", desc: "60-minute automatic shutoff" },
    ],
    description: "Essential for every women's hair salon. Delivers micro-mist ozone steam to accelerate hair mask absorption and hair dye development by up to 50% compared to conventional dryers.",
  },
  {
    id: "prod-3",
    name: "Luxury Reclining Hydraulic Salon Styling Chair",
    category: "Hair Salon Equipment",
    subtitle: "Heavy duty cast base & memory foam padding",
    price: 24500,
    originalPrice: 28900,
    rating: 4.9,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    specs: {
      power: "Hydraulic Foot Pump",
      warranty: "3-Year Hydraulic Pump Warranty",
      dimensions: "Seat Width: 52cm, Height: 85-102cm",
      grade: "300kg Load Bearing",
    },
    benefits: [
      { title: "Reclining Back", desc: "Smooth 140-degree recline for makeup" },
      { title: "Premium Leather", desc: "Stain-resistant PU leather" },
      { title: "360 Rotation", desc: "Easy swivel with foot locking" },
      { title: "Ergonomic Comfort", desc: "High-density molded sponge" },
    ],
    description: "Multi-purpose styling chair ideal for hair cuts, hair treatments, facial threading, and makeup artistry. Equipped with an ultra-quiet hydraulic lift and durable stainless steel base.",
  },
  {
    id: "prod-4",
    name: "Dimmable LED Hollywood Vanity Station Mirror",
    category: "Makeup & Vanity Stations",
    subtitle: "3 color temperatures with USB & power outlets",
    price: 15800,
    originalPrice: 19500,
    rating: 4.8,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    specs: {
      voltage: "100-240V Multi-voltage",
      power: "15 Replaceable Frosted LED Bulbs",
      warranty: "1-Year Warranty",
      dimensions: "80 x 65 cm Large Frame",
      grade: "Shatterproof HD Glass",
    },
    benefits: [
      { title: "True Color Tint", desc: "CRI 95+ professional lighting" },
      { title: "Touch Dimmer", desc: "Warm, Natural, and Cool light modes" },
      { title: "Built-in Sockets", desc: "Charge phones and plug hair straighteners" },
      { title: "Wall or Desk", desc: "Mountable or tabletop base" },
    ],
    description: "The makeup artist’s centerpiece. Flawless shadow-free illumination guarantees bridal and photoshoot makeup looks true to color in any lighting condition.",
  },
  {
    id: "prod-6",
    name: "Professional 18-inch Bi-Color Salon Ring Light",
    category: "Makeup & Vanity Stations",
    subtitle: "With heavy-duty tripod & dual phone holders",
    price: 8900,
    originalPrice: 11200,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    specs: {
      voltage: "Multi-voltage 100-240V",
      power: "65W High Lumen Output",
      warranty: "1-Year Warranty",
      dimensions: "Extendable 2-meter steel stand",
      grade: "Studio Grade",
    },
    benefits: [
      { title: "Zero Flicker", desc: "Perfect for TikTok & Instagram videos" },
      { title: "Remote Control", desc: "Adjust brightness without leaving chair" },
      { title: "Dual Phone Mount", desc: "Record tutorials while streaming" },
      { title: "Carry Bag", desc: "Portable for on-location weddings" },
    ],
    description: "Designed for content-creating beauty salons and makeup studios. Shows client hairstyles and makeup transformations in crisp, high-definition natural glow.",
  },
];

export const TRUST_BADGES = [
  { id: "b1", title: "100% Commercial Grade", subtitle: "Built for busy salons", icon: "badge" },
  { id: "b2", title: "1-Year Warranty", subtitle: "Full parts & support", icon: "shield" },
  { id: "b3", title: "Verified Salon Certified", subtitle: "Safe 220V standards", icon: "sparkle" },
  { id: "b4", title: "Direct Salon Orders", subtitle: "Quick phone confirmation", icon: "badge" },
  { id: "b5", title: "Direct Salon Importer", subtitle: "Commercial Beauty Equipment", icon: "award" },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    author: "Sara Kebede",
    salon: "Luxe Glow Salon & Spa (Bole, Addis Ababa)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "We ordered 3 styling chairs and the 9-in-1 hydra-facial machine. Our order was confirmed quickly and arrived safely for our Bole salon!",
    rating: 5,
  },
  {
    id: "t2",
    author: "Marta Haile",
    salon: "Queen Hair & Makeup Studio (Sarbet)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    quote: "The Hollywood mirrors and ozone hair steamers are authentic commercial quality. Best supplier for serious beauty salon owners in Ethiopia.",
    rating: 5,
  },
];
