import { Product, Category, Address, Coupon, Order, FAQItem } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: '1',
    slug: 'vegetables-fruits',
    name: 'Vegetables & Fruits',
    icon: 'eco',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AsBLpANp5d_es0lrgkzIaSxLGD9GB7CHbft9rJYYNVDpFHqOwjXwJuHaxqkWQj-W4Hn9hMC4bkBxqcuvFrr_EuNN_VZ3t77L3mXI7Io1OvzA225DVqjUbBXlONE4MdwjxcpA54Dbvf_zFFwSJtjpZ57sDHyb_DAXgvHY03vRdiaFyTrHUbTPfZWBj46wdvRz38xZvBg9WYfs37nFMFRqWIz2RU8LGKa7f78YdWUO',
    itemCount: 142,
    subcategories: ['All Vegetables & Fruits', 'Fresh Vegetables', 'Fresh Fruits', 'Seasonal & Exotic', 'Organic Hydroponics', 'Cuts & Sprouts', 'Flowers & Leaves']
  },
  {
    id: '2',
    slug: 'dairy-bread-eggs',
    name: 'Dairy, Bread & Eggs',
    icon: 'egg_alt',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBroYrcwDQ7BlSDEWn8Yoikh-_m_j9lRsYq0R0HPZmbEXcTQN38wE3xoqxWON36qUCEZyz60j4XKNTb7PMBdZLVg4mb1P14kMsEE5CIKZKvKlhUDB8gjAngYMS0RsINWNspb1R-fXHAx8nl1J7DMNPqO7O0OiMyzP5F8qPvURIKHOQnPkAoKwT566CwABpDCCBfwZnXVsydCTg0cqd7Sybv_rzJZU-GyHw0kxDLiCPb',
    itemCount: 98,
    subcategories: ['All Dairy, Bread & Eggs', 'Milk', 'Curd & Yogurt', 'Bread & Pav', 'Butter & More', 'Eggs', 'Paneer & Tofu', 'Cheese & Slices']
  },
  {
    id: '3',
    slug: 'munchies',
    name: 'Munchies & Chips',
    icon: 'cookie',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSsp-GFm3RgQICVr0-pJDDWRVpBGI8Y-zm5YO5Bu8ZBXzR-zV6bZlT8tmUPrqKv-K805De-PiMlxJHuN3lztVoGuGwJhuPKmYsk1kQQ_xWWauVxjvGMc30s-G1VZnZHP-sYF3tKc392QYiTC2lkFsveHYEZCsR2TlvqNoAMv25q5hQ5kSpl01Y_x_PXUeNJKVw0cnxgDPA3oTzuEhVnNx7crqVOMTgb8xDV1m3-p4r',
    itemCount: 120,
    subcategories: ['All Munchies', 'Chips & Crisps', 'Nachos & Dips', 'Bhujia & Namkeen', 'Popcorn & Puffs', 'Roasted Snacks']
  },
  {
    id: '4',
    slug: 'cold-drinks-juices',
    name: 'Cold Drinks & Juices',
    icon: 'local_bar',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFo8Ld2j7KkZkCj8a4ePek1Uv8N5sY0_7Qh9p3T6w4hE_8lYp5aB4V0b_8nF7oZ7w0qT5eE9d0kF2c1b8Z9pQ8aB4V0b_8nF7oZ7w0qT5eE9d0kF2c1b8Z9pQ8aB4V0b_8nF7oZ7w0qT5eE9d0kF2c1b8Z9pQ',
    itemCount: 86,
    subcategories: ['All Drinks', 'Soft Drinks & Sodas', 'Fruit Juices', 'Energy Drinks', 'Mineral Water', 'Iced Tea & Milkshakes']
  },
  {
    id: '5',
    slug: 'instant-frozen-food',
    name: 'Instant & Frozen Food',
    icon: 'ramen_dining',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMtlGdxwOiFk2HrGwdLc8yj8Pca5fasIOI9nVNSEG5LNxaQ30_Uo8jE9MGFbLgRC8TdFeUhMNXHxG3xrfeaYDnm_7UIqWQJV0dJFlq8IGSpZLUnA3uD_ESPN6ZBAm6yodGZJojeJR7O5s7A5FDKJzWtUPitbxbAt_zWmKYvreuFp5B5aV6AEcjvP8LbULAlXGG63zSSvKFPbk1p5KPVnKNHQNKo8_ebg4Sl1phy2N-',
    itemCount: 74,
    subcategories: ['All Instant Food', 'Noodles & Vermicelli', 'Pasta & Sauces', 'Frozen Veg Snacks', 'Ready to Cook', 'Soups']
  },
  {
    id: '6',
    slug: 'tea-coffee',
    name: 'Tea & Coffee',
    icon: 'coffee',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUrjsR2SqP2CE5QHVrn6G8AHS3bAPYKYxT0HYjBWfjHie2HeIu1srUoj6kvOo17Oc0Ah6mwQb-7QzV8mZEp4b435I2Ro1VYBvQYH3VGgd-KWTlPcxYKvvpPrjdK5h0laIrZS4ByD5ztIXxi52yZWRaTH0p3j7Rra3uZ4VvWxk1rgIjfn3J37vJZDW4pPw6XRzjX_MswC2XQm1q8eapnGl-HxvbYVIE5NuvpapcDjT4',
    itemCount: 65,
    subcategories: ['All Tea & Coffee', 'Leaf & Dust Tea', 'Green & Herbal Tea', 'Instant Coffee', 'Ground & Filter Coffee']
  },
  {
    id: '7',
    slug: 'bakery-biscuits',
    name: 'Bakery & Biscuits',
    icon: 'bakery_dining',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDReXQxIsCQP0Xlg_TApjfDqrvy_xOZ33HXp4cmOSh_9h0ds4PdBcgYYIsNNwPzzkzoeQNORVfryQMbQ9_jQRCb0n4xXdzlYDzUo53_FrcztqRHYFI990czFQuMNDpntnd59o25MngKExSoMBZPrkBlIWnctZfkvIEMp_dhEu8Eb-MTmh6EpZB5-sn-Ej5esrmrOVZcY6jWR04VylAA0vJ7TCpZzRqL4D0hTVWlsAGj',
    itemCount: 88,
    subcategories: ['All Bakery', 'Cookies & Cream Biscuits', 'Healthy Digestive Biscuits', 'Rusk & Khari', 'Cakes & Muffins']
  },
  {
    id: '8',
    slug: 'sweet-tooth',
    name: 'Sweet Tooth',
    icon: 'icecream',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoTd1ly4ZOvQeVYfL5N-HTPQfUKJTEmegiDAORp1FeEfW7v1sa5Jpk2h4U5W3DKbb5urHYT8TZT1MM3UI9kQHjZAYb3YU4Hy-7YBE329Bd2Z4MTsuRp-s8EVrgrMxeuv7ag9IbbQEiY1vy9R91niR3GvS4aO3XPzkJBjLHVSA168Mh0CWwy_uqYEruhFSGQL8p2v8BBlGGlSN9p1EgXYniIil23U3atPfpVCQAZs0v',
    itemCount: 110,
    subcategories: ['All Sweets', 'Chocolates & Bars', 'Indian Traditional Sweets', 'Ice Creams & Kulfi', 'Dessert Mixes']
  },
  {
    id: '9',
    slug: 'atta-rice-dal',
    name: 'Atta, Rice & Dal',
    icon: 'grain',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjV3d8hAbKPngjFOXsqX_laQOrqW_Hde6HSh5EblPXgmN1dn0zd0HtDzFxTbQhEY1-zZef4VPfiSLzdirfU_02YJQifj7TNxgktJKiz31Sx2R4yjNbzJss9aY2RjIvulOwkk6UP-03ln0s_cShGY5rRfbwSZtDV0t-RqljUgXpg6OH01ufScdbpF5BFwg-nb-wu93FY4Pp1P2DWh3SQRgbdqBgdcoftINyB7QWOVah',
    itemCount: 130,
    subcategories: ['All Staples', 'Chakki Fresh Atta', 'Basmati & Regular Rice', 'Dals & Pulses', 'Edible Oils & Ghee']
  },
  {
    id: '10',
    slug: 'cleaning-essentials',
    name: 'Cleaning Essentials',
    icon: 'cleaning_services',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGWV6DuPoNb5gOYtu7bWKIpSl21uwf6MhoXSwT1nrXWiBW7OhsuxokmvWXHAibQVlvk1ps8g1A3ICgccq5s7sv89ouM-aA-QOShBCarwNdy_kUk3VtBlbClwlrBjgJobe8apS4WU03Y4krLHlVzb-A3B-Jherwr-HczzkCZfUn3N8rmRPyMJq7pEKmuLs1wyt1f1zUrDa2HPPoU8kXS0WYuNkiN1wUtymoUYYC8-Q6',
    itemCount: 92,
    subcategories: ['All Cleaning', 'Detergent Powders & Liquids', 'Dishwashing Gels', 'Floor & Surface Cleaners', 'Disinfectant Sprays']
  }
];

