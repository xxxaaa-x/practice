// =====================================================
// StudentSuppliesOrderingSystem - script.js
// =====================================================

// ---------- 1. Data ----------
// Hard-coded product list
const products = [
  { id: 1, name: "Ballpen",    price: 12 },
  { id: 2, name: "Pencil",     price: 10 },
  { id: 3, name: "Notebook",   price: 35 },
  { id: 4, name: "Yellow Pad", price: 45 },
  { id: 5, name: "Eraser",     price: 8  },
  { id: 6, name: "Ruler",      price: 15 }
];

// The shopping cart starts empty.
// Each cart item looks like: { id, name, price, quantity }
let cart = [];

// ---------- 2. Find the parts of the page we need ----------
const productGrid     = document.getElementById("product-grid");
const cartBody        = document.getElementById("cart-body");
const cartTotal       = document.getElementById("cart-total");
const summaryItems    = document.getElementById("summary-items");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryTotal    = document.getElementById("summary-total");

// ---------- 3. Helper function ----------
// Turns 12 into "₱12.00"
function formatPrice(amount) {
  return "₱" + amount.toFixed(2);
}

// ---------- 4. Show the products ----------
function displayProducts() {
  productGrid.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    productGrid.innerHTML += `
      <div class="product">
        <h3>${product.name}</h3>
        <p class="price">${formatPrice(product.price)}</p>
        <button data-id="${product.id}">Add to cart</button>
      </div>
    `;
  }
}

// ---------- 5. Cart actions ----------

// Add a product to the cart
function addToCart(productId) {
  // Is this product already in the cart?
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    // Yes: just increase its quantity
    existingItem.quantity += 1;
  } else {
    // No: find the product and add it with quantity 1
    const product = products.find(function (p) {
      return p.id === productId;
    });

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  displayCart();
}

// Make the quantity go up by 1
function increaseQuantity(productId) {
  const item = cart.find(function (item) {
    return item.id === productId;
  });

  item.quantity += 1;
  displayCart();
}

// Make the quantity go down by 1, but never below 1
function decreaseQuantity(productId) {
  const item = cart.find(function (item) {
    return item.id === productId;
  });

  if (item.quantity > 1) {
    item.quantity -= 1;
  }

  displayCart();
}

// Remove an item from the cart completely
function removeItem(productId) {
  // Keep every item EXCEPT the one being removed
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  displayCart();
}

// ---------- 6. Calculations ----------

// Total Amount = sum of all subtotals
// Subtotal = Unit Price x Quantity
function calculateTotal() {
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const subtotal = cart[i].price * cart[i].quantity;
    total += subtotal;
  }

  return total;
}

// Count all pieces in the cart (2 notebooks + 3 pens = 5)
function countItems() {
  let count = 0;

  for (let i = 0; i < cart.length; i++) {
    count += cart[i].quantity;
  }

  return count;
}

// ---------- 7. Show the cart ----------
function displayCart() {
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    // Empty cart message
    cartBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cart">
          Your cart is empty. Choose a product from the list above.
        </td>
      </tr>
    `;
  } else {
    // One table row for each item in the cart
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const subtotal = item.price * item.quantity;

      // The minus button is disabled when quantity is 1
      const disableMinus = item.quantity <= 1 ? "disabled" : "";

      cartBody.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${formatPrice(item.price)}</td>
          <td>
            <div class="qty-controls">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}"
                      aria-label="Decrease quantity of ${item.name}" ${disableMinus}>-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.id}"
                      aria-label="Increase quantity of ${item.name}">+</button>
            </div>
          </td>
          <td>${formatPrice(subtotal)}</td>
          <td>
            <button class="remove-btn" data-action="remove" data-id="${item.id}"
                    aria-label="Remove ${item.name} from cart">Remove</button>
          </td>
        </tr>
      `;
    }
  }

  // Update the total in the cart and in the order summary
  const total = calculateTotal();

  if(cartTotal){
  cartTotal.textContent = formatPrice(total);
}

if(summaryItems){
  summaryItems.textContent = countItems();
}

if(summarySubtotal){
  summarySubtotal.textContent = formatPrice(total);
}

if(summaryTotal){
  summaryTotal.textContent = formatPrice(total);
}
}

// ---------- 8. Listen for button clicks ----------

// Clicks on "Add to cart" buttons in the product list
productGrid.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (button) {
    // data-id is text, so Number() turns "3" into 3
    addToCart(Number(button.dataset.id));
  }
});

// Clicks on the +, -, and Remove buttons in the cart
cartBody.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const productId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") {
    increaseQuantity(productId);
  } else if (action === "decrease") {
    decreaseQuantity(productId);
  } else if (action === "remove") {
    removeItem(productId);
  }
});

// ---------- 9. Start the page ----------
displayProducts();
displayCart();
// =====================================================
// 10. PAYMENT AND RECEIPT SYSTEM
// =====================================================


const placeOrderButton = document.getElementById("place-order");
const receiptContent = document.getElementById("receipt-content");


// Generate random transaction number
function generateTransactionNumber(){

  return "TRX-" + Math.floor(Math.random() * 100000);

}



// Process payment
function processPayment(){


  const amountPaidInput =
  document.getElementById("amount-paid").value;


  const amountPaid =
  Number(amountPaidInput);


  const total =
  calculateTotal();



  // Validation 1: Empty
  if(amountPaidInput === ""){

    alert("Please enter payment amount.");
    return;

  }



  // Validation 2: Invalid number
  if(isNaN(amountPaid)){

    alert("Payment must be a valid number.");
    return;

  }



  // Validation 3: Negative
  if(amountPaid < 0){

    alert("Payment cannot be negative.");
    return;

  }



  // Validation 4: Insufficient
  if(amountPaid < total){

    alert("Insufficient payment.");
    return;

  }



  const change =
  amountPaid - total;



  generateReceipt(
    amountPaid,
    change
  );


}




// Create receipt
function generateReceipt(amountPaid, change){


let receiptHTML = `


<h3>
StudentSuppliesOrderingSystem
</h3>


<p>
Transaction No:
${generateTransactionNumber()}
</p>


<p>
Date:
${new Date().toLocaleString()}
</p>


<hr>


`;



// Add purchased products

for(let i=0; i<cart.length; i++){


const item = cart[i];


const subtotal =
item.price * item.quantity;



receiptHTML += `

<div class="summary-line">

<span>
${item.name} x ${item.quantity}
</span>


<span>
${formatPrice(subtotal)}
</span>


</div>

`;

}



receiptHTML += `


<hr>


<div class="summary-line summary-total">

<span>
Total
</span>


<span>
${formatPrice(calculateTotal())}
</span>


</div>



<p>
Amount Paid:
${formatPrice(amountPaid)}
</p>



<p>
Change:
${formatPrice(change)}
</p>



<p>
Payment successful!
</p>



<button onclick="newTransaction()">
New Transaction
</button>


`;



receiptContent.innerHTML = receiptHTML;


}




// Reset everything
function newTransaction(){


cart = [];


displayCart();


document.getElementById("amount-paid").value="";


receiptContent.innerHTML = `

<h3>
StudentSuppliesOrderingSystem
</h3>

<p>
No transaction yet.
</p>

`;

}

// Button click

placeOrderButton.addEventListener(
"click",
processPayment
);