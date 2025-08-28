// Test completo del sistema de órdenes - simulando el comportamiento real
console.log('🧪 Testing complete order system behavior...\n');

// Simulación de formatOrderData
function formatOrderData(orderDetailsData) {
  try {
    const parsedItems = JSON.parse(orderDetailsData);
    const totalAmount = parsedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    return {
      items: parsedItems,
      totalAmount: Number(totalAmount.toFixed(2))
    };
  } catch (error) {
    console.error('Error parsing order data:', error);
    return { items: [], totalAmount: 0 };
  }
}

// Simulación del componente OrderDetails
class MockOrderDetails {
  constructor() {
    this.orderDetails = { items: [], totalAmount: 0 };
    this.processedOrders = new Set();
  }
  
  handleOrderUpdate(eventDetail) {
    console.log('📋 Order update received:', eventDetail);
    
    try {
      const formattedData = formatOrderData(eventDetail);
      console.log('📋 Formatted order data:', formattedData);
      
      // If we receive multiple items, this is likely a complete order update
      if (formattedData.items.length > 1) {
        console.log('🔄 Multiple items received, replacing entire order');
        this.orderDetails = formattedData;
        this.processedOrders = new Set([JSON.stringify(formattedData.items.sort((a, b) => a.name.localeCompare(b.name)))]);
      } else if (formattedData.items.length === 1) {
        // Single item - check if we should accumulate or replace
        const newItem = formattedData.items[0];
        const orderKey = JSON.stringify([newItem].sort((a, b) => a.name.localeCompare(b.name)));
        
        // Check if this exact order has already been processed
        if (this.processedOrders.has(orderKey)) {
          console.log('🔄 Skipping duplicate single item processing');
          return this.orderDetails;
        }

        // If we have no items, just set the new item
        if (this.orderDetails.items.length === 0) {
          console.log('➕ Adding first item to empty order:', newItem.name);
          this.orderDetails = {
            items: [newItem],
            totalAmount: newItem.price * newItem.quantity
          };
        } else {
          // Check if item already exists in order
          const existingItemIndex = this.orderDetails.items.findIndex(
            item => item.name.toLowerCase() === newItem.name.toLowerCase()
          );
          
          let updatedItems;
          
          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            updatedItems = [...this.orderDetails.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            console.log('📈 Updated quantity for existing item:', newItem.name);
          } else {
            // Add new item to the order
            updatedItems = [...this.orderDetails.items, newItem];
            console.log('➕ Added new item to order:', newItem.name);
          }
          
          // Calculate new total
          const newTotal = updatedItems.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
          );
          
          this.orderDetails = {
            items: updatedItems,
            totalAmount: Number(newTotal.toFixed(2))
          };
        }
        
        // Add to processed orders
        this.processedOrders.add(orderKey);
      }
      
      return this.orderDetails;
      
    } catch (error) {
      console.error('❌ Error processing order update:', error);
      return this.orderDetails;
    }
  }
  
  clearOrder() {
    this.orderDetails = { items: [], totalAmount: 0 };
    this.processedOrders.clear();
    console.log('🧹 Order cleared');
  }
}

// JSON Repair Function
const repairJSON = (jsonString) => {
  console.log('🔧 Starting JSON repair for:', jsonString);
  
  if (jsonString.startsWith('[name"')) {
    jsonString = '[{"name"' + jsonString.slice(6);
    console.log('🔧 Fixed Case 1 - Added missing opening brace:', jsonString);
  } else if (jsonString.startsWith('name"')) {
    jsonString = '[{"name"' + jsonString.slice(5);
    console.log('🔧 Fixed Case 2 - Added array and opening brace:', jsonString);
  }
  
  jsonString = jsonString.replace(/},\s*"name":/g, '}, {"name":');
  console.log('🔧 Fixed object separators');
  
  if (!jsonString.endsWith('}]') && !jsonString.endsWith(']')) {
    if (jsonString.endsWith('}')) {
      jsonString += ']';
      console.log('🔧 Added missing closing bracket');
    } else {
      jsonString += '}]';
      console.log('🔧 Added missing closing brace and bracket');
    }
  }
  
  if (jsonString.endsWith(']') && !jsonString.includes('}]')) {
    jsonString = jsonString.slice(0, -1) + '}]';
    console.log('🔧 Added missing closing brace before bracket');
  }
  
  try {
    JSON.parse(jsonString);
    console.log('✅ JSON repair successful');
    return jsonString;
  } catch (error) {
    console.log('❌ JSON still invalid after repair');
    return '[]';
  }
};

// Simulación completa del flujo
console.log('=== Scenario 1: Order comes with multiple items (como en los logs) ===');
const mockOrderDetails = new MockOrderDetails();

// Simular que llega el JSON malformado de los logs
const brokenJsonFromLogs = '[name": "Dona old fashioned", "quantity": 1, "price": 1.29}, {"name": "Café americano regular", "quantity": 1, "price": 1.79}]';

// Reparar JSON
const repairedJson = repairJSON(brokenJsonFromLogs);
console.log('📝 Repaired JSON:', repairedJson);

// Procesar la orden
const result = mockOrderDetails.handleOrderUpdate(repairedJson);
console.log('📊 Final order state:', result);
console.log(`✅ Expected: 2 items, Got: ${result.items.length} items`);
console.log(`✅ Expected total: $3.08, Got: $${result.totalAmount}`);

if (result.items.length === 2 && result.totalAmount === 3.08) {
  console.log('🎉 SUCCESS! Order processed correctly with multiple items!');
} else {
  console.log('❌ FAILURE! Order not processed correctly');
}

console.log('\n=== Scenario 2: Individual items coming separately ===');
mockOrderDetails.clearOrder();

// Primer item
const item1 = '[{"name": "Dona old fashioned", "quantity": 1, "price": 1.29}]';
let result1 = mockOrderDetails.handleOrderUpdate(item1);
console.log('After item 1:', result1);

// Segundo item
const item2 = '[{"name": "Café americano regular", "quantity": 1, "price": 1.79}]';
let result2 = mockOrderDetails.handleOrderUpdate(item2);
console.log('After item 2:', result2);

if (result2.items.length === 2 && result2.totalAmount === 3.08) {
  console.log('🎉 SUCCESS! Sequential items processed correctly!');
} else {
  console.log('❌ FAILURE! Sequential items not processed correctly');
}

console.log('\n🏁 All scenarios tested!');
