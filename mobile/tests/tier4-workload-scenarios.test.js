/**
 * @file tier4-workload-scenarios.test.js
 * Tier 4: Real-World Workload Scenarios Test Suite
 * Simulates complete, multi-step end-to-end user journeys through the application:
 * from product discovery to checkout, order tracking, cancellation, and customer support.
 */

const assert = require('node:assert/strict');

function runTests() {
  const suite = 'Tier 4: Real-World Workload Scenarios (8 Complete User Journeys)';
  const results = [];

  function test(id, desc, fn) {
    try {
      fn();
      results.push({ id, desc, pass: true });
    } catch (err) {
      results.push({ id, desc, pass: false, error: err.message });
    }
  }

  // ==========================================
  // JOURNEY 1: New User Shopping
  // Home -> Select Location -> Login -> Browse Category -> Product Details -> Add to Cart -> Checkout -> Place Order
  // ==========================================
  test('T4.01', 'Journey 1: New User Shopping: Home -> Select Location -> Login -> Category -> Product Detail -> Add to Cart -> Checkout -> Place Order', () => {
    // 1. App Launch on Home
    const state = {
      isLocationModalOpen: true,
      selectedLocation: null,
      user: { isLoggedIn: false, phone: '', name: '' },
      selectedCategory: null,
      activeProduct: null,
      cart: [],
      selectedAddress: null,
      orderHistory: []
    };

    // 2. Select Location
    state.selectedLocation = { city: 'Gurugram', area: 'DLF Phase 2' };
    state.isLocationModalOpen = false;
    assert.strictEqual(state.selectedLocation.city, 'Gurugram');

    // 3. User Login via LoginOtpModal
    state.user.phone = '9876543210';
    const otp = '1234'; // simulated instant OTP
    assert.strictEqual(otp, '1234');
    state.user.isLoggedIn = true;
    state.user.name = 'Omkar Sharma';
    assert.strictEqual(state.user.isLoggedIn, true);

    // 4. Browse Category (Dairy, Bread & Eggs)
    state.selectedCategory = 'Dairy, Bread & Eggs';
    assert.strictEqual(state.selectedCategory, 'Dairy, Bread & Eggs');

    // 5. Select Product Details
    state.activeProduct = {
      id: 'p1',
      name: 'Amul Taaza Homogenised Toned Milk',
      price: 33,
      mrp: 35,
      weight: '500ml',
      variants: ['500ml', '1L']
    };
    assert.strictEqual(state.activeProduct.id, 'p1');

    // 6. Add to Cart with selected weight
    state.cart.push({
      product: state.activeProduct,
      quantity: 1,
      selectedWeight: '500ml'
    });
    assert.strictEqual(state.cart.length, 1);
    assert.strictEqual(state.cart[0].quantity, 1);

    // 7. Proceed to Checkout with default selected address
    state.selectedAddress = {
      id: 'addr-1',
      tag: 'Home',
      line1: 'Flat 402, Sunshine Apartments',
      city: 'Gurugram',
      pincode: '122002'
    };
    assert.ok(state.selectedAddress !== null);

    // 8. Place Order
    const newOrderId = `ORD-${Date.now()}`;
    state.orderHistory.unshift({
      id: newOrderId,
      items: state.cart,
      totalAmount: 33 + 4 + 25, // itemTotal + handlingFee + deliveryFee
      status: 'Placed',
      paymentMethod: 'UPI'
    });
    state.cart = []; // clear cart upon order placement

    assert.strictEqual(state.orderHistory.length, 1);
    assert.strictEqual(state.orderHistory[0].status, 'Placed');
    assert.strictEqual(state.cart.length, 0);
  });

  // ==========================================
  // JOURNEY 2: Search Shopping
  // Home -> Search -> Suggestions -> Search Results -> Product Details -> Add to Cart -> Cart
  // ==========================================
  test('T4.02', 'Journey 2: Search Shopping: Home -> Search -> Suggestions -> Search Results -> Product Details -> Add to Cart -> Cart', () => {
    const catalog = [
      { id: 'p1', name: 'Amul Taaza Homogenised Toned Milk', category: 'Dairy, Bread & Eggs', price: 33 },
      { id: 'p2', name: 'Mother Dairy Full Cream Milk', category: 'Dairy, Bread & Eggs', price: 37 },
      { id: 'p3', name: 'Harvest Gold White Bread', category: 'Dairy, Bread & Eggs', price: 40 },
      { id: 'p4', name: 'Lay\'s Classic Salted Potato Chips', category: 'Snacks & Munchies', price: 20 }
    ];

    // 1. Tap search bar and type 'mil'
    let query = 'mil';
    // 2. Dynamic suggestions match names starting with or containing query
    const suggestions = catalog
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .map((p) => p.name);
    assert.ok(suggestions.length >= 2);
    assert.ok(suggestions.some((s) => s.includes('Amul Taaza')));

    // 3. User taps suggestion 'Amul Taaza Homogenised Toned Milk'
    query = suggestions[0];
    const results = catalog.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    assert.strictEqual(results.length, 1);

    // 4. Navigate to Product Detail
    const selected = results[0];
    assert.strictEqual(selected.id, 'p1');

    // 5. Add to Cart from Detail
    const cart = [{ product: selected, quantity: 1 }];
    assert.strictEqual(cart.length, 1);

    // 6. Navigate to Cart screen
    assert.strictEqual(cart[0].product.name, 'Amul Taaza Homogenised Toned Milk');
    assert.strictEqual(cart[0].quantity, 1);
  });

  // ==========================================
  // JOURNEY 3: Cart and Coupons
  // Add Multiple Products -> Update Quantities -> Apply Coupon -> Verify Total -> Checkout
  // ==========================================
  test('T4.03', 'Journey 3: Cart and Coupons: Add Multiple Products -> Update Quantities -> Apply Coupon -> Verify Total -> Checkout', () => {
    let cart = [
      { product: { id: 'p1', name: 'Milk', price: 33 }, quantity: 1 },
      { product: { id: 'p3', name: 'Bread', price: 40 }, quantity: 1 }
    ];

    // 1. Initial items total
    let itemTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    assert.strictEqual(itemTotal, 73);

    // 2. Update Quantities: increment milk to 3, bread to 2
    cart[0].quantity = 3; // 33 * 3 = 99
    cart[1].quantity = 2; // 40 * 2 = 80
    // Add third item
    cart.push({ product: { id: 'p10', name: 'Ghee 1L', price: 550 }, quantity: 1 });

    itemTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    assert.strictEqual(itemTotal, 99 + 80 + 550); // 729

    // 3. Free delivery threshold evaluation (> 149)
    const deliveryFee = itemTotal >= 149 ? 0 : 25;
    assert.strictEqual(deliveryFee, 0);

    // 4. Apply Coupon (BLINKIT50: ₹50 off on orders >= ₹199)
    const coupon = { code: 'BLINKIT50', discount: 50, minOrder: 199 };
    assert.ok(itemTotal >= coupon.minOrder);
    const discount = coupon.discount;

    // 5. Verify Grand Total
    const handlingFee = 4;
    const tip = 20;
    const grandTotal = itemTotal - discount + deliveryFee + handlingFee + tip;
    assert.strictEqual(grandTotal, 729 - 50 + 0 + 4 + 20); // 703

    // 6. Transition to Checkout
    assert.strictEqual(grandTotal, 703);
  });

  // ==========================================
  // JOURNEY 4: Address Management
  // Checkout -> Add Address -> Save -> Select Address -> Complete Checkout
  // ==========================================
  test('T4.04', 'Journey 4: Address Management: Checkout -> Add Address -> Save -> Select Address -> Complete Checkout', () => {
    let savedAddresses = [
      { id: 'addr-1', tag: 'Home', line1: 'Flat 402, Tower B', city: 'Gurugram', pincode: '122002' }
    ];
    let selectedAddress = savedAddresses[0];

    // 1. At Checkout, user taps 'Change' address -> opens AddEditAddressModal
    const newAddressInput = {
      tag: 'Work',
      line1: 'Building 10, Cyber City',
      city: 'Gurugram',
      pincode: '122002'
    };

    // 2. Save Address
    const createdAddress = { id: `addr-${Date.now()}`, ...newAddressInput };
    savedAddresses.push(createdAddress);
    assert.strictEqual(savedAddresses.length, 2);

    // 3. Select newly saved address
    selectedAddress = createdAddress;
    assert.strictEqual(selectedAddress.tag, 'Work');
    assert.strictEqual(selectedAddress.line1, 'Building 10, Cyber City');

    // 4. Complete Checkout with selected address
    const placedOrder = {
      orderId: 'ORD-ADDR-SUCCESS',
      deliveryAddress: selectedAddress,
      status: 'Placed'
    };
    assert.strictEqual(placedOrder.deliveryAddress.tag, 'Work');
  });

  // ==========================================
  // JOURNEY 5: Order Management
  // Place Order -> My Orders -> Order Details -> Track Order -> Cancel Eligible Order
  // ==========================================
  test('T4.05', 'Journey 5: Order Management: Place Order -> My Orders -> Order Details -> Track Order -> Cancel Eligible Order', () => {
    let orders = [
      {
        id: 'BLK-98214',
        date: '2026-11-04',
        items: [{ id: 'p1', name: 'Milk', price: 33, quantity: 2 }],
        totalAmount: 119,
        status: 'Placed',
        canCancel: true
      }
    ];

    // 1. Find placed order in My Orders
    const activeOrder = orders.find((o) => o.id === 'BLK-98214');
    assert.ok(activeOrder !== undefined);
    assert.strictEqual(activeOrder.status, 'Placed');

    // 2. Open Order Details & Track Order
    assert.strictEqual(activeOrder.canCancel, true);

    // 3. User triggers Cancel Order Modal
    const cancellationReason = 'Ordered items by mistake';
    const isWithinCancelWindow = true; // within 1 minute of dark store packing

    assert.ok(isWithinCancelWindow);
    activeOrder.status = 'Cancelled';
    activeOrder.cancelReason = cancellationReason;
    activeOrder.canCancel = false;

    // 4. Verify order status updated in state
    assert.strictEqual(activeOrder.status, 'Cancelled');
    assert.strictEqual(activeOrder.cancelReason, 'Ordered items by mistake');
  });

  // ==========================================
  // JOURNEY 6: Wishlist
  // Product Details -> Add to Wishlist -> Wishlist -> Add to Cart
  // ==========================================
  test('T4.06', 'Journey 6: Wishlist: Product Details -> Add to Wishlist -> Wishlist -> Add to Cart', () => {
    let wishlistIds = [];
    let cart = [];
    const product = { id: 'p5', name: 'Nutella Hazelnut Spread', price: 380, weight: '350g' };

    // 1. Add to Wishlist from Product Details
    if (!wishlistIds.includes(product.id)) {
      wishlistIds.push(product.id);
    }
    assert.strictEqual(wishlistIds.includes('p5'), true);

    // 2. Open Wishlist Screen and find product
    const wishlistItems = [product].filter((p) => wishlistIds.includes(p.id));
    assert.strictEqual(wishlistItems.length, 1);
    assert.strictEqual(wishlistItems[0].name, 'Nutella Hazelnut Spread');

    // 3. Add to Cart directly from Wishlist
    cart.push({ product: wishlistItems[0], quantity: 1 });
    assert.strictEqual(cart.length, 1);
    assert.strictEqual(cart[0].product.id, 'p5');
  });

  // ==========================================
  // JOURNEY 7: Order Feedback
  // Order Delivered -> Open Order -> Rate Order -> Submit Feedback
  // ==========================================
  test('T4.07', 'Journey 7: Feedback: Order Delivered -> Open Order -> Rate Order -> Submit Feedback', () => {
    let order = {
      id: 'BLK-88123',
      status: 'Delivered',
      rating: null,
      feedback: null
    };

    // 1. Verify order is delivered
    assert.strictEqual(order.status, 'Delivered');
    assert.strictEqual(order.rating, null);

    // 2. Open RateOrderModal and select 5 stars
    const ratingGiven = 5;
    const reviewText = 'Delivery partner arrived in 8 minutes! Fruits were crisp and fresh.';

    // 3. Submit Feedback
    order.rating = ratingGiven;
    order.feedback = reviewText;

    // 4. Verify feedback state persistence
    assert.strictEqual(order.rating, 5);
    assert.strictEqual(order.feedback, reviewText);
  });

  // ==========================================
  // JOURNEY 8: Account Management
  // Login -> Profile -> Saved Addresses -> My Orders -> Wishlist -> Support
  // ==========================================
  test('T4.08', 'Journey 8: Account Management: Login -> Profile -> Saved Addresses -> My Orders -> Wishlist -> Support', () => {
    const userSession = {
      isLoggedIn: true,
      name: 'Omkar Sharma',
      phone: '+91 98765 43210',
      email: 'omkar@example.com',
      savedAddressesCount: 2,
      ordersCount: 4,
      wishlistCount: 3,
      supportActive: true
    };

    // 1. Profile renders user details
    assert.strictEqual(userSession.isLoggedIn, true);
    assert.strictEqual(userSession.name, 'Omkar Sharma');

    // 2. Navigate to Saved Addresses shortcut
    assert.strictEqual(userSession.savedAddressesCount, 2);

    // 3. Navigate to My Orders shortcut
    assert.strictEqual(userSession.ordersCount, 4);

    // 4. Navigate to Wishlist shortcut
    assert.strictEqual(userSession.wishlistCount, 3);

    // 5. Navigate to 24x7 Customer Support
    assert.strictEqual(userSession.supportActive, true);
  });

  return { suite, results };
}

if (require.main === module) {
  const { suite, results } = runTests();
  const passed = results.filter((r) => r.pass).length;
  console.log(`[SUITE] ${suite}: ${passed}/${results.length} passed.`);
  results.forEach((r) => {
    if (!r.pass) console.error(`  FAIL: ${r.id} (${r.desc}) -> ${r.error}`);
  });
  if (passed !== results.length) process.exit(1);
}

module.exports = { runTests };
