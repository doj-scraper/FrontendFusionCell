import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to create warehouse location
function createLocation(index: number): string {
  const aisle = String.fromCharCode(65 + (index % 26));
  const shelf = String((index % 10) + 1).padStart(2, '0');
  const bin = String((index * 7) % 50 + 1).padStart(2, '0');
  return `${aisle}-${shelf}-${bin}`;
}

async function main() {
  console.log('🌱 Seeding FusionCell database...');

  // ============================================
  // CREATE PART CATEGORIES
  // ============================================
  const categories = await Promise.all([
    prisma.partCategory.upsert({
      where: { slug: 'screens' },
      update: {},
      create: {
        name: 'Screens & LCD',
        slug: 'screens',
        description: 'Display assemblies, LCD screens, and digitizers',
        icon: 'Monitor',
        sortOrder: 1,
      },
    }),
    prisma.partCategory.upsert({
      where: { slug: 'batteries' },
      update: {},
      create: {
        name: 'Batteries',
        slug: 'batteries',
        description: 'Replacement batteries and battery accessories',
        icon: 'Battery',
        sortOrder: 2,
      },
    }),
    prisma.partCategory.upsert({
      where: { slug: 'charging-ports' },
      update: {},
      create: {
        name: 'Charging Ports',
        slug: 'charging-ports',
        description: 'Lightning, USB-C, and charging port assemblies',
        icon: 'Plug',
        sortOrder: 3,
      },
    }),
    prisma.partCategory.upsert({
      where: { slug: 'rear-glass' },
      update: {},
      create: {
        name: 'Rear Glass',
        slug: 'rear-glass',
        description: 'Back glass panels and housings',
        icon: 'Square',
        sortOrder: 4,
      },
    }),
    prisma.partCategory.upsert({
      where: { slug: 'cameras' },
      update: {},
      create: {
        name: 'Cameras',
        slug: 'cameras',
        description: 'Front and rear camera modules',
        icon: 'Camera',
        sortOrder: 5,
      },
    }),
    prisma.partCategory.upsert({
      where: { slug: 'buttons-flex' },
      update: {},
      create: {
        name: 'Buttons & Flex',
        slug: 'buttons-flex',
        description: 'Power buttons, volume buttons, and flex cables',
        icon: 'ToggleLeft',
        sortOrder: 6,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // CREATE BRANDS
  // ============================================
  const apple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
      description: 'iPhone replacement parts and accessories',
      isActive: true,
      sortOrder: 1,
    },
  });

  const samsung = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      name: 'Samsung',
      slug: 'samsung',
      description: 'Samsung Galaxy replacement parts',
      isActive: true,
      sortOrder: 2,
    },
  });

  const motorola = await prisma.brand.upsert({
    where: { slug: 'motorola' },
    update: {},
    create: {
      name: 'Motorola',
      slug: 'motorola',
      description: 'Motorola phone replacement parts',
      isActive: true,
      sortOrder: 3,
    },
  });

  const google = await prisma.brand.upsert({
    where: { slug: 'google' },
    update: {},
    create: {
      name: 'Google',
      slug: 'google',
      description: 'Google Pixel replacement parts',
      isActive: true,
      sortOrder: 4,
    },
  });

  console.log('✅ Created brands');

  // ============================================
  // CREATE DEVICES
  // ============================================

  // iPhone Devices
  const iphoneDevices = [
    { name: 'iPhone 11', slug: 'iphone-11', modelNumber: 'A2111', releaseYear: 2019 },
    { name: 'iPhone 11 Pro', slug: 'iphone-11-pro', modelNumber: 'A2160', releaseYear: 2019 },
    { name: 'iPhone 11 Pro Max', slug: 'iphone-11-pro-max', modelNumber: 'A2218', releaseYear: 2019 },
    { name: 'iPhone 12 mini', slug: 'iphone-12-mini', modelNumber: 'A2176', releaseYear: 2020 },
    { name: 'iPhone 12', slug: 'iphone-12', modelNumber: 'A2172', releaseYear: 2020 },
    { name: 'iPhone 12 Pro', slug: 'iphone-12-pro', modelNumber: 'A2341', releaseYear: 2020 },
    { name: 'iPhone 12 Pro Max', slug: 'iphone-12-pro-max', modelNumber: 'A2411', releaseYear: 2020 },
    { name: 'iPhone 13 mini', slug: 'iphone-13-mini', modelNumber: 'A2481', releaseYear: 2021 },
    { name: 'iPhone 13', slug: 'iphone-13', modelNumber: 'A2482', releaseYear: 2021 },
    { name: 'iPhone 13 Pro', slug: 'iphone-13-pro', modelNumber: 'A2483', releaseYear: 2021 },
    { name: 'iPhone 13 Pro Max', slug: 'iphone-13-pro-max', modelNumber: 'A2484', releaseYear: 2021 },
    { name: 'iPhone SE (3rd Gen)', slug: 'iphone-se-3rd-gen', modelNumber: 'A2595', releaseYear: 2022 },
    { name: 'iPhone 14', slug: 'iphone-14', modelNumber: 'A2649', releaseYear: 2022 },
    { name: 'iPhone 14 Plus', slug: 'iphone-14-plus', modelNumber: 'A2632', releaseYear: 2022 },
    { name: 'iPhone 14 Pro', slug: 'iphone-14-pro', modelNumber: 'A2650', releaseYear: 2022 },
    { name: 'iPhone 14 Pro Max', slug: 'iphone-14-pro-max', modelNumber: 'A2651', releaseYear: 2022 },
    { name: 'iPhone 15', slug: 'iphone-15', modelNumber: 'A2846', releaseYear: 2023 },
    { name: 'iPhone 15 Plus', slug: 'iphone-15-plus', modelNumber: 'A2847', releaseYear: 2023 },
    { name: 'iPhone 15 Pro', slug: 'iphone-15-pro', modelNumber: 'A2848', releaseYear: 2023 },
    { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', modelNumber: 'A2849', releaseYear: 2023 },
    { name: 'iPhone 16', slug: 'iphone-16', modelNumber: 'A3081', releaseYear: 2024 },
    { name: 'iPhone 16 Plus', slug: 'iphone-16-plus', modelNumber: 'A3082', releaseYear: 2024 },
    { name: 'iPhone 16 Pro', slug: 'iphone-16-pro', modelNumber: 'A3083', releaseYear: 2024 },
    { name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', modelNumber: 'A3084', releaseYear: 2024 },
    { name: 'iPhone 17', slug: 'iphone-17', modelNumber: 'A4001', releaseYear: 2025 },
    { name: 'iPhone 17 Pro', slug: 'iphone-17-pro', modelNumber: 'A4002', releaseYear: 2025 },
    { name: 'iPhone 17 Pro Max', slug: 'iphone-17-pro-max', modelNumber: 'A4003', releaseYear: 2025 },
  ];

  const createdIphones: { id: string; name: string; slug: string }[] = [];
  for (let i = 0; i < iphoneDevices.length; i++) {
    const device = iphoneDevices[i];
    const created = await prisma.device.upsert({
      where: { slug: device.slug },
      update: {},
      create: { ...device, brandId: apple.id, isActive: true, sortOrder: i },
    });
    createdIphones.push(created);
  }
  console.log(`✅ Created ${createdIphones.length} iPhone devices`);

  // Samsung Devices
  const samsungDevices = [
    { name: 'Galaxy S20', slug: 'galaxy-s20', releaseYear: 2020 },
    { name: 'Galaxy S20+', slug: 'galaxy-s20-plus', releaseYear: 2020 },
    { name: 'Galaxy S20 Ultra', slug: 'galaxy-s20-ultra', releaseYear: 2020 },
    { name: 'Galaxy S21', slug: 'galaxy-s21', releaseYear: 2021 },
    { name: 'Galaxy S21+', slug: 'galaxy-s21-plus', releaseYear: 2021 },
    { name: 'Galaxy S21 Ultra', slug: 'galaxy-s21-ultra', releaseYear: 2021 },
    { name: 'Galaxy S22', slug: 'galaxy-s22', releaseYear: 2022 },
    { name: 'Galaxy S22+', slug: 'galaxy-s22-plus', releaseYear: 2022 },
    { name: 'Galaxy S22 Ultra', slug: 'galaxy-s22-ultra', releaseYear: 2022 },
    { name: 'Galaxy S23', slug: 'galaxy-s23', releaseYear: 2023 },
    { name: 'Galaxy S23+', slug: 'galaxy-s23-plus', releaseYear: 2023 },
    { name: 'Galaxy S23 Ultra', slug: 'galaxy-s23-ultra', releaseYear: 2023 },
    { name: 'Galaxy S24', slug: 'galaxy-s24', releaseYear: 2024 },
    { name: 'Galaxy S24+', slug: 'galaxy-s24-plus', releaseYear: 2024 },
    { name: 'Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', releaseYear: 2024 },
    { name: 'Galaxy A14', slug: 'galaxy-a14', releaseYear: 2023 },
    { name: 'Galaxy A15', slug: 'galaxy-a15', releaseYear: 2024 },
    { name: 'Galaxy A34 5G', slug: 'galaxy-a34-5g', releaseYear: 2023 },
    { name: 'Galaxy A54 5G', slug: 'galaxy-a54-5g', releaseYear: 2023 },
    { name: 'Galaxy A55 5G', slug: 'galaxy-a55-5g', releaseYear: 2024 },
    { name: 'Galaxy Z Fold 4', slug: 'galaxy-z-fold-4', releaseYear: 2022 },
    { name: 'Galaxy Z Fold 5', slug: 'galaxy-z-fold-5', releaseYear: 2023 },
    { name: 'Galaxy Z Fold 6', slug: 'galaxy-z-fold-6', releaseYear: 2024 },
    { name: 'Galaxy Z Flip 4', slug: 'galaxy-z-flip-4', releaseYear: 2022 },
    { name: 'Galaxy Z Flip 5', slug: 'galaxy-z-flip-5', releaseYear: 2023 },
    { name: 'Galaxy Z Flip 6', slug: 'galaxy-z-flip-6', releaseYear: 2024 },
    { name: 'Galaxy Note 20', slug: 'galaxy-note-20', releaseYear: 2020 },
    { name: 'Galaxy Note 20 Ultra', slug: 'galaxy-note-20-ultra', releaseYear: 2020 },
  ];

  const createdSamsung: { id: string; name: string; slug: string }[] = [];
  for (let i = 0; i < samsungDevices.length; i++) {
    const device = samsungDevices[i];
    const created = await prisma.device.upsert({
      where: { slug: device.slug },
      update: {},
      create: { ...device, brandId: samsung.id, isActive: true, sortOrder: i },
    });
    createdSamsung.push(created);
  }
  console.log(`✅ Created ${createdSamsung.length} Samsung devices`);

  // Motorola Devices
  const motorolaDevices = [
    { name: 'Moto G Power (2023)', slug: 'moto-g-power-2023', releaseYear: 2023 },
    { name: 'Moto G Stylus (2023)', slug: 'moto-g-stylus-2023', releaseYear: 2023 },
    { name: 'Moto G Play (2024)', slug: 'moto-g-play-2024', releaseYear: 2024 },
    { name: 'Moto G 5G (2024)', slug: 'moto-g-5g-2024', releaseYear: 2024 },
    { name: 'Moto G84 5G', slug: 'moto-g84-5g', releaseYear: 2023 },
    { name: 'Motorola Edge (2023)', slug: 'motorola-edge-2023', releaseYear: 2023 },
    { name: 'Motorola Edge+ (2023)', slug: 'motorola-edge-plus-2023', releaseYear: 2023 },
    { name: 'Motorola Razr (2023)', slug: 'motorola-razr-2023', releaseYear: 2023 },
    { name: 'Motorola Razr+', slug: 'motorola-razr-plus', releaseYear: 2023 },
  ];

  const createdMotorola: { id: string; name: string; slug: string }[] = [];
  for (let i = 0; i < motorolaDevices.length; i++) {
    const device = motorolaDevices[i];
    const created = await prisma.device.upsert({
      where: { slug: device.slug },
      update: {},
      create: { ...device, brandId: motorola.id, isActive: true, sortOrder: i },
    });
    createdMotorola.push(created);
  }
  console.log(`✅ Created ${createdMotorola.length} Motorola devices`);

  // Google Pixel Devices
  const pixelDevices = [
    { name: 'Pixel 6', slug: 'pixel-6', releaseYear: 2021 },
    { name: 'Pixel 6 Pro', slug: 'pixel-6-pro', releaseYear: 2021 },
    { name: 'Pixel 6a', slug: 'pixel-6a', releaseYear: 2022 },
    { name: 'Pixel 7', slug: 'pixel-7', releaseYear: 2022 },
    { name: 'Pixel 7 Pro', slug: 'pixel-7-pro', releaseYear: 2022 },
    { name: 'Pixel 7a', slug: 'pixel-7a', releaseYear: 2023 },
    { name: 'Pixel 8', slug: 'pixel-8', releaseYear: 2023 },
    { name: 'Pixel 8 Pro', slug: 'pixel-8-pro', releaseYear: 2023 },
    { name: 'Pixel 8a', slug: 'pixel-8a', releaseYear: 2024 },
    { name: 'Pixel 9', slug: 'pixel-9', releaseYear: 2024 },
    { name: 'Pixel 9 Pro', slug: 'pixel-9-pro', releaseYear: 2024 },
    { name: 'Pixel Fold', slug: 'pixel-fold', releaseYear: 2023 },
  ];

  const createdPixel: { id: string; name: string; slug: string }[] = [];
  for (let i = 0; i < pixelDevices.length; i++) {
    const device = pixelDevices[i];
    const created = await prisma.device.upsert({
      where: { slug: device.slug },
      update: {},
      create: { ...device, brandId: google.id, isActive: true, sortOrder: i },
    });
    createdPixel.push(created);
  }
  console.log(`✅ Created ${createdPixel.length} Google Pixel devices`);

  // ============================================
  // CREATE PARTS
  // ============================================
  const screenCategory = categories.find(c => c.slug === 'screens')!;
  const batteryCategory = categories.find(c => c.slug === 'batteries')!;
  const chargingCategory = categories.find(c => c.slug === 'charging-ports')!;
  const rearGlassCategory = categories.find(c => c.slug === 'rear-glass')!;
  const cameraCategory = categories.find(c => c.slug === 'cameras')!;

  let partIndex = 0;

  // Create parts for iPhones
  for (const device of createdIphones) {
    const name = device.name.toLowerCase();
    const isPro = name.includes('pro');
    const isMax = name.includes('max');
    const isMini = name.includes('mini');
    const isSE = name.includes('se');
    const isPlus = name.includes('plus');
    const tierMultiplier = isSE ? 0.8 : (isPro || isMax ? 1.3 : (isPlus ? 1.1 : (isMini ? 0.85 : 1)));

    const baseSku = device.slug.replace(/-/g, '').toUpperCase();
    const isFeatured = name.includes('14') || name.includes('15') || name.includes('16');

    const screenBase = isPro ? 89.99 : isSE ? 49.99 : isMini ? 59.99 : 69.99;
    await createPart({
      deviceId: device.id,
      categoryId: screenCategory.id,
      sku: `${baseSku}-SCR-OEM`,
      name: `${device.name} OLED Screen - OEM`,
      slug: `${device.slug}-screen-oem`,
      price: screenBase * tierMultiplier,
      comparePrice: screenBase * 1.4 * tierMultiplier,
      quality: 'OEM',
      isFeatured,
      index: partIndex++,
    });

    await createPart({
      deviceId: device.id,
      categoryId: screenCategory.id,
      sku: `${baseSku}-SCR-AM`,
      name: `${device.name} LCD Screen - Aftermarket`,
      slug: `${device.slug}-screen-aftermarket`,
      price: screenBase * 0.6 * tierMultiplier,
      comparePrice: screenBase * 0.85 * tierMultiplier,
      quality: 'AFTERMARKET',
      isFeatured,
      index: partIndex++,
    });

    const batteryPrice = isPro || isMax ? 29.99 : isSE ? 19.99 : isMini ? 21.99 : 24.99;
    await createPart({
      deviceId: device.id,
      categoryId: batteryCategory.id,
      sku: `${baseSku}-BAT`,
      name: `${device.name} Battery - OEM`,
      slug: `${device.slug}-battery`,
      price: batteryPrice * tierMultiplier,
      comparePrice: batteryPrice * 1.4 * tierMultiplier,
      quality: 'OEM',
      isFeatured,
      index: partIndex++,
    });

    const chargingPrice = isPro || isMax ? 16.99 : 14.99;
    await createPart({
      deviceId: device.id,
      categoryId: chargingCategory.id,
      sku: `${baseSku}-CHG`,
      name: `${device.name} Charging Port`,
      slug: `${device.slug}-charging-port`,
      price: chargingPrice,
      comparePrice: chargingPrice * 1.5,
      quality: 'AFTERMARKET',
      isFeatured: false,
      index: partIndex++,
    });

    if (!isSE) {
      const rearGlassPrice = isPro || isMax ? 14.99 : 12.99;
      await createPart({
        deviceId: device.id,
        categoryId: rearGlassCategory.id,
        sku: `${baseSku}-RG`,
        name: `${device.name} Rear Glass`,
        slug: `${device.slug}-rear-glass`,
        price: rearGlassPrice,
        comparePrice: rearGlassPrice * 1.6,
        quality: 'AFTERMARKET',
        isFeatured: false,
        index: partIndex++,
      });
    }

    if (isPro) {
      const yearMatch = device.name.match(/\d+/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 14;
      const cameraPrice =
        year >= 17 ? 179.99 : year >= 16 ? 169.99 : year >= 15 ? 159.99 : 149.99;

      await createPart({
        deviceId: device.id,
        categoryId: cameraCategory.id,
        sku: `${baseSku}-CAM`,
        name: `${device.name} Camera Module - OEM`,
        slug: `${device.slug}-camera`,
        price: cameraPrice,
        comparePrice: cameraPrice * 1.3,
        quality: 'OEM',
        isFeatured: false,
        index: partIndex++,
      });
    }
  }
  console.log('✅ Created iPhone parts');

  // Create parts for Samsung devices
  for (const device of createdSamsung) {
    const name = device.name.toLowerCase();
    const isUltra = name.includes('ultra');
    const isPlus = name.includes('+') && !isUltra;
    const isFold = name.includes('fold');
    const isFlip = name.includes('flip');
    const isA =
      name.includes('a ') || name.includes('a1') || name.includes('a3') || name.includes('a5');
    const tierMultiplier = isUltra
      ? 1.4
      : isFold
        ? 1.5
        : isFlip
          ? 1.2
          : isPlus
            ? 1.1
            : isA
              ? 0.7
              : 1;
    const baseSku = device.slug.replace(/-/g, '').toUpperCase();

    const screenBase = isFold ? 149.99 : isFlip ? 99.99 : isUltra ? 109.99 : isA ? 49.99 : 79.99;
    await createPart({
      deviceId: device.id,
      categoryId: screenCategory.id,
      sku: `${baseSku}-SCR`,
      name: `${device.name} Screen - OEM`,
      slug: `${device.slug}-screen`,
      price: screenBase * tierMultiplier,
      comparePrice: screenBase * 1.35 * tierMultiplier,
      quality: 'OEM',
      isFeatured: name.includes('24') || name.includes('23'),
      index: partIndex++,
    });

    const batteryPrice = isFold ? 34.99 : isUltra ? 29.99 : isA ? 18.99 : 24.99;
    await createPart({
      deviceId: device.id,
      categoryId: batteryCategory.id,
      sku: `${baseSku}-BAT`,
      name: `${device.name} Battery - OEM`,
      slug: `${device.slug}-battery`,
      price: batteryPrice * tierMultiplier,
      comparePrice: batteryPrice * 1.4 * tierMultiplier,
      quality: 'OEM',
      isFeatured: false,
      index: partIndex++,
    });

    await createPart({
      deviceId: device.id,
      categoryId: chargingCategory.id,
      sku: `${baseSku}-CHG`,
      name: `${device.name} Charging Port`,
      slug: `${device.slug}-charging-port`,
      price: 12.99,
      comparePrice: 19.99,
      quality: 'AFTERMARKET',
      isFeatured: false,
      index: partIndex++,
    });
  }
  console.log('✅ Created Samsung parts');

  // Create parts for Motorola devices
  for (const device of createdMotorola) {
    const name = device.name.toLowerCase();
    const isRazr = name.includes('razr');
    const isEdge = name.includes('edge');
    const tierMultiplier = isRazr ? 1.3 : isEdge ? 1.1 : 0.8;
    const baseSku = device.slug.replace(/-/g, '').toUpperCase();

    const screenBase = isRazr ? 119.99 : isEdge ? 79.99 : 39.99;
    await createPart({
      deviceId: device.id,
      categoryId: screenCategory.id,
      sku: `${baseSku}-SCR`,
      name: `${device.name} Screen`,
      slug: `${device.slug}-screen`,
      price: screenBase * tierMultiplier,
      comparePrice: screenBase * 1.4 * tierMultiplier,
      quality: isRazr || isEdge ? 'OEM' : 'AFTERMARKET',
      isFeatured: isRazr,
      index: partIndex++,
    });

    const batteryPrice = isRazr ? 29.99 : isEdge ? 24.99 : 14.99;
    await createPart({
      deviceId: device.id,
      categoryId: batteryCategory.id,
      sku: `${baseSku}-BAT`,
      name: `${device.name} Battery - OEM`,
      slug: `${device.slug}-battery`,
      price: batteryPrice * tierMultiplier,
      comparePrice: batteryPrice * 1.5 * tierMultiplier,
      quality: 'OEM',
      isFeatured: false,
      index: partIndex++,
    });
  }
  console.log('✅ Created Motorola parts');

  // Create parts for Google Pixel devices
  for (const device of createdPixel) {
    const name = device.name.toLowerCase();
    const isPro = name.includes('pro');
    const isFold = name.includes('fold');
    const isA = name.includes('a');
    const tierMultiplier = isFold ? 1.5 : isPro ? 1.3 : isA ? 0.8 : 1;
    const baseSku = device.slug.replace(/-/g, '').toUpperCase();

    const screenBase = isFold ? 179.99 : isPro ? 99.99 : isA ? 59.99 : 79.99;
    await createPart({
      deviceId: device.id,
      categoryId: screenCategory.id,
      sku: `${baseSku}-SCR`,
      name: `${device.name} Screen - OEM`,
      slug: `${device.slug}-screen`,
      price: screenBase * tierMultiplier,
      comparePrice: screenBase * 1.35 * tierMultiplier,
      quality: 'OEM',
      isFeatured: name.includes('9') || name.includes('8'),
      index: partIndex++,
    });

    const batteryPrice = isPro ? 29.99 : isA ? 19.99 : 24.99;
    await createPart({
      deviceId: device.id,
      categoryId: batteryCategory.id,
      sku: `${baseSku}-BAT`,
      name: `${device.name} Battery - OEM`,
      slug: `${device.slug}-battery`,
      price: batteryPrice * tierMultiplier,
      comparePrice: batteryPrice * 1.4 * tierMultiplier,
      quality: 'OEM',
      isFeatured: false,
      index: partIndex++,
    });

    await createPart({
      deviceId: device.id,
      categoryId: chargingCategory.id,
      sku: `${baseSku}-CHG`,
      name: `${device.name} Charging Port`,
      slug: `${device.slug}-charging-port`,
      price: 14.99,
      comparePrice: 22.99,
      quality: 'AFTERMARKET',
      isFeatured: false,
      index: partIndex++,
    });
  }
  console.log('✅ Created Google Pixel parts');

  // ============================================
  // CREATE SITE SETTINGS
  // ============================================
  const settings = [
    { key: 'site_name', value: 'FusionCell', description: 'Site name' },
    { key: 'contact_email', value: 'sales@fusioncell.com', description: 'Contact email' },
    { key: 'contact_phone', value: '1-800-FUSION-1', description: 'Contact phone' },
    { key: 'address', value: '1400 Market Street, Tomball, TX 77375', description: 'Business address' },
    { key: 'min_order_qty', value: '5', description: 'Minimum order quantity' },
    { key: 'free_shipping_threshold', value: '150', description: 'Free shipping order threshold' },
    { key: 'same_day_cutoff', value: '14:00', description: 'Same-day shipping cutoff time (CST)' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Created site settings');

  console.log(`\n🎉 Database seeding completed! Total parts: ${partIndex}`);
}

async function createPart({
  deviceId,
  categoryId,
  sku,
  name,
  slug,
  price,
  comparePrice,
  quality,
  isFeatured,
  index,
}: {
  deviceId: string;
  categoryId: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number;
  quality: quality: 'OEM' | 'PREMIUM' | 'AFTERMARKET' | 'REFURBISHED' | 'USED';
  isFeatured: boolean;
  index: number;
}) {
  const part = await prisma.part.upsert({
    where: { sku },
    update: { price, comparePrice },
    create: {
      deviceId,
      categoryId,
      sku,
      name,
      slug,
      price,
      comparePrice,
      quality,
      minOrderQty: 5,
      isFeatured,
      isActive: true,
    },
  });

  const quantity = Math.floor(Math.random() * 150) + 20;
  await prisma.inventory.upsert({
    where: { partId: part.id },
    update: {},
    create: {
      partId: part.id,
      quantity,
      reserved: Math.floor(Math.random() * Math.min(quantity * 0.1, 15)),
      reorderPoint: 15,
      location: createLocation(index),
    },
  });

  return part;
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