export const HERO_BANNERS = [
  {
    id: 'b1',
    title: 'Pharmacy & Healthcare Essentials in 10 minutes',
    subtitle: 'Medicines, first-aid, vitamins & daily healthcare supplies delivered instantly.',
    badge: 'Express Pharmacy',
    badgeIcon: 'bolt',
    ctaText: 'Order Pharmacy',
    categorySlug: 'cleaning-essentials',
    gradient: 'from-[#FFE08F] via-[#F8CB46] to-[#FFE08F]',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGWV6DuPoNb5gOYtu7bWKIpSl21uwf6MhoXSwT1nrXWiBW7OhsuxokmvWXHAibQVlvk1ps8g1A3ICgccq5s7sv89ouM-aA-QOShBCarwNdy_kUk3VtBlbClwlrBjgJobe8apS4WU03Y4krLHlVzb-A3B-Jherwr-HczzkCZfUn3N8rmRPyMJq7pEKmuLs1wyt1f1zUrDa2HPPoU8kXS0WYuNkiN1wUtymoUYYC8-Q6'
  },
  {
    id: 'b2',
    title: 'Fresh Fruits & Veggies Direct from Verified Farms',
    subtitle: 'Crisp greens, seasonal fruits & organic hydroponic picks sorted every dawn.',
    badge: 'Farm Harvest',
    badgeIcon: 'eco',
    ctaText: 'Explore Farm Fresh',
    categorySlug: 'vegetables-fruits',
    gradient: 'from-[#C4F2C1] via-[#E8F8E7] to-[#C4F2C1]',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AsBLpANp5d_es0lrgkzIaSxLGD9GB7CHbft9rJYYNVDpFHqOwjXwJuHaxqkWQj-W4Hn9hMC4bkBxqcuvFrr_EuNN_VZ3t77L3mXI7Io1OvzA225DVqjUbBXlONE4MdwjxcpA54Dbvf_zFFwSJtjpZ57sDHyb_DAXgvHY03vRdiaFyTrHUbTPfZWBj46wdvRz38xZvBg9WYfs37nFMFRqWIz2RU8LGKa7f78YdWUO'
  },
  {
    id: 'b3',
    title: 'Late Night Munchies & Snacks Delivered Hot & Crisp',
    subtitle: 'Craving spicy chips, sodas, chocolates, or namkeen? Knocking in 10 mins.',
    badge: 'Late Night Munchies',
    badgeIcon: 'local_fire_department',
    ctaText: 'Grab Munchies',
    categorySlug: 'munchies',
    gradient: 'from-[#FFDAD8] via-[#FFF1F0] to-[#FFDAD8]',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9e4qXw7tL80RzE_6P2l4k6qP3iV-9sM6bB8eN7k0mF2gQ5c1a8Z9pQ8aB4V0b_8nF7oZ7w0qT5eE9d0kF2c1b8Z9pQ8aB4V0b_8nF7oZ7w0qT5eE9d0kF2c1b8Z9pQ'
  }
];

