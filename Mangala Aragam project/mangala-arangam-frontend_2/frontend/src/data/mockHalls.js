// Mock data standing in for GET /api/halls until the backend is built.
export const HALL_STATUS = {
  AVAILABLE: 'AVAILABLE',
  BOOKING_PENDING: 'BOOKING_PENDING',
  BOOKED: 'BOOKED',
  UNAVAILABLE: 'UNAVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
}

export const halls = [
  {
    id: 1,
    name: 'Sri Maha Mangala Mandapam',
    location: 'Mylapore, Chennai',
    price: 185000,
    capacity: 800,
    rating: 4.7,
    reviewCount: 132,
    facilities: ['AC', 'Dining Hall', 'Stage', 'Parking', 'Catering', 'Generator'],
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'A traditional mandapam near Kapaleeshwarar Temple with a pillared stage, twin dining halls and space for a full Tamil wedding ceremony including the muhurtham mandapam.',
    rooms: 12,
    parking: 60,
    status: HALL_STATUS.AVAILABLE,
    owner: { name: 'R. Krishnamurthy', phone: '+91 98400 11223', businessName: 'Mylapore Mandapam Trust' },
  },
  {
    id: 2,
    name: 'Green Acres Convention Center',
    location: 'OMR, Chennai',
    price: 320000,
    capacity: 1200,
    rating: 4.5,
    reviewCount: 98,
    facilities: ['AC', 'Dining Hall', 'Stage', 'Parking', 'WiFi', 'Decoration', 'Rooms'],
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'A contemporary convention centre with a glass-fronted stage, banquet dining and 20 guest rooms — suited to large receptions alongside a traditional ceremony.',
    rooms: 20,
    parking: 150,
    status: HALL_STATUS.BOOKING_PENDING,
    owner: { name: 'S. Priya', phone: '+91 90030 44556', businessName: 'Green Acres Events Pvt Ltd' },
  },
  {
    id: 3,
    name: 'Annapoorna Marriage Hall',
    location: 'Tambaram, Chennai',
    price: 95000,
    capacity: 400,
    rating: 4.3,
    reviewCount: 61,
    facilities: ['Dining Hall', 'Stage', 'Parking', 'Generator'],
    image:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554941829-202a0b2403b8?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'A budget-friendly hall popular for engagement ceremonies and smaller weddings, with an in-house catering team experienced in traditional Tamil sadhya.',
    rooms: 4,
    parking: 40,
    status: HALL_STATUS.AVAILABLE,
    owner: { name: 'M. Elango', phone: '+91 93450 77889', businessName: 'Annapoorna Halls' },
  },
  {
    id: 4,
    name: 'Royal Kalyana Mahal',
    location: 'Anna Nagar, Chennai',
    price: 260000,
    capacity: 950,
    rating: 4.8,
    reviewCount: 204,
    facilities: ['AC', 'Dining Hall', 'Stage', 'Parking', 'Catering', 'Decoration', 'Rooms'],
    image:
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550005809-91ad75fb315f?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'One of Anna Nagar\'s best-rated venues, known for gold-leaf stage decor, a resident naadaswaram arrangement, and dedicated bridal rooms.',
    rooms: 16,
    parking: 100,
    status: HALL_STATUS.AVAILABLE,
    owner: { name: 'V. Lakshmi', phone: '+91 98410 22334', businessName: 'Royal Kalyana Events' },
  },
  {
    id: 5,
    name: 'Coastal Breeze Banquet',
    location: 'ECR, Chennai',
    price: 410000,
    capacity: 600,
    rating: 4.6,
    reviewCount: 47,
    facilities: ['AC', 'Dining Hall', 'Parking', 'WiFi', 'Decoration'],
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'An open-air seaside venue on East Coast Road, popular for evening receptions with a sunset backdrop over the Bay of Bengal.',
    rooms: 8,
    parking: 80,
    status: HALL_STATUS.MAINTENANCE,
    owner: { name: 'A. Suresh', phone: '+91 97890 66778', businessName: 'Coastal Breeze Hospitality' },
  },
  {
    id: 6,
    name: 'Sri Lakshmi Thirumana Mandapam',
    location: 'Velachery, Chennai',
    price: 140000,
    capacity: 550,
    rating: 4.4,
    reviewCount: 88,
    facilities: ['Dining Hall', 'Stage', 'Parking', 'Catering', 'Rooms'],
    image:
      'https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554941829-202a0b2403b8?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'A well-established mandapam with a traditional pillared mantapa stage, close to Velachery railway station for out-of-town guests.',
    rooms: 10,
    parking: 55,
    status: HALL_STATUS.BOOKED,
    owner: { name: 'K. Ramesh', phone: '+91 96000 55443', businessName: 'Sri Lakshmi Halls' },
  },
]

export const popularLocations = [
  { name: 'Mylapore', count: 14, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
  { name: 'Anna Nagar', count: 21, image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=600&auto=format&fit=crop' },
  { name: 'OMR', count: 9, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop' },
  { name: 'Velachery', count: 12, image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=600&auto=format&fit=crop' },
]

export const reviewsById = {
  1: [
    { id: 1, customer: 'Divya R.', rating: 5, text: 'The mandapam stage looked stunning during the muhurtham. Staff coordinated the sadhya timing perfectly.', date: '2026-05-12' },
    { id: 2, customer: 'Arun K.', rating: 4, text: 'Great location for guests coming by train, parking filled up fast though.', date: '2026-03-02' },
  ],
  4: [
    { id: 1, customer: 'Meena S.', rating: 5, text: 'Booked for my sister\'s wedding, the gold stage decor and naadaswaram arrangement were worth every rupee.', date: '2026-06-20' },
  ],
}

export function getHallById(id) {
  return halls.find((h) => String(h.id) === String(id))
}
