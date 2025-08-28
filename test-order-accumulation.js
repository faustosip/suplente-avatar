// Script de prueba para verificar las correcciones
// Este script simula múltiples eventos de orden para verificar la acumulación

console.log('🧪 Testing Order Accumulation Fix...\n');

// Simular el procesamiento de OrderDetails.tsx
class MockOrderDetails {
    constructor() {
        this.orderDetails = { items: [], totalAmount: 0 };
        this.processedOrders = new Set();
    }
    
    formatOrderData(orderDetailsData) {
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
    
    handleOrderUpdate(eventDetail) {
        console.log('📋 Order update received:', eventDetail);
        
        try {
            const formattedData = this.formatOrderData(eventDetail);
            
            // Create a unique key for this order data to prevent duplicate processing
            const orderKey = JSON.stringify(formattedData.items.sort((a, b) => a.name.localeCompare(b.name)));
            
            // Check if this exact order has already been processed
            if (this.processedOrders.has(orderKey)) {
                console.log('🔄 Skipping duplicate order processing');
                return this.orderDetails;
            }

            // If this is a single item being added, accumulate it
            if (formattedData.items.length === 1) {
                const newItem = formattedData.items[0];
                
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
            } else {
                // If multiple items, replace the entire order (this is a complete order update)
                this.orderDetails = formattedData;
                console.log('🔄 Replaced entire order with:', formattedData.items.length, 'items');
            }
            
            // Add to processed orders
            this.processedOrders.add(orderKey);
            
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

// Test scenarios
const mockOrderDetails = new MockOrderDetails();

console.log('=== Test 1: Adding individual items (should accumulate) ===');

// First item: Dona
const item1 = '[{"name": "Dona glaseada con especias de calabaza", "quantity": 1, "price": 1.29}]';
let result = mockOrderDetails.handleOrderUpdate(item1);
console.log('After item 1:', result);

// Second item: Latte
const item2 = '[{"name": "Latte", "quantity": 1, "price": 3.49}]';
result = mockOrderDetails.handleOrderUpdate(item2);
console.log('After item 2:', result);

// Third item: Café Americano
const item3 = '[{"name": "Café Americano", "quantity": 1, "price": 1.79}]';
result = mockOrderDetails.handleOrderUpdate(item3);
console.log('After item 3:', result);

console.log('\n✅ Final order should have 3 items totaling $6.57');
console.log('Final result:', result);
console.log(`Items: ${result.items.length}, Total: $${result.totalAmount}`);

console.log('\n=== Test 2: Duplicate prevention ===');

// Try to add the same item again
result = mockOrderDetails.handleOrderUpdate(item1);
console.log('After duplicate item 1:', result);
console.log('Should still have 3 items (no duplicates)');

console.log('\n=== Test 3: Quantity update for same item ===');

// Add another Latte (should increase quantity)
result = mockOrderDetails.handleOrderUpdate(item2);
console.log('After second latte (should be same as before due to duplicate prevention):', result);

// Clear and test fresh latte
mockOrderDetails.clearOrder();
mockOrderDetails.handleOrderUpdate(item2); // First latte
const anotherLatte = '[{"name": "latte", "quantity": 1, "price": 3.49}]'; // Case insensitive test
result = mockOrderDetails.handleOrderUpdate(anotherLatte);
console.log('After case-insensitive latte:', result);

console.log('\n🏁 Testing complete!');