export const PRODUCTS: Product[] = [
  // --- Dairy, Bread & Eggs ---
  {
    id: 'amul-taaza-milk-500',
    name: 'Amul Taaza Toned Fresh Milk',
    category: 'dairy-bread-eggs',
    subcategory: 'Milk',
    brand: 'Amul',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBroYrcwDQ7BlSDEWn8Yoikh-_m_j9lRsYq0R0HPZmbEXcTQN38wE3xoqxWON36qUCEZyz60j4XKNTb7PMBdZLVg4mb1P14kMsEE5CIKZKvKlhUDB8gjAngYMS0RsINWNspb1R-fXHAx8nl1J7DMNPqO7O0OiMyzP5F8qPvURIKHOQnPkAoKwT566CwABpDCCBfwZnXVsydCTg0cqd7Sybv_rzJZU-GyHw0kxDLiCPb',
    packWeight: '500 ml pouch',
    price: 28,
    mrp: 30,
    discount: '6% OFF',
    rating: 4.8,
    ratingCount: 14200,
    eta: '10 MINS',
    description: 'Pasteurised toned milk with 3.0% fat and 8.5% SNF. Excellent source of natural calcium and high-quality protein for daily vitality.',
    shelfLife: '2 days from packing',
    countryOfOrigin: 'India',
    manufacturer: 'Gujarat Cooperative Milk Marketing Federation Ltd. (Amul)',
    inStock: true,
    variants: [
      { weight: '500 ml pouch', price: 28, mrp: 30 },
      { weight: '1 L pouch', price: 54, mrp: 58 }
    ]
  },
  {
    id: 'amul-gold-milk-500',
    name: 'Amul Gold Full Cream Fresh Milk',
    category: 'dairy-bread-eggs',
    subcategory: 'Milk',
    brand: 'Amul',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBroYrcwDQ7BlSDEWn8Yoikh-_m_j9lRsYq0R0HPZmbEXcTQN38wE3xoqxWON36qUCEZyz60j4XKNTb7PMBdZLVg4mb1P14kMsEE5CIKZKvKlhUDB8gjAngYMS0RsINWNspb1R-fXHAx8nl1J7DMNPqO7O0OiMyzP5F8qPvURIKHOQnPkAoKwT566CwABpDCCBfwZnXVsydCTg0cqd7Sybv_rzJZU-GyHw0kxDLiCPb',
    packWeight: '500 ml pouch',
    price: 34,
    mrp: 35,
    discount: '3% OFF',
    rating: 4.9,
    ratingCount: 9800,
    eta: '10 MINS',
    description: 'Homogenised pasteurised whole milk with rich 6.0% fat and 9.0% SNF. Ideal for thick tea, homemade curd, and rich desserts.',
    shelfLife: '2 days from packing',
    countryOfOrigin: 'India',
    manufacturer: 'Amul',
    inStock: true,
    variants: [
      { weight: '500 ml pouch', price: 34, mrp: 35 },
      { weight: '1 L pouch', price: 68, mrp: 70 }
    ]
  },
  {
    id: 'mother-dairy-curd-400',
    name: 'Mother Dairy Classic Dahi Curd Tub',
    category: 'dairy-bread-eggs',
    subcategory: 'Curd & Yogurt',
    brand: 'Mother Dairy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFFc8FwI7v-KgmbnSjfagdUNMbmjzyE7-VB0BgXKc9AvNmJMd-exynBqC7q3glapUbChGgCgw_KC4R5c6PNO6CO8FksT5w-MGjZeB9ZpQrYlU5WvtzFSMu4YfV8hSvCYG7M83I3tpSgU877Bz_L2mkXPSJIzJbS2trixL-0hceovATXTWc_TJ5l-pIgXlkYLOitc3uHmi7Ah9BiTulEzqtjSlADWU4P23gw8Jg8shy',
    packWeight: '400 g tub',
    price: 35,
    mrp: 40,
    discount: '12% OFF',
    rating: 4.7,
    ratingCount: 8400,
    eta: '10 MINS',
    description: 'Thick, creamy and naturally sweet-tasting curd prepared from pure pasteurised milk with live probiotic cultures for optimal digestion.',
    shelfLife: '10 days from packaging',
    countryOfOrigin: 'India',
    manufacturer: 'Mother Dairy Fruit & Vegetable Pvt Ltd',
    inStock: true
  },
  {
    id: 'harvest-gold-white-bread',
    name: 'Harvest Gold Premium White Sandwich Bread',
    category: 'dairy-bread-eggs',
    subcategory: 'Bread & Pav',
    brand: 'Harvest Gold',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDReXQxIsCQP0Xlg_TApjfDqrvy_xOZ33HXp4cmOSh_9h0ds4PdBcgYYIsNNwPzzkzoeQNORVfryQMbQ9_jQRCb0n4xXdzlYDzUo53_FrcztqRHYFI990czFQuMNDpntnd59o25MngKExSoMBZPrkBlIWnctZfkvIEMp_dhEu8Eb-MTmh6EpZB5-sn-Ej5esrmrOVZcY6jWR04VylAA0vJ7TCpZzRqL4D0hTVWlsAGj',
    packWeight: '400 g loaf',
    price: 44,
    mrp: 50,
    discount: '12% OFF',
    rating: 4.8,
    ratingCount: 19200,
    eta: '10 MINS',
    description: 'Freshly baked soft white sandwich loaf fortified with essential vitamins and dietary minerals. Perfect for breakfast toasts and grilled sandwiches.',
    shelfLife: '5 days from packaging',
    countryOfOrigin: 'India',
    manufacturer: 'Bakebest Foods Pvt Ltd (Harvest Gold)',
    inStock: true
  },
  {
    id: 'amul-salted-butter-100',
    name: 'Amul Pasteurised Salted Butter',
    category: 'dairy-bread-eggs',
    subcategory: 'Butter & More',
    brand: 'Amul',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2vdqyERrDzsAqjtknXfjqtQJP3k0yRaLgito9sanKfWVEzNQnHIGp5HZmxC1dpMRd93bkJhkfIWKdnfXjK6OcLDT94GgnPQw5h7CpWBslcvc-ZZ42_FqXlkRb6SW26_geE2jVLdJ-iXtXVqbHJpBpJUj4CeYpYh128h3nG5lRmP-kq4LJsd9sHo5bW8n8hPZi7VMWoWLNXWBtFO7pxH0mGygfU6ATvKwml1QMPRj',
    packWeight: '100 g pack',
    price: 58,
    mrp: 60,
    discount: '3% OFF',
    rating: 4.9,
    ratingCount: 22100,
    eta: '10 MINS',
    description: 'Iconic Utterly Butterly Delicious salted butter made from fresh cream and common salt. Gold standard for parathas, dosas, and warm toast.',
    shelfLife: '9 months from packaging',
    countryOfOrigin: 'India',
    manufacturer: 'Amul',
    inStock: true
  },
  {
    id: 'farm-fresh-white-eggs-6',
    name: 'Farm Fresh White Protein Eggs',
    category: 'dairy-bread-eggs',
    subcategory: 'Eggs',
    brand: 'Eggoz',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj1Xs9JkdfIs9JkuzgnM-SO-8PPA-ipaotmVa3zxiwecMyCT7o3XAYwYhLBKBtu-eoaObkKG9eYlpn7-cmuMxP_cgqCiL31u2HJekq8McHEiTKvxE5uWrnr3xMwj1ABa6KEK7gr8MTzKEIguE5GW_rBbj6lrCI76iazCu-dJgn8UPb0cuk4dnUVsHB2B43RuT4Lj-e4U5LRnAXfES-ffOlyGweEUUBpRUPGjnIcevL',
    packWeight: '6 pieces tray',
    price: 54,
    mrp: 65,
    discount: '16% OFF',
    rating: 4.8,
    ratingCount: 16500,
    eta: '10 MINS',
    description: 'Nutrient-rich, UV-sanitized farm-fresh table eggs packed with 6g high-grade bioavailable protein per egg. Safe, clean, and antibiotic-free.',
    shelfLife: '14 days from packaging',
    countryOfOrigin: 'India',
    manufacturer: 'Eggoz Farms India',
    inStock: true
  },
  {
    id: 'amul-malai-paneer-200',
    name: 'Amul Fresh Malai Paneer Block',
    category: 'dairy-bread-eggs',
    subcategory: 'Paneer & Tofu',
    brand: 'Amul',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDReXO70XzsC3Bc8ufpJl3BUnFlKfolu7aL2WZ71iJfc1cchGJiWjQQw9YILvfoDozxW8aCOAH2FuBUl9MIDZMG0S_tTSLJ5IVXMdMtEVTFQCZrL1k9HAk1oXTNrPaSWAPvTOLjxcRNndoaogl4lxQw2D_1QRw6rZ4ny_uZ6kr0Yn7VGSwOIP1v1gkiJ5RVeIh0yHAWgCo9P-VGMInvXXWldonE_yYmKv5LdLQQC8Hl',
    packWeight: '200 g block',
    price: 92,
    mrp: 98,
    discount: '6% OFF',
    rating: 4.8,
    ratingCount: 12400,
    eta: '10 MINS',
    description: 'Soft, melt-in-the-mouth cottage cheese crafted with wholesome milk. Retains its moist texture during curries, tikkas, and bhurji.',
    shelfLife: '30 days vacuum sealed',
    countryOfOrigin: 'India',
    manufacturer: 'Amul',
    inStock: true
  },
  {
    id: 'country-delight-cow-milk',
    name: 'Country Delight Pure Desi Cow Milk',
    category: 'dairy-bread-eggs',
    subcategory: 'Milk',
    brand: 'Country Delight',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBroYrcwDQ7BlSDEWn8Yoikh-_m_j9lRsYq0R0HPZmbEXcTQN38wE3xoqxWON36qUCEZyz60j4XKNTb7PMBdZLVg4mb1P14kMsEE5CIKZKvKlhUDB8gjAngYMS0RsINWNspb1R-fXHAx8nl1J7DMNPqO7O0OiMyzP5F8qPvURIKHOQnPkAoKwT566CwABpDCCBfwZnXVsydCTg0cqd7Sybv_rzJZU-GyHw0kxDLiCPb',
    packWeight: '450 ml bottle',
    price: 45,
    mrp: 50,
    discount: '10% OFF',
    rating: 4.9,
    ratingCount: 5200,
    eta: '10 MINS',
    description: '100% natural, unadulterated cow milk sourced directly from local dairy farmers. Tested for 26 rigorous quality parameters.',
    shelfLife: '3 days from delivery',
    countryOfOrigin: 'India',
    manufacturer: 'Country Delight Farm Fresh',
    inStock: true
  },

  // --- Munchies & Chips ---
  {
    id: 'lays-magic-masala-50',
    name: "Lay's India's Magic Masala Potato Chips",
    category: 'munchies',
    subcategory: 'Chips & Crisps',
    brand: "Lay's",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSsp-GFm3RgQICVr0-pJDDWRVpBGI8Y-zm5YO5Bu8ZBXzR-zV6bZlT8tmUPrqKv-K805De-PiMlxJHuN3lztVoGuGwJhuPKmYsk1kQQ_xWWauVxjvGMc30s-G1VZnZHP-sYF3tKc392QYiTC2lkFsveHYEZCsR2TlvqNoAMv25q5hQ5kSpl01Y_x_PXUeNJKVw0cnxgDPA3oTzuEhVnNx7crqVOMTgb8xDV1m3-p4r',
    packWeight: '50 g pouch',
    price: 20,
    mrp: 20,
    rating: 4.9,
    ratingCount: 31000,
    eta: '10 MINS',
    description: 'Crispy wafer-thin potato chips tossed in an exhilarating blend of traditional Indian spices, dried mango powder, and coriander.',
    shelfLife: '4 months',
    countryOfOrigin: 'India',
    manufacturer: 'PepsiCo India Holdings',
    inStock: true
  },
  {
    id: 'kurkure-masala-munch-82',
    name: 'Kurkure Masala Munch Crunchy Puffs',
    category: 'munchies',
    subcategory: 'Chips & Crisps',
    brand: 'Kurkure',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg_9jv-dnNgEgJfYm3gOLcsTBylhurKce47hJTg_jviC9TBGOxqNWa6PE3ag07eQoPZrgDmBmmWb8jCzyknyoGW17OUTVC0BILluJqUGyE87leTOUqwkb_xMGDVgLrXrH_pywUmQV--9akP2-p-RtGasHN5XBVD_HnsUqFtQ78lF30gWE22G54FtWWQTqK5TItbJYyS9wX1db4tXBmBleM77J-OJ0AipgjqzV1F6Hq',
    packWeight: '82 g pouch',
    price: 20,
    mrp: 20,
    rating: 4.8,
    ratingCount: 24000,
    eta: '10 MINS',
    description: 'Irresistibly spicy, tedha (curved) corn and rice puffs cooked with authentic Indian condiments. India favorite tea-time crunchy delight.',
    shelfLife: '4 months',
    countryOfOrigin: 'India',
    manufacturer: 'PepsiCo India',
    inStock: true
  },
  {
    id: 'haldirams-aloo-bhujia-200',
    name: "Haldiram's Prabhuji Aloo Bhujia",
    category: 'munchies',
    subcategory: 'Bhujia & Namkeen',
    brand: "Haldiram's",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBztHrpAH9s0OrK38jrzuohceoziiCB7LMVVs44PjS_plShUBXIiowIaRpnUiYEUxDl0udBJ_8VBbPWwXMiSOZ3p9SMBvAaogMO7LMyIapshqEv4OymehA_exdgMDVaiadESolfppJKtkieSNFQ3cMZ04_UvUy4K-RYb-hZ9uyiQi2Yt4dNWzaZNjxtFooog0uZChZBPgKal6t0T77nRoqs8GlgaMwK2SWuC_BA0awc',
    packWeight: '200 g pack',
    price: 55,
    mrp: 60,
    discount: '8% OFF',
    rating: 4.9,
    ratingCount: 18400,
    eta: '10 MINS',
    description: 'Crunchy savory strands of spicy potato and gram flour seasoned with mint, red chili, and clove. Signature Indian namkeen.',
    shelfLife: '6 months',
    countryOfOrigin: 'India',
    manufacturer: "Haldiram Snacks Pvt Ltd",
    inStock: true
  },
  {
    id: 'doritos-sweet-chilli-60',
    name: 'Doritos Sweet Chilli Crunchy Nacho Chips',
    category: 'munchies',
    subcategory: 'Nachos & Dips',
    brand: 'Doritos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrglDVffEXMVSzP0ZJWsY_IShojWYYxi-leJLbW3lAxN_ixysPZ0uUkTWa1Hc_JqzmB18qQZ6YdaRsyXkeoZrGyZrLzDoKc70rodviBNcwPOxVlOBNIJYGs7coyzvRkQZ7TFOl5HvKA9B0goDXq9A9_mwtngmMFanyJca8MbEVKmkcVLiKmEDJkezBuUrx3p07q2O-fpHxs56hYPHtiu_AZ_MxO2_PjIbrWpGhXnFH',
    packWeight: '60 g bag',
    price: 30,
    mrp: 30,
    rating: 4.7,
    ratingCount: 9200,
    eta: '10 MINS',
    description: 'Tooth-rattling crunch tortilla corn chips packed with bold sweet chili glaze and aromatic roasted spices.',
    shelfLife: '5 months',
    countryOfOrigin: 'India',
    manufacturer: 'PepsiCo India',
    inStock: true
  },
  {
    id: 'pringles-original-107',
    name: 'Pringles Original Salted Potato Crisps',
    category: 'munchies',
    subcategory: 'Chips & Crisps',
    brand: 'Pringles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMtlGdxwOiFk2HrGwdLc8yj8Pca5fasIOI9nVNSEG5LNxaQ30_Uo8jE9MGFbLgRC8TdFeUhMNXHxG3xrfeaYDnm_7UIqWQJV0dJFlq8IGSpZLUnA3uD_ESPN6ZBAm6yodGZJojeJR7O5s7A5FDKJzWtUPitbxbAt_zWmKYvreuFp5B5aV6AEcjvP8LbULAlXGG63zSSvKFPbk1p5KPVnKNHQNKo8_ebg4Sl1phy2N-',
    packWeight: '107 g cylinder can',
    price: 105,
    mrp: 129,
    discount: '18% OFF',
    rating: 4.8,
    ratingCount: 11000,
    eta: '10 MINS',
    description: 'Iconic stackable saddle-shaped potato chips seasoned with fine sea salt in a protective travel-ready canister.',
    shelfLife: '12 months',
    countryOfOrigin: 'Malaysia',
    manufacturer: 'Kellogg Company',
    inStock: true
  },

  // --- Cold Drinks & Juices ---
  {
    id: 'coca-cola-750',
    name: 'Coca-Cola Original Refreshing Soft Drink',
    category: 'cold-drinks-juices',
    subcategory: 'Soft Drinks & Sodas',
    brand: 'Coca-Cola',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjV3d8hAbKPngjFOXsqX_laQOrqW_Hde6HSh5EblPXgmN1dn0zd0HtDzFxTbQhEY1-zZef4VPfiSLzdirfU_02YJQifj7TNxgktJKiz31Sx2R4yjNbzJss9aY2RjIvulOwkk6UP-03ln0s_cShGY5rRfbwSZtDV0t-RqljUgXpg6OH01ufScdbpF5BFwg-nb-wu93FY4Pp1P2DWh3SQRgbdqBgdcoftINyB7QWOVah',
    packWeight: '750 ml bottle',
    price: 40,
    mrp: 40,
    rating: 4.9,
    ratingCount: 42000,
    eta: '10 MINS',
    description: 'The world-famous bubbly, crisp, and refreshing cola beverage. Best served ice cold for parties and meals.',
    shelfLife: '6 months',
    countryOfOrigin: 'India',
    manufacturer: 'Hindustan Coca-Cola Beverages',
    inStock: true
  },
  {
    id: 'thums-up-250',
    name: 'Thums Up Charged Strong Cola Can',
    category: 'cold-drinks-juices',
    subcategory: 'Soft Drinks & Sodas',
    brand: 'Thums Up',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJQPjWsww8u7aLJOnBIO6JD5LYam683cLhH8eJuxXsKWpYnlGHDiuFkgD-lICXty6Rc0YA4Qu_uscq2IIE-MWC4KsiZHI83J0QlNHxcMikOcQOwO41Z4lcAP2C8G9QDR5F4o6DJv2HhH8yozWEaje9_4HXP9qETwxBy0ZQemlD3lOFK3cH6Ov5G2wp_mQ_5QeARMmyk6L0EbWeWQ7ClFbQrGAuWK9OVswM8G7FCx2',
    packWeight: '250 ml sleek can',
    price: 35,
    mrp: 40,
    discount: '12% OFF',
    rating: 4.8,
    ratingCount: 15400,
    eta: '10 MINS',
    description: 'Bold, spicy, thunderous Indian fizzy cola with an unmatched carbonated fizz kick. Taste the thunder!',
    shelfLife: '6 months',
    countryOfOrigin: 'India',
    manufacturer: 'Coca-Cola India',
    inStock: true
  },
  {
    id: 'real-fruit-juice-mixed-1l',
    name: 'Real Fruit Power Mixed Fruit Juice',
    category: 'cold-drinks-juices',
    subcategory: 'Fruit Juices',
    brand: 'Real',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUiTAXiZE9fk8N9gn6SgjSz79T6gdLlg30cuZltaOS7SxcrnO72_9kwkPrdEZ6KyHoORotWOpnWB2CaTGtpwHwCJ8UV6PA87qc22CAyfGcyaS1VOisjFd4q2_KojQHmX0T6iRQTV--G7lxkL-EZLR5GWQ7reqnWALLW-MojGHCufsczrNJ2_wCwgOC04L9bwMVBf4dqSc68vl1S1NUWnJrEGnZslEJYgiEhqOiJsql',
    packWeight: '1 L tetra pak',
    price: 115,
    mrp: 140,
    discount: '18% OFF',
    rating: 4.7,
    ratingCount: 13200,
    eta: '10 MINS',
    description: 'Refreshing fruit juice packed with natural goodness of 9 chosen fruits including orange, apple, mango, and guava.',
    shelfLife: '9 months',
    countryOfOrigin: 'India',
    manufacturer: 'Dabur India Ltd',
    inStock: true
  },
  {
    id: 'frooti-mango-drink-600',
    name: 'Frooti Juicy Fresh Mango Drink',
    category: 'cold-drinks-juices',
    subcategory: 'Fruit Juices',
    brand: 'Frooti',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhTM7sJpkzQATiFOwzbO2nkYq8gPTe7IXjT-BdnndiFhl6PL8oBfhONwKtaAS6pFPtLls5LsVknHgt9LYi3R9DK3GKSlsjoz9ub9QbtsZOs29c48GnpNUm5zMdhJv9fDkG8DMviEvVGuJdGrhJbhS29DDgranuJlLEz-Aw8bRjGIaLz5gZYgwPbacm9mHlOHGBFmxwvUxAt0zAhBPhQherLsz84Idm6XLy-6vURUJ-',
    packWeight: '600 ml pet bottle',
    price: 38,
    mrp: 40,
    discount: '5% OFF',
    rating: 4.8,
    ratingCount: 19800,
    eta: '10 MINS',
    description: 'Authentic Indian sweet Totapuri and Alphonso mango pulp beverage. Rich, fruity, and immensely thirst-quenching.',
    shelfLife: '6 months',
    countryOfOrigin: 'India',
    manufacturer: 'Parle Agro',
    inStock: true
  },

  // --- Vegetables & Fruits ---
  {
    id: 'fresh-red-tomatoes-1kg',
    name: 'Hybrid Fresh Red Tomatoes',
    category: 'vegetables-fruits',
    subcategory: 'Fresh Vegetables',
    brand: 'Farm Fresh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AsBLpANp5d_es0lrgkzIaSxLGD9GB7CHbft9rJYYNVDpFHqOwjXwJuHaxqkWQj-W4Hn9hMC4bkBxqcuvFrr_EuNN_VZ3t77L3mXI7Io1OvzA225DVqjUbBXlONE4MdwjxcpA54Dbvf_zFFwSJtjpZ57sDHyb_DAXgvHY03vRdiaFyTrHUbTPfZWBj46wdvRz38xZvBg9WYfs37nFMFRqWIz2RU8LGKa7f78YdWUO',
    packWeight: '1 kg pack',
    price: 36,
    mrp: 45,
    discount: '20% OFF',
    rating: 4.7,
    ratingCount: 28900,
    eta: '10 MINS',
    description: 'Firm, juicy, farm-picked red tomatoes rich in lycopene and vitamin C. Ideal for daily Indian curries, salads, and soups.',
    shelfLife: '4 days in cool storage',
    countryOfOrigin: 'India',
    manufacturer: 'Blinkit Certified Farmers',
    inStock: true
  },
  {
    id: 'fresh-shimla-apples-4',
    name: 'Royal Delicious Fresh Shimla Apples',
    category: 'vegetables-fruits',
    subcategory: 'Fresh Fruits',
    brand: 'Farm Fresh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AsBLpANp5d_es0lrgkzIaSxLGD9GB7CHbft9rJYYNVDpFHqOwjXwJuHaxqkWQj-W4Hn9hMC4bkBxqcuvFrr_EuNN_VZ3t77L3mXI7Io1OvzA225DVqjUbBXlONE4MdwjxcpA54Dbvf_zFFwSJtjpZ57sDHyb_DAXgvHY03vRdiaFyTrHUbTPfZWBj46wdvRz38xZvBg9WYfs37nFMFRqWIz2RU8LGKa7f78YdWUO',
    packWeight: '4 pcs (approx. 600g)',
    price: 139,
    mrp: 170,
    discount: '18% OFF',
    rating: 4.8,
    ratingCount: 8400,
    eta: '10 MINS',
    description: 'Crisp, aromatic Himachal apples hand-sorted for uniform sweetness, vibrant ruby color, and juicy crunch.',
    shelfLife: '7 days',
    countryOfOrigin: 'India',
    manufacturer: 'Himachal Orchard Produce',
    inStock: true
  },

  // --- Sweet Tooth & Chocolates ---
  {
    id: 'cadbury-silk-150',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    category: 'sweet-tooth',
    subcategory: 'Chocolates & Bars',
    brand: 'Cadbury',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoTd1ly4ZOvQeVYfL5N-HTPQfUKJTEmegiDAORp1FeEfW7v1sa5Jpk2h4U5W3DKbb5urHYT8TZT1MM3UI9kQHjZAYb3YU4Hy-7YBE329Bd2Z4MTsuRp-s8EVrgrMxeuv7ag9IbbQEiY1vy9R91niR3GvS4aO3XPzkJBjLHVSA168Mh0CWwy_uqYEruhFSGQL8p2v8BBlGGlSN9p1EgXYniIil23U3atPfpVCQAZs0v',
    packWeight: '150 g bar',
    price: 175,
    mrp: 190,
    discount: '7% OFF',
    rating: 4.9,
    ratingCount: 38000,
    eta: '10 MINS',
    description: 'Velvety smooth, melt-in-your-mouth milk chocolate made from finest cocoa butter and dairy cream. Perfect indulgence.',
    shelfLife: '12 months',
    countryOfOrigin: 'India',
    manufacturer: 'Mondelez India Foods',
    inStock: true
  },

  // --- Atta, Rice & Dal ---
  {
    id: 'aashirvaad-sharbati-atta-5kg',
    name: 'Aashirvaad Sharbati Select Whole Wheat Atta',
    category: 'atta-rice-dal',
    subcategory: 'Chakki Fresh Atta',
    brand: 'Aashirvaad',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjV3d8hAbKPngjFOXsqX_laQOrqW_Hde6HSh5EblPXgmN1dn0zd0HtDzFxTbQhEY1-zZef4VPfiSLzdirfU_02YJQifj7TNxgktJKiz31Sx2R4yjNbzJss9aY2RjIvulOwkk6UP-03ln0s_cShGY5rRfbwSZtDV0t-RqljUgXpg6OH01ufScdbpF5BFwg-nb-wu93FY4Pp1P2DWh3SQRgbdqBgdcoftINyB7QWOVah',
    packWeight: '5 kg bag',
    price: 295,
    mrp: 340,
    discount: '13% OFF',
    rating: 4.9,
    ratingCount: 45000,
    eta: '10 MINS',
    description: '100% MP Sharbati whole wheat grains ground using traditional stone chakki process. Yields ultra-soft golden rotis with extra sweetness.',
    shelfLife: '6 months',
    countryOfOrigin: 'India',
    manufacturer: 'ITC Limited',
    inStock: true
  },
  {
    id: 'daawat-biryani-rice-1kg',
    name: 'Daawat Ultima Extra Long Basmati Rice',
    category: 'atta-rice-dal',
    subcategory: 'Basmati & Regular Rice',
    brand: 'Daawat',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjV3d8hAbKPngjFOXsqX_laQOrqW_Hde6HSh5EblPXgmN1dn0zd0HtDzFxTbQhEY1-zZef4VPfiSLzdirfU_02YJQifj7TNxgktJKiz31Sx2R4yjNbzJss9aY2RjIvulOwkk6UP-03ln0s_cShGY5rRfbwSZtDV0t-RqljUgXpg6OH01ufScdbpF5BFwg-nb-wu93FY4Pp1P2DWh3SQRgbdqBgdcoftINyB7QWOVah',
    packWeight: '1 kg pouch',
    price: 185,
    mrp: 220,
    discount: '16% OFF',
    rating: 4.8,
    ratingCount: 16200,
    eta: '10 MINS',
    description: 'Aged 2 years for unmatched royal aroma and fluffy grains that elongate up to 24mm when cooked. Perfect for aromatic dum biryanis and pulao.',
    shelfLife: '24 months',
    countryOfOrigin: 'India',
    manufacturer: 'LT Foods Ltd',
    inStock: true
  },

  // --- Instant & Frozen Food ---
  {
    id: 'maggi-noodles-4-pack',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    category: 'instant-frozen-food',
    subcategory: 'Noodles & Vermicelli',
    brand: 'Maggi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMtlGdxwOiFk2HrGwdLc8yj8Pca5fasIOI9nVNSEG5LNxaQ30_Uo8jE9MGFbLgRC8TdFeUhMNXHxG3xrfeaYDnm_7UIqWQJV0dJFlq8IGSpZLUnA3uD_ESPN6ZBAm6yodGZJojeJR7O5s7A5FDKJzWtUPitbxbAt_zWmKYvreuFp5B5aV6AEcjvP8LbULAlXGG63zSSvKFPbk1p5KPVnKNHQNKo8_ebg4Sl1phy2N-',
    packWeight: '280 g (Pack of 4)',
    price: 56,
    mrp: 60,
    discount: '6% OFF',
    rating: 4.9,
    ratingCount: 52000,
    eta: '10 MINS',
    description: 'Indias most beloved instant noodles seasoned with aromatic Tastemaker spices, roasted onion, and coriander. Quick snack in 2 minutes.',
    shelfLife: '9 months',
    countryOfOrigin: 'India',
    manufacturer: 'Nestle India Limited',
    inStock: true
  }
];

