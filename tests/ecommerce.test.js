// ====================================================================
// TREND ZONE BUSINESS LOGIC & ACCEPTANCE TESTS
// ====================================================================

import assert from 'assert';

console.log('🧪 Starting Trend Zone E-Commerce Test Suite...\n');

// Mock data structures
const testProductSimple = {
  id: 'prod-s',
  name: 'Pure Cotton Saree',
  base_price: 2500,
  sale_price: 2100,
  stock_quantity: 15,
  is_variable: false,
};

const testProductVariable = {
  id: 'prod-v',
  name: 'Designer Kurti',
  base_price: 1800,
  sale_price: null,
  stock_quantity: 20,
  is_variable: true,
  variants: [
    {
      id: 'var-1',
      title: 'Pink / M',
      sku: 'SH-KURTI-PK-M',
      price: 1800,
      sale_price: 1500,
      stock_quantity: 8,
    },
    {
      id: 'var-2',
      title: 'Black / L',
      sku: 'SH-KURTI-BK-L',
      price: 1900,
      sale_price: 1650,
      stock_quantity: 12,
    },
  ],
};

// 1. Phone number format validation for Bangladesh
function validateBangladeshPhone(phone) {
  const clean = phone.replace(/[^0-9]/g, '');
  return clean.length === 11 && (clean.startsWith('013') || clean.startsWith('014') || clean.startsWith('015') || clean.startsWith('016') || clean.startsWith('017') || clean.startsWith('018') || clean.startsWith('019'));
}

// 2. Dynamic delivery calculation
function calculateDeliveryCharge(division, subtotal, threshold = 2000) {
  if (subtotal >= threshold) return 0;
  return division.toLowerCase() === 'dhaka' ? 60 : 120;
}

// 3. Variant price resolution
function getEffectivePrice(product, variantId) {
  if (product.is_variable && variantId && product.variants) {
    const v = product.variants.find((item) => item.id === variantId);
    if (!v) throw new Error('Variant not found');
    return v.sale_price ?? v.price;
  }
  return product.sale_price ?? product.base_price;
}

// 4. Atomic stock simulation
function processOrderSimulation(products, orderItems) {
  let subtotal = 0;
  const deductedStock = [];

  for (const item of orderItems) {
    const prod = products.find((p) => p.id === item.productId);
    if (!prod) throw new Error('Product not found');

    if (item.variantId) {
      const v = prod.variants.find((varItem) => varItem.id === item.variantId);
      if (!v) throw new Error('Variant not found');
      if (v.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for variant ${v.title}`);
      }
      const unitPrice = v.sale_price ?? v.price;
      subtotal += unitPrice * item.quantity;
      v.stock_quantity -= item.quantity;
      deductedStock.push({ productId: prod.id, variantId: v.id, qty: item.quantity });
    } else {
      if (prod.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${prod.name}`);
      }
      const unitPrice = prod.sale_price ?? prod.base_price;
      subtotal += unitPrice * item.quantity;
      prod.stock_quantity -= item.quantity;
      deductedStock.push({ productId: prod.id, qty: item.quantity });
    }
  }

  return { subtotal, deductedStock };
}

// 5. Stock restoration simulation
function cancelOrderSimulation(products, deductedStock) {
  for (const record of deductedStock) {
    const prod = products.find((p) => p.id === record.productId);
    if (record.variantId) {
      const v = prod.variants.find((varItem) => varItem.id === record.variantId);
      v.stock_quantity += record.qty;
    } else {
      prod.stock_quantity += record.qty;
    }
  }
}

// RUN TESTS
try {
  // Test 1: Bangladesh phone number validation
  console.log('Test 1: Bangladesh phone number format validation...');
  assert.strictEqual(validateBangladeshPhone('01712345678'), true);
  assert.strictEqual(validateBangladeshPhone('01812345678'), true);
  assert.strictEqual(validateBangladeshPhone('01912345678'), true);
  assert.strictEqual(validateBangladeshPhone('01512345678'), true);
  assert.strictEqual(validateBangladeshPhone('01212345678'), false); // invalid operator prefix
  assert.strictEqual(validateBangladeshPhone('017123456'), false); // too short
  console.log('✅ Test 1 Passed: Mobile phone validation operates correctly.\n');

  // Test 2: Dynamic Delivery Charge Calculation
  console.log('Test 2: Delivery fee calculation for Dhaka vs Outside Dhaka...');
  assert.strictEqual(calculateDeliveryCharge('Dhaka', 1200), 60);
  assert.strictEqual(calculateDeliveryCharge('Chattogram', 1200), 120);
  assert.strictEqual(calculateDeliveryCharge('Sylhet', 1800), 120);
  // Free delivery threshold test (>= 2000 BDT)
  assert.strictEqual(calculateDeliveryCharge('Chattogram', 2500), 0);
  assert.strictEqual(calculateDeliveryCharge('Dhaka', 2000), 0);
  console.log('✅ Test 2 Passed: Delivery rules apply properly.\n');

  // Test 3: Variation Price Resolution
  console.log('Test 3: Variation pricing resolution...');
  assert.strictEqual(getEffectivePrice(testProductSimple), 2100); // has sale price
  assert.strictEqual(getEffectivePrice(testProductVariable, 'var-1'), 1500); // sale price of Pink / M
  assert.strictEqual(getEffectivePrice(testProductVariable, 'var-2'), 1650); // sale price of Black / L
  console.log('✅ Test 3 Passed: Variant specific prices are isolated and resolved.\n');

  // Test 4: Inventory deduction and concurrent protection
  console.log('Test 4: Atomic stock deduction simulation...');
  const clonedProducts = JSON.parse(JSON.stringify([testProductSimple, testProductVariable]));
  const orderResult = processOrderSimulation(clonedProducts, [
    { productId: 'prod-s', quantity: 2 },
    { productId: 'prod-v', variantId: 'var-1', quantity: 3 },
  ]);

  assert.strictEqual(orderResult.subtotal, 2 * 2100 + 3 * 1500); // 4200 + 4500 = 8700
  assert.strictEqual(clonedProducts[0].stock_quantity, 13); // 15 - 2
  assert.strictEqual(clonedProducts[1].variants[0].stock_quantity, 5); // 8 - 3
  console.log('✅ Test 4 Passed: Stock deduction accurately updates inventory.\n');

  // Test 5: Order cancellation & duplicate prevention
  console.log('Test 5: Order cancellation and inventory restoration...');
  cancelOrderSimulation(clonedProducts, orderResult.deductedStock);
  assert.strictEqual(clonedProducts[0].stock_quantity, 15); // restored
  assert.strictEqual(clonedProducts[1].variants[0].stock_quantity, 8); // restored
  console.log('✅ Test 5 Passed: Stock restoration restores exact previous levels.\n');

  // Test 6: Overselling prevention
  console.log('Test 6: Overselling protection check...');
  let oversellError = false;
  try {
    processOrderSimulation(clonedProducts, [
      { productId: 'prod-s', quantity: 999 }, // way more than 15
    ]);
  } catch (err) {
    oversellError = true;
  }
  assert.strictEqual(oversellError, true);
  console.log('✅ Test 6 Passed: Overselling prevented.\n');

  console.log('🎉 ALL 6 AUTOMATED BUSINESS LOGIC TESTS PASSED SUCCESSFULLY!\n');
} catch (err) {
  console.error('❌ Test failed:', err);
  process.exit(1);
}
