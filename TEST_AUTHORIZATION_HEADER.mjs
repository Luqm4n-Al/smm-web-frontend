#!/usr/bin/env node

/**
 * Quick test script untuk verify Authorization header debugging
 * 
 * Cara menggunakan:
 * 1. Buka analytics page di browser
 * 2. Buka DevTools console
 * 3. Copy-paste code di bawah
 * 4. Lihat output untuk verify semuanya working
 */

// ============================================
// TEST 1: Check if debug functions available
// ============================================
console.group('🧪 TEST 1: Verify Debug Functions Available');

try {
  // Import dari module (dalam browser console)
  // Ini hanya bisa dijalankan di browser yang sudah load analytics page
  console.log('ℹ️ Run this in browser console on analytics page:');
  console.log(`
    // Check if functions available
    import { logAuthorizationHeader, performAuthCheck, getWebSocketStatus } 
      from '@/features/dashboard/hooks/useSubscriptionDebug'
      
    // Then run these
    logAuthorizationHeader('TEST')
    performAuthCheck('TEST')
    console.log(getWebSocketStatus())
  `);
} catch (e) {
  console.log('❌ Cannot run in Node.js - requires browser environment');
}

console.groupEnd();

// ============================================
// TEST 2: Expected console patterns
// ============================================
console.group('🧪 TEST 2: Expected Console Output Patterns');

const expectedPatterns = [
  '🚀 [AnalyticsSubscription] Initialization Checklist',
  '🔐 [AnalyticsSubscription] Authorization Header Status',
  '🔐 [AnalyticsSubscription] Comprehensive Auth Check',
  '🔌 [AnalyticsSubscription] WS Connection Status Changed',
  '✅ Token present in localStorage',
  'Header Value',
  'Token Present',
  'Token Valid',
];

console.log('✅ Expected patterns to see in console:');
expectedPatterns.forEach((pattern, i) => {
  console.log(`  ${i + 1}. "${pattern}"`);
});

console.groupEnd();

// ============================================
// TEST 3: Token checking
// ============================================
console.group('🧪 TEST 3: Manual Token Check Commands');

const commands = [
  'localStorage.getItem("token")',
  'const t = localStorage.getItem("token"); t?.split(".").length === 3',
  'const t = localStorage.getItem("token"); JSON.parse(atob(t.split(".")[1]))',
  'const t = localStorage.getItem("token"); const p = JSON.parse(atob(t.split(".")[1])); new Date(p.exp * 1000)',
  'const t = localStorage.getItem("token"); const p = JSON.parse(atob(t.split(".")[1])); Date.now() > p.exp * 1000',
];

console.log('🔍 Run these commands in browser console to debug token:');
commands.forEach((cmd, i) => {
  console.log(`${i + 1}. ${cmd}`);
});

console.groupEnd();

// ============================================
// TEST 4: What to check
// ============================================
console.group('🧪 TEST 4: Checklist After Implementation');

const checklist = [
  { item: 'Hook mounts', expected: 'See initialization logs' },
  { item: 'Token status', expected: '✅ Present or ❌ Missing' },
  { item: 'Auth header', expected: 'Bearer eyJ...' },
  { item: 'JWT format', expected: '✅ Valid JWT (parts: 3)' },
  { item: 'Token expiration', expected: '✅ Valid or ⏰ EXPIRED' },
  { item: 'WS connection', expected: '🔌 Connected: true' },
  { item: 'Periodic checks', expected: 'Log every 30s if status changes' },
];

console.table(checklist);

console.groupEnd();

// ============================================
// TEST 5: Screenshots to verify
// ============================================
console.group('🧪 TEST 5: Verification Steps');

console.log(`
✅ VERIFICATION STEPS:

1. Open http://localhost:3000/dashboard/analytics in browser
2. Open DevTools (F12) → Console tab
3. Look for these logs in order:
   
   a) 🚀 [AnalyticsSubscription] Initialization Checklist
      - Should show Token Status
      - Should show WS Endpoint
   
   b) 🔐 [AnalyticsSubscription] Authorization Header Status
      - Should show "✅ Token present"
      - Should show "📤 Authorization header to be sent: Bearer eyJ..."
   
   c) 🔐 [AnalyticsSubscription] Comprehensive Auth Check
      - Should show 6 checks, all ✅
      - Should show "✅ All auth checks PASSED"
   
   d) 🔌 [AnalyticsSubscription] Initial WS Connection Check
      - Should show auth header details
   
   e) 📡 [AnalyticsSubscription] Hook mounted
      - Should see data coming in

4. Verify Authorization Header appears in:
   - Initialization logs (show token and header)
   - WS status logs (every 30s)
   - Network tab (check WS connection headers)

5. Test error cases:
   - Clear localStorage: localStorage.clear()
   - Reload page
   - Should see ❌ No token logs
   - Should see ❌ Some auth checks FAILED
`);

console.groupEnd();

// ============================================
// TEST 6: Expected vs Actual
// ============================================
console.group('🧪 TEST 6: Expected Console Format');

console.log(`
🔐 [AnalyticsSubscription] Authorization Header Status
  ✅ Token present in localStorage
  📊 Format: ✅ Valid JWT (parts: 3)
  📋 Token preview: eyJhbGciOiJIUzI1NiIs...VN7Rm...
  📦 Token size: 234 bytes
  
  📋 Token payload:
    Subject              user@example.com
    Issued At            4/27/2026, 8:00:00 PM
    Expires At           4/28/2026, 8:00:00 PM
    Status               ✅ Valid
    Time Left            23 hours 45 minutes
  
  📤 Authorization header to be sent:
     Bearer eyJhbGciOiJIUzI1NiIs...


🔐 [AnalyticsSubscription] Comprehensive Auth Check
  1️⃣ Token in localStorage             ✅ Found
  2️⃣ Token format                      ✅ Valid JWT
  3️⃣ Token expiration                  ✅ Valid
  4️⃣ WS endpoint                       ✅ ws://192.168.100.114:8080/graphql
  5️⃣ Auth header will be sent          ✅ Will be sent
  6️⃣ GraphQL endpoint                  ✅ http://192.168.100.114:8080/query

✅ [AnalyticsSubscription] All auth checks PASSED - Ready to subscribe
`);

console.groupEnd();

console.log('');
console.log('✅ All tests defined! Now verify on actual analytics page...');
console.log('');
