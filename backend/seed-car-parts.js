const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const carSparePartsSeed = [
  // Engine Components
  { name: 'Spark Plugs (Set of 4)', sku: 'SPARK-PLUG-STD-001', category: 'car-spare-parts', unitPrice: 2500, quantity: 50, minStock: 5, maxStock: 100, supplier: 'Auto Parts Co', description: 'Standard spark plugs for most vehicles' },
  { name: 'Engine Oil Filter', sku: 'OIL-FILTER-STANDARD', category: 'car-spare-parts', unitPrice: 800, quantity: 30, minStock: 5, maxStock: 50, supplier: 'Filter Tech', description: 'Compatible with most car models' },
  { name: 'Air Filter', sku: 'AIR-FILTER-CABIN', category: 'car-filters', unitPrice: 1200, quantity: 25, minStock: 5, maxStock: 50, supplier: 'Auto Filters', description: 'Cabin air filter for improved air quality' },
  
  // Fluids & Oils
  { name: 'Engine Oil 5W-30 (1L)', sku: 'OIL-5W30-1L', category: 'car-fluids', unitPrice: 600, quantity: 100, minStock: 20, maxStock: 200, supplier: 'Oil Masters', description: 'Synthetic blend engine oil' },
  { name: 'Engine Oil 10W-40 (1L)', sku: 'OIL-10W40-1L', category: 'car-fluids', unitPrice: 550, quantity: 80, minStock: 15, maxStock: 150, supplier: 'Oil Masters', description: 'Premium engine oil' },
  { name: 'Coolant/Antifreeze (1L)', sku: 'COOLANT-RED-1L', category: 'car-fluids', unitPrice: 450, quantity: 40, minStock: 10, maxStock: 80, supplier: 'Coolant Pro', description: 'Red coolant for engine cooling' },
  { name: 'Brake Fluid (500ml)', sku: 'BRAKE-FLUID-500ML', category: 'car-fluids', unitPrice: 380, quantity: 35, minStock: 10, maxStock: 60, supplier: 'Brake Systems', description: 'DOT 3 brake fluid' },
  { name: 'Power Steering Fluid (1L)', sku: 'STEERING-FLUID-1L', category: 'car-fluids', unitPrice: 520, quantity: 25, minStock: 5, maxStock: 50, supplier: 'Hydraulic Ltd', description: 'Power steering system fluid' },
  { name: 'Transmission Fluid (1L)', sku: 'TRANS-FLUID-1L', category: 'car-fluids', unitPrice: 720, quantity: 20, minStock: 5, maxStock: 40, supplier: 'Gear Oil Co', description: 'Automatic transmission fluid' },
  
  // Brake System
  { name: 'Brake Pads Front Set', sku: 'BRAKE-PAD-FRONT', category: 'car-spare-parts', unitPrice: 3500, quantity: 25, minStock: 5, maxStock: 50, supplier: 'Brake Masters', description: 'Front disc brake pads' },
  { name: 'Brake Pads Rear Set', sku: 'BRAKE-PAD-REAR', category: 'car-spare-parts', unitPrice: 2800, quantity: 25, minStock: 5, maxStock: 50, supplier: 'Brake Masters', description: 'Rear disc brake pads' },
  { name: 'Brake Rotor Front', sku: 'BRAKE-ROTOR-FRONT', category: 'car-spare-parts', unitPrice: 4200, quantity: 15, minStock: 3, maxStock: 30, supplier: 'Brake Masters', description: 'Front brake disc rotor' },
  
  // Battery
  { name: 'Car Battery 12V 70Ah', sku: 'BATT-12V-70AH', category: 'car-batteries', unitPrice: 8500, quantity: 10, minStock: 3, maxStock: 20, supplier: 'Power Cells', description: 'Standard car battery 70 Ampere-hours' },
  { name: 'Car Battery 12V 100Ah', sku: 'BATT-12V-100AH', category: 'car-batteries', unitPrice: 12000, quantity: 8, minStock: 2, maxStock: 15, supplier: 'Power Cells', description: 'Heavy duty car battery 100 Ampere-hours' },
  
  // Filters
  { name: 'Fuel Filter', sku: 'FUEL-FILTER-STD', category: 'car-filters', unitPrice: 950, quantity: 30, minStock: 5, maxStock: 50, supplier: 'Filter Tech', description: 'Standard fuel filter' },
  { name: 'Cabin Air Filter Premium', sku: 'CABIN-FILTER-PREMIUM', category: 'car-filters', unitPrice: 1800, quantity: 20, minStock: 5, maxStock: 40, supplier: 'Filter Tech', description: 'Premium HEPA cabin air filter' },
  
  // Tyres
  { name: 'Car Tyre 185/65 R15', sku: 'TYRE-185-65-R15', category: 'car-tyres', unitPrice: 6500, quantity: 12, minStock: 4, maxStock: 20, supplier: 'Tyre World', description: 'All-season car tyre' },
  { name: 'Car Tyre 195/55 R16', sku: 'TYRE-195-55-R16', category: 'car-tyres', unitPrice: 7200, quantity: 10, minStock: 3, maxStock: 15, supplier: 'Tyre World', description: 'Performance car tyre' },
  { name: 'Car Tyre 205/55 R17', sku: 'TYRE-205-55-R17', category: 'car-tyres', unitPrice: 8500, quantity: 8, minStock: 2, maxStock: 12, supplier: 'Tyre World', description: 'Premium car tyre' },
  
  // Belts & Hoses
  { name: 'Serpentine Belt', sku: 'BELT-SERPENTINE-STD', category: 'car-spare-parts', unitPrice: 1800, quantity: 30, minStock: 5, maxStock: 50, supplier: 'Belt Systems', description: 'Serpentine drive belt' },
  { name: 'Radiator Hose', sku: 'HOSE-RADIATOR-STD', category: 'car-spare-parts', unitPrice: 1200, quantity: 25, minStock: 5, maxStock: 40, supplier: 'Hose Pro', description: 'Standard radiator hose' },
  { name: 'Coolant Hose Set', sku: 'HOSE-COOLANT-SET', category: 'car-spare-parts', unitPrice: 2200, quantity: 20, minStock: 5, maxStock: 30, supplier: 'Hose Pro', description: 'Complete coolant hose set' },
  
  // Wiper & Washer
  { name: 'Wiper Blade Front Set', sku: 'WIPER-FRONT-SET', category: 'car-accessories', unitPrice: 1500, quantity: 40, minStock: 10, maxStock: 80, supplier: 'Clear Vision', description: 'Front windshield wiper blades' },
  { name: 'Wiper Blade Rear', sku: 'WIPER-REAR-SINGLE', category: 'car-accessories', unitPrice: 900, quantity: 30, minStock: 5, maxStock: 50, supplier: 'Clear Vision', description: 'Rear windshield wiper blade' },
  { name: 'Windshield Washer Fluid (2L)', sku: 'WASHER-FLUID-2L', category: 'car-fluids', unitPrice: 300, quantity: 50, minStock: 10, maxStock: 100, supplier: 'Clean Pro', description: 'Windshield washer solution' },
  
  // Lights & Electrical
  { name: 'Headlight Bulb H7', sku: 'BULB-H7-HEADLIGHT', category: 'car-accessories', unitPrice: 850, quantity: 30, minStock: 10, maxStock: 60, supplier: 'Light Tech', description: 'H7 halogen headlight bulb' },
  { name: 'Tail Light Bulb', sku: 'BULB-TAIL-LIGHT', category: 'car-accessories', unitPrice: 450, quantity: 40, minStock: 10, maxStock: 80, supplier: 'Light Tech', description: 'Standard tail light bulb' },
  { name: 'LED Cabin Light', sku: 'LED-CABIN-LIGHT', category: 'car-accessories', unitPrice: 600, quantity: 50, minStock: 10, maxStock: 100, supplier: 'LED Systems', description: 'LED interior cabin light' },
  { name: 'Car Fuse Assortment Kit', sku: 'FUSE-KIT-ASSORT', category: 'car-accessories', unitPrice: 1200, quantity: 25, minStock: 5, maxStock: 50, supplier: 'Electrical Pro', description: 'Complete fuse assortment kit' },
  
  // Suspension & Steering
  { name: 'Shock Absorber Front Left', sku: 'SHOCK-FRONT-LEFT', category: 'car-spare-parts', unitPrice: 5500, quantity: 8, minStock: 2, maxStock: 15, supplier: 'Suspension Co', description: 'Front left shock absorber' },
  { name: 'Shock Absorber Front Right', sku: 'SHOCK-FRONT-RIGHT', category: 'car-spare-parts', unitPrice: 5500, quantity: 8, minStock: 2, maxStock: 15, supplier: 'Suspension Co', description: 'Front right shock absorber' },
  { name: 'Tie Rod End', sku: 'TIE-ROD-END-STD', category: 'car-spare-parts', unitPrice: 2200, quantity: 20, minStock: 5, maxStock: 40, supplier: 'Steering Systems', description: 'Standard tie rod end assembly' },
  
  // Gaskets & Seals
  { name: 'Head Gasket Set', sku: 'GASKET-HEAD-SET', category: 'car-spare-parts', unitPrice: 8000, quantity: 5, minStock: 2, maxStock: 10, supplier: 'Gasket Pro', description: 'Complete head gasket set' },
  { name: 'Oil Pan Gasket', sku: 'GASKET-OIL-PAN', category: 'car-spare-parts', unitPrice: 1500, quantity: 15, minStock: 3, maxStock: 30, supplier: 'Gasket Pro', description: 'Oil pan gasket seal' },
  
  // Air & Heating
  { name: 'Car AC Refrigerant (500g)', sku: 'AC-REFRIG-500G', category: 'car-fluids', unitPrice: 3500, quantity: 20, minStock: 5, maxStock: 40, supplier: 'Cool Systems', description: 'AC refrigerant R134a' },
  { name: 'Heater Core', sku: 'HEATER-CORE-STD', category: 'car-spare-parts', unitPrice: 4200, quantity: 10, minStock: 2, maxStock: 20, supplier: 'Thermal Pro', description: 'Standard heater core' },
  
  // Accessories
  { name: 'Floor Mats Set (4pc)', sku: 'MAT-FLOOR-4PC', category: 'car-accessories', unitPrice: 2200, quantity: 35, minStock: 5, maxStock: 60, supplier: 'Auto Decor', description: 'Complete set of 4 floor mats' },
  { name: 'Seat Cover Full Set', sku: 'SEAT-COVER-FULL', category: 'car-accessories', unitPrice: 5500, quantity: 15, minStock: 3, maxStock: 30, supplier: 'Auto Decor', description: 'Full car seat cover set' },
  { name: 'Car Air Freshener', sku: 'AIR-FRESH-SCENT', category: 'car-accessories', unitPrice: 450, quantity: 100, minStock: 20, maxStock: 200, supplier: 'Fresh Air', description: 'Hanging car air freshener' },
  { name: 'Steering Wheel Cover', sku: 'WHEEL-COVER-STD', category: 'car-accessories', unitPrice: 1500, quantity: 40, minStock: 10, maxStock: 80, supplier: 'Auto Decor', description: 'Universal steering wheel cover' },
  { name: 'Car Door Lock Actuator', sku: 'LOCK-ACTUATOR-STD', category: 'car-spare-parts', unitPrice: 3800, quantity: 12, minStock: 3, maxStock: 25, supplier: 'Lock Systems', description: 'Electronic door lock actuator' },
];

async function seedCarParts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing car parts
    await Product.deleteMany({ category: { $regex: 'car' } });
    console.log('Cleared existing car parts');
    
    // Insert new car parts
    const inserted = await Product.insertMany(carSparePartsSeed);
    console.log(`✅ Successfully seeded ${inserted.length} car spare parts products!`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedCarParts();
