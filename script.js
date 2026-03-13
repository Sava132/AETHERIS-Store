const products = [
    { id: 1, name: 'Wild Raspberry', price: 12.99, img: 'https://pngimg.com/uploads/raspberry/raspberry_PNG50.png' },
    { id: 2, name: 'Blueberry Mix', price: 8.50, img: 'https://pngimg.com/uploads/blueberries/blueberries_PNG21.png' },
    { id: 3, name: 'Fresh Strawberry', price: 10.00, img: 'https://pngimg.com/uploads/strawberry/strawberry_PNG2598.png' },
    { id: 4, name: 'Premium Blackberry', price: 15.20, img: 'https://pngimg.com/uploads/blackberry/blackberry_PNG50.png' },
    { id: 5, name: 'Golden Mango', price: 5.50, img: 'https://pngimg.com/uploads/mango/mango_PNG9178.png' },
    { id: 6, name: 'Dragon Fruit', price: 14.00, img: 'https://pngimg.com/uploads/dragon_fruit/dragon_fruit_PNG38.png' },
    { id: 7, name: 'Organic Banana', price: 3.20, img: 'https://pngimg.com/uploads/banana/banana_PNG842.png' },
    { id: 8, name: 'Tropical Pineapple', price: 9.80, img: 'https://pngimg.com/uploads/pineapple/pineapple_PNG2740.png' }
];

let cart = [];

const productsGrid = document.getElementById('productsGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountLabel = document.querySelector('.cart-count');
const totalPriceLabel = document.getElementById('totalPrice');
const cartModal = document.getElementById('cartModal');
const cartBody = document.getElementById('cartBody');

// --- RENDER PRODUCTS ---
function render(items) {
    productsGrid.innerHTML = items.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">$${p.price}</p>
            <button class="buy-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// --- CART LOGIC ---
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push({...product, tempId: Date.now() + Math.random()});
    updateUI();
}

function removeFromCart(tempId) {
    cart = cart.filter(item => item.tempId !== tempId);
    updateUI();
}

function updateUI() {
    cartCountLabel.innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPriceLabel.innerText = total.toFixed(2);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #64748b; text-align: center; margin-top: 20px;">Empty Basket</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 14px; color: #94a3b8;">$${item.price}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.tempId})">Remove</button>
            </div>
        `).join('');
    }
}

// --- CHECKOUT PROCESS ---
document.getElementById('checkoutBtn').onclick = () => {
    if (cart.length === 0) return alert("Add some fruits first!");

    const originalContent = cartBody.innerHTML;
    

    cartBody.innerHTML = `
        <div style="text-align: center; padding-top: 50px;">
            <div style="font-size: 60px; margin-bottom: 20px;">🍓</div>
            <h2>Order Placed!</h2>
            <p style="color: #94a3b8; margin: 20px 0 40px;">Thank you, Lui! Your fresh order is on its way.</p>
            <button id="resetCart" class="checkout-btn">Back to Shop</button>
        </div>
    `;

    cart = [];
    updateUI();

    document.getElementById('resetCart').onclick = () => {
        cartModal.classList.remove('active');
        setTimeout(() => {
            cartBody.innerHTML = originalContent;
            // Перепривязываем события после возврата HTML
            document.getElementById('closeCart').onclick = () => cartModal.classList.remove('active');
            // Перепривязываем сам checkoutBtn, так как он был в originalContent
            const newCheckoutBtn = document.getElementById('checkoutBtn');
            newCheckoutBtn.onclick = document.getElementById('checkoutBtn').onclick; 
            location.reload(); // Простой способ вернуть все события на место
        }, 500);
    };
};

// --- CONTROLS ---
document.getElementById('cartBtn').onclick = () => cartModal.classList.add('active');
document.getElementById('closeCart').onclick = () => cartModal.classList.remove('active');

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    render(filtered);
});

render(products);