export const INITIAL_SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    name: 'Omkar Chauhan',
    phone: '+91 98765 43210',
    houseNo: 'Flat 402, Tower B, Green Meadows',
    apartmentRoad: 'Sector 48, Sohna Road',
    landmark: 'Near Central Park Plaza',
    city: 'Gurugram, Haryana',
    pincode: '122018',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'Work',
    name: 'Omkar Chauhan',
    phone: '+91 98765 43210',
    houseNo: 'Building 10A, 6th Floor',
    apartmentRoad: 'DLF Cyber City, Phase 2',
    landmark: 'Opposite IndusInd Bank Metro',
    city: 'Gurugram, Haryana',
    pincode: '122002',
    isDefault: false
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'BLINKIT50',
    title: 'Flat 50% OFF up to ₹100',
    description: 'Applicable on orders above ₹199 across all grocery essentials.',
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 199,
    maxDiscount: 100,
    expiryDate: 'Exp. in 4 days'
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Zero delivery fee waiver on orders above ₹99.',
    discountType: 'flat',
    discountValue: 25,
    minOrderValue: 99,
    expiryDate: 'Exp. in 7 days'
  },
  {
    code: 'SUPER20',
    title: 'Flat ₹50 OFF',
    description: 'Save flat ₹50 on Dairy, Bread and Munchies orders over ₹350.',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 350,
    expiryDate: 'Exp. in 12 days'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'BLK-98214',
    date: 'Today, 11:42 AM',
    items: [
      {
        product: PRODUCTS[0], // Amul Taaza
        quantity: 2,
        selectedWeight: '500 ml pouch'
      },
      {
        product: PRODUCTS[3], // Harvest Gold Bread
        quantity: 1,
        selectedWeight: '400 g loaf'
      },
      {
        product: PRODUCTS[5], // Farm Fresh Eggs
        quantity: 1,
        selectedWeight: '6 pieces tray'
      }
    ],
    address: INITIAL_SAVED_ADDRESSES[0],
    paymentMethod: 'UPI (Google Pay)',
    itemTotal: 154,
    handlingFee: 4,
    deliveryFee: 0,
    tip: 20,
    discount: 25,
    grandTotal: 153,
    status: 'on_the_way',
    etaMinutes: 8,
    driverName: 'Ramesh Kumar',
    driverPhone: '+91 98112 34567'
  },
  {
    id: 'ord-102',
    orderNumber: 'BLK-87103',
    date: 'Yesterday, 6:15 PM',
    items: [
      {
        product: PRODUCTS[6], // Lay's
        quantity: 2,
        selectedWeight: '50 g pouch'
      },
      {
        product: PRODUCTS[10], // Coca-Cola
        quantity: 1,
        selectedWeight: '750 ml bottle'
      },
      {
        product: PRODUCTS[13], // Cadbury Silk
        quantity: 1,
        selectedWeight: '150 g bar'
      }
    ],
    address: INITIAL_SAVED_ADDRESSES[0],
    paymentMethod: 'Credit Card (HDFC)',
    itemTotal: 255,
    handlingFee: 4,
    deliveryFee: 15,
    tip: 10,
    discount: 50,
    grandTotal: 234,
    status: 'delivered',
    etaMinutes: 0,
    driverName: 'Mohd. Salim',
    driverPhone: '+91 98711 00234',
    rating: 5,
    review: 'Superfast delivery in 9 minutes, nicely packed!'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'f1',
    category: 'Orders & Delivery',
    question: 'How does Blinkit deliver in 10-12 minutes?',
    answer: 'Blinkit operates a vast network of localized micro-fulfillment partner stores (dark stores) within a 2-3 km radius of your neighborhood. Advanced algorithmic shelf picking and dedicated delivery partners ensure orders are packed in under 2 minutes and dispatched immediately.'
  },
  {
    id: 'f2',
    category: 'Orders & Delivery',
    question: 'What is the minimum order value for free delivery?',
    answer: 'Standard delivery is free on orders above ₹149. For smaller orders under ₹149, a nominal delivery fee of ₹15 to ₹25 applies depending on local partner availability.'
  },
  {
    id: 'f3',
    category: 'Payments & Refunds',
    question: 'What payment methods are supported?',
    answer: 'We support all major payment modes including UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking across 50+ banks, Wallets, and Cash on Delivery (COD).'
  },
  {
    id: 'f4',
    category: 'Payments & Refunds',
    question: 'How do instant refunds work for cancelled or returned items?',
    answer: 'If you cancel an order or report damaged/missing items, the refund is initiated instantaneously. UPI and wallet refunds reflect within seconds to 2 hours; credit/debit card refunds reflect in 2-4 business days.'
  },
  {
    id: 'f5',
    category: 'Cancellations & Returns',
    question: 'Can I cancel an order once placed?',
    answer: 'Yes, orders can be freely cancelled within 1 minute of placement before the partner store begins physical packaging. Once dispatched, cancellation is restricted to protect delivery partner transit safety.'
  }
];

export const INITIAL_ADDRESSES = INITIAL_SAVED_ADDRESSES;
