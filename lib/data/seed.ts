import type { ProductRecord } from '@/types/visart';

export const SEED_PRODUCTS: ProductRecord[] = [
  {
    id: 'demo-bamboo-basket',
    artisan_id: 'artisan-pabitra-das',
    image_url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    is_published: true,
    artisan: {
      id: 'artisan-pabitra-das',
      name: 'Pabitra Das',
      location: 'Nalbari, Assam',
      craft: 'Bamboo & Cane Craft',
      preferred_language: 'as',
    },
    input_data: {
      productName: 'Handwoven Bamboo Basket',
      material: 'Native Assam Bamboo',
      productionCost: 450,
      timeRequired: '2 days',
      location: 'Nalbari, Assam',
      craftStory: 'Woven by hand using split mature bamboo stalks cured in natural river water, utilizing geometric weaving techniques passed down through generations of village artisans.',
      category: 'Home & Storage',
      targetPrice: 999,
    },
    generated_data: {
      product: {
        title: 'Handcrafted Assamese Bamboo Utility Basket',
        shortDescription: 'Naturally cured bamboo basket intricately handwoven over two days in Assam for rustic storage and enduring daily utility.',
        description: 'Meticulously handcrafted in Nalbari, Assam, this multipurpose storage basket is shaped from locally harvested, mature green bamboo. The bamboo strips are finely split and smoothed by hand before being interlaced in a dense, interlocking weave that ensures structural strength without excess weight. Finished with a sturdy wrapped rim, it functions gracefully as a bread basket, fruit vessel, or bespoke home organizer.',
        category: 'Home Living & Storage',
        material: '100% Biodegradable Assam Bamboo',
        craftTechnique: 'Open-plait split bamboo weaving with reinforced double-ring rim',
        keywords: [
          'handwoven bamboo basket',
          'Assam bamboo craft',
          'eco friendly storage',
          'handmade artisan basket',
          'sustainable home decor'
        ],
        tags: [
          'BambooCraft',
          'HandmadeInAssam',
          'SustainableLiving',
          'ArtisanMade',
          'ZeroPlastic'
        ],
      },
      pricing: {
        currency: 'INR',
        min: 899,
        recommended: 999,
        max: 1199,
        rationale: [
          'Material: ₹180 for selected mature bamboo and natural treatment.',
          'Labour: ₹270 for 16 hours of precise splitting and plaiting over 2 days.',
          'Craft Skill & Margin: Fair artisan wage + structural reinforcement allowance.'
        ],
        disclaimer: 'AI-assisted estimate based on verified raw material costs and production duration in Northeast India.',
      },
      marketing: {
        instagram: '🌿 From the bamboo groves of Assam to your conscious home. Hand-split, smoothed, and woven over two full days, this multipurpose basket brings sustainable utility and timeless tactile beauty to every countertop. DM to order directly from Pabitra Das.',
        whatsapp: 'Namaste! Pabitra Das from Nalbari, Assam here. I have crafted fresh batches of our traditional handwoven bamboo utility baskets. Sturdy, 100% natural, and made over 2 days of handwork. Price: ₹999. Reply here to reserve yours!',
        shortAd: 'Handcrafted Assam Bamboo Storage Basket — 100% natural, durable, and woven in 2 days. ₹999.',
      },
      translations: {
        hindi: {
          title: 'असमिया हस्तनिर्मित बांस की उपयोगिता टोकरी',
          description: 'असम के नलबाड़ी में स्थानीय बांस से दो दिनों में तैयार की गई मजबूत और पर्यावरण-अनुकूल टोकरी। भंडारण और दैनिक घरेलू उपयोग के लिए सर्वोत्तम।',
        },
        kannada: {
          title: 'ಅಸ್ಸಾಂನ ಕೈಯಿಂದ ನೇಯ್ದ ಬಿದಿರಿನ ಉಪಯುಕ್ತ ಬುಟ್ಟಿ',
          description: 'ಅಸ್ಸಾಂನ ನಲ್ಬಾರಿಯಲ್ಲಿ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ 2 ದಿನಗಳ ಕಾಲ ಸೂಕ್ಷ್ಮವಾಗಿ ಕೈಯಿಂದ ನೇಯ್ದ ಪರಿಸರಸ್ನೇಹಿ ಮತ್ತು ಬಾಳಿಕೆ ಬರುವ ಶೇಖರಣಾ ಬುಟ್ಟಿ.',
        },
      },
      story: {
        title: 'Shaped by the Waters and Groves of Nalbari',
        body: 'In Pabitra Das’s courtyard, craft begins with selecting three-year-old bamboo stalks known for flexibility and strength. Using traditional curved paring knives, each stalk is split into paper-thin strips and woven with rhythmic precision honed over decades.',
      },
      readiness: {
        overall: 82,
        photography: 78,
        description: 92,
        discoverability: 84,
        pricingPresentation: 81,
        marketing: 75,
        topActions: [
          'Capture a close-up photo highlighting the intricate weave texture and wrapped rim.',
          'Add exact dimensional measurements (diameter and height in cm).',
          'Include care guidance for cleaning with a damp natural cloth.'
        ],
      },
    },
  },
  {
    id: 'demo-chanderi-saree',
    artisan_id: 'artisan-kailash-kori',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    is_published: true,
    artisan: {
      id: 'artisan-kailash-kori',
      name: 'Kailash Kori',
      location: 'Chanderi, Madhya Pradesh',
      craft: 'Handloom Silk Weaving',
      preferred_language: 'hi',
    },
    input_data: {
      productName: 'Chanderi Silk Saree with Zari Border',
      material: 'Pure Chanderi Silk and Cotton Blend with Zari',
      productionCost: 1800,
      timeRequired: '5 days',
      location: 'Chanderi, Madhya Pradesh',
      craftStory: 'Woven on traditional pit-looms using sheer silk warp and fine cotton weft, accented with delicate gold zari butis inspired by historical monuments of Chanderi.',
      category: 'Textiles & Apparel',
      targetPrice: 4200,
    },
    generated_data: {
      product: {
        title: 'Authentic Handloom Chanderi Silk Saree with Fine Zari',
        shortDescription: 'Featherlight Chanderi saree handwoven on pit looms over five days with traditional gold zari motifs.',
        description: 'Celebrated for its gossamer texture and luminous drape, this authentic Chanderi saree is handwoven by master weaver Kailash Kori in Madhya Pradesh. Blending pure silk warp with unbleached fine cotton weft, it features intricate hand-inserted gold zari bootis and an understated temple border that glimmers gracefully in soft light.',
        category: 'Handloom Textiles & Apparel',
        material: 'Silk-Cotton Warp & Fine Zari Weft',
        craftTechnique: 'Traditional pit-loom extra-weft booti weaving',
        keywords: [
          'Chanderi silk saree',
          'authentic handloom saree',
          'Madhya Pradesh weaver',
          'pit loom silk cotton',
          'gold zari handloom'
        ],
        tags: [
          'ChanderiSaree',
          'HandloomIndia',
          'WeaversOfIndia',
          'SilkSaree',
          'VocalForLocal'
        ],
      },
      pricing: {
        currency: 'INR',
        min: 3800,
        recommended: 4200,
        max: 4800,
        rationale: [
          'Raw Materials: ₹1,800 for high-count silk yarn, treated cotton, and certified zari threads.',
          'Artisan Labour: ₹1,600 for 40 hours of dedicated pit-loom maneuvering over 5 days.',
          'Direct Weaver Margin: Ensures fair livelihood without middleman commission.'
        ],
        disclaimer: 'AI-assisted valuation calculated using current yarn indices and direct-to-artisan fair wage standards.',
      },
      marketing: {
        instagram: '✨ Sheer elegance woven one thread at a time. Master weaver Kailash Kori brings centuries of Chanderi pit-loom heritage to life in this lightweight, gold-accented drape. Five days of devotion, zero mass machinery. Direct orders open via message.',
        whatsapp: 'Pranam! Kailash Kori from Chanderi. I have freshly completed a pure handloom Chanderi silk saree featuring delicate gold zari bootis. Lightweight, breathable, and woven on our family pit loom over 5 days. Price: ₹4,200. Let me know if you would like me to ship this to you.',
        shortAd: 'Handloom Chanderi Silk Saree — Woven on pit looms in 5 days with delicate zari work. ₹4,200.',
      },
      translations: {
        hindi: {
          title: 'पारंपरिक हथकरघा चंदेरी सिल्क साड़ी (जरी वर्क)',
          description: 'मध्य प्रदेश के चंदेरी में 5 दिनों में गड्ढा-करघे (Pit loom) पर बुनी गई हल्की, मुलायम और शुद्ध जरी बॉर्डर वाली प्रामाणिक साड़ी।',
        },
        kannada: {
          title: 'ಅಪ್ಪಟ ಕೈಮಗ್ಗದ ಚಂದೇರಿ ರೇಷ್ಮೆ ಸೀರೆ (ಜರಿ ವರ್ಕ್)',
          description: 'ಮಧ್ಯಪ್ರದೇಶದ ಚಂದೇರಿಯಲ್ಲಿ 5 ದಿನಗಳ ಕಾಲ ಕೈಮಗ್ಗದಲ್ಲಿ ನೇಯ್ದ ಹಗುರವಾದ, ಸೊಗಸಾದ ಮತ್ತು ಚಿನ್ನದ ಜರಿ ವಿನ್ಯಾಸದ ಸೀರೆ.',
        },
      },
      story: {
        title: 'The Rhythmic Clack of the Chanderi Pit Loom',
        body: 'In the narrow stone lanes of Chanderi, Kailash Kori works the foot pedals of a loom built into the cool earthen floor. With each pass of the wooden shuttle, threads of mulberry silk and fine cotton fuse into a textile so light it floats in the air.',
      },
      readiness: {
        overall: 88,
        photography: 82,
        description: 94,
        discoverability: 90,
        pricingPresentation: 88,
        marketing: 86,
        topActions: [
          'Include a photo showing the drape and translucency against natural window light.',
          'State exact length (e.g. 6.3 metres with running blouse piece).',
          'Provide dry clean and storage recommendations for zari preservation.'
        ],
      },
    },
  },
  {
    id: 'demo-terracotta-pot',
    artisan_id: 'artisan-anita-pal',
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    is_published: true,
    artisan: {
      id: 'artisan-anita-pal',
      name: 'Anita Pal',
      location: 'Bankura, West Bengal',
      craft: 'Terracotta & Clay Pottery',
      preferred_language: 'bn',
    },
    input_data: {
      productName: 'Hand-Thrown Terracotta Water Pitcher',
      material: 'Alluvial Riverbed Clay',
      productionCost: 220,
      timeRequired: '1 day + 3 days sun drying',
      location: 'Bankura, West Bengal',
      craftStory: 'Thrown on a stone potter wheel using organic alluvial clay, hand-burnished with river pebbles for natural sheen, and fired in an open wood kiln.',
      category: 'Home & Kitchenware',
      targetPrice: 750,
    },
    generated_data: {
      product: {
        title: 'Artisan Wheel-Thrown Terracotta Water Carafe',
        shortDescription: 'Porous riverbed clay pitcher hand-thrown in Bankura for natural evaporative cooling and earth-infused water.',
        description: 'Crafted using nutrient-rich alluvial clay from the riverbanks of Bankura, this earthen pitcher is wheel-thrown by artisan Anita Pal. Before kiln-firing, the surface is hand-rubbed with smooth river stones to create a natural seal without synthetic glazes. The micro-porous clay naturally cools water through gentle surface evaporation while infusing vital trace minerals.',
        category: 'Kitchenware & Tabletop',
        material: '100% Lead-Free Alluvial Clay',
        craftTechnique: 'Manual wheel throwing, pebble burnishing & wood-ash firing',
        keywords: [
          'terracotta water pot',
          'Bankura clay pitcher',
          'natural cooling water vessel',
          'earthen pottery India',
          'lead free clay cookware'
        ],
        tags: [
          'TerracottaCraft',
          'BankuraPottery',
          'ClayVessel',
          'NaturalCooling',
          'HandmadeKitchenware'
        ],
      },
      pricing: {
        currency: 'INR',
        min: 650,
        recommended: 750,
        max: 899,
        rationale: [
          'Materials & Fuel: ₹90 for sourced clay, river sand, and wood fuel.',
          'Shaping & Burnishing: ₹130 for wheel shaping, pebble polishing, and firing.',
          'Artisan Margin: Fair value for traditional thermal crafts.'
        ],
        disclaimer: 'AI-assisted price based on material sourcing, slow-firing cycle, and packaging needs.',
      },
      marketing: {
        instagram: '🏺 Pure earth, crisp natural water. Hand-thrown on the wheel by Anita Pal in Bankura, this porous terracotta pitcher cools your water the ancient way—naturally and chemical-free. Experience the grounding aroma of fresh rain.',
        whatsapp: 'Namaskar! Anita Pal from Bankura here. I have hand-thrown a new series of natural terracotta water carafes using pure riverbed clay. They naturally cool water and are completely non-toxic and unglazed. Price: ₹750 with secure straw packaging. Message me to book.',
        shortAd: 'Hand-thrown Bankura Terracotta Pitcher — Cools water naturally without electricity. ₹750.',
      },
      translations: {
        hindi: {
          title: 'बांकुड़ा हस्तनिर्मित टेराकोटा जल पात्र (सुराही)',
          description: 'पश्चिम बंगाल के बांकुड़ा में शुद्ध नदी की मिट्टी से चाक पर तैयार की गई सुराही। यह पानी को स्वाभाविक रूप से शीतल और ताज़ा रखती है।',
        },
        kannada: {
          title: 'ಬಾಂಕುರಾ ಕೈಯಿಂದ ತಯಾರಿಸಿದ ಟೆರಾಕೋಟಾ ನೀರಿನ ಪಾತ್ರೆ',
          description: 'ಪಶ್ಚಿಮ ಬಂಗಾಳದ ಬಾಂಕುರಾದಲ್ಲಿ ಜೇಡಿಮಣ್ಣಿನಿಂದ ಚಕ್ರದ ಮೇಲೆ ಕೈಯಿಂದ ತಯಾರಿಸಿದ ನೈಸರ್ಗಿಕ ನೀರಿನ ಪಾತ್ರೆ. ನೀರನ್ನು ಸ್ವಾಭಾವಿಕವಾಗಿ ತಂಪಾಗಿರಿಸುತ್ತದೆ.',
        },
      },
      story: {
        title: 'From River Silt to Calming Earthen Vessels',
        body: 'Anita Pal’s workshop sits beside red laterite soils in Bankura. She kneads the silt by foot to remove air pockets, centers the mound on a heavy flywheel, and pulls the neck upward in seconds of practiced grace.',
      },
      readiness: {
        overall: 79,
        photography: 72,
        description: 88,
        discoverability: 80,
        pricingPresentation: 82,
        marketing: 73,
        topActions: [
          'Show a lifestyle photo of the carafe on a wooden dining table or kitchen shelf.',
          'Specify exact liquid capacity in litres (e.g. 1.8 Litres).',
          'Include initial soaking and first-use seasoning instructions.'
        ],
      },
    },
  },
];
