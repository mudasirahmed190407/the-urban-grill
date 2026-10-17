
const menuItems = [
  { name: "Paneer Tikka", category: "Starters", price: 249, description: "Smoky paneer with Indian spices.", emoji: "🍢" },
  { name: "Chicken Tikka", category: "Starters", price: 299, description: "Tender chicken, marinated and grilled.", emoji: "🍗" },
  { name: "Veg Spring Rolls", category: "Starters", price: 199, description: "Crispy rolls with fresh vegetables.", emoji: "🥟" },
  { name: "Butter Chicken", category: "Mains", price: 349, description: "Creamy tomato gravy with tender chicken.", emoji: "🍛" },
  { name: "Paneer Butter Masala", category: "Mains", price: 299, description: "Paneer in a rich buttery gravy.", emoji: "🍲" },
  { name: "Chicken Biryani", category: "Mains", price: 329, description: "Fragrant basmati rice and spiced chicken.", emoji: "🍚" },
  { name: "Garlic Naan", category: "Breads & Rice", price: 69, description: "Soft naan with garlic and herbs.", emoji: "🫓" },
  { name: "Steamed Rice", category: "Breads & Rice", price: 99, description: "Fluffy, freshly cooked rice.", emoji: "🍚" },
  { name: "Gulab Jamun", category: "Desserts", price: 99, description: "Warm, syrup-soaked Indian sweet.", emoji: "🍮" },
  { name: "Chocolate Brownie", category: "Desserts", price: 149, description: "Rich chocolate brownie.", emoji: "🍫" }
];

let activeFilter = "All";
let cart = [];

const menuGrid = document.getElementById("menuGrid");
const menuFilters = document.getElementById("menuFilters");
const cartCount = document.getElementById("cartCount");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function renderMenu() {
  if (!menuGrid) return;

  const visibleItems = activeFilter === "All"
    ? menuItems
    : menuItems.filter(item => item.category === activeFilter);

  menuGrid.innerHTML = visibleItems.map(item => `
    <article class="menu-card">
      <div class="menu-card-image" aria-hidden="true">${item.emoji}</div>
      <div class="menu-card-body">
        <span class="menu-category">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-card-bottom">
          <strong>₹${item.price}</strong>
          <button class="add-to-cart" type="button" data-add="${item.name}">
            Add to basket
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  openModal(`
    <div class="modal-header">
      <h2>Your basket</h2>
      <button type="button" class="close-modal" data-close aria-label="Close">×</button>
    </div>
    ${cart.length === 0 ? `
      <p>Your basket is empty. Add something delicious from our menu.</p>
    ` : `
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <p>₹${item.price} × ${item.quantity}</p>
            </div>
            <div class="cart-actions">
              <button type="button" data-change="${item.name}" data-delta="-1">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-change="${item.name}" data-delta="1">+</button>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="cart-total"><strong>Total</strong><strong>₹${total}</strong></div>
      <p class="form-note">Demo basket only. Placing an order is not enabled yet.</p>
    `}
  `);
}

function openModal(html) {
  if (!modalBackdrop || !modalContent) {
    showToast("This feature is not available on this page.");
    return;
  }

  modalContent.innerHTML = html;
  modalBackdrop.hidden = false;
  modalBackdrop.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("open");
  modalBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
}

function reservationForm() {
  openModal(`
    <div class="modal-header">
      <h2>Reserve a table</h2>
      <button type="button" class="close-modal" data-close aria-label="Close">×</button>
    </div>
    <p>Send us your details to request a reservation.</p>
    <form id="reservationForm" class="reservation-form">
      <label>Your name
        <input name="name" required maxlength="100" placeholder="Full name">
      </label>
      <label>Phone number
        <input name="phone" required type="tel" maxlength="20" placeholder="Phone number">
      </label>
      <label>Email (optional)
        <input name="email" type="email" maxlength="150" placeholder="Email address">
      </label>
      <div class="form-row">
        <label>Date
          <input name="date" type="date" required>
        </label>
        <label>Time
          <input name="time" type="time" required>
        </label>
      </div>
      <label>Number of guests
        <select name="guests" required>
          <option value="1">1 guest</option>
          <option value="2" selected>2 guests</option>
          <option value="3">3 guests</option>
          <option value="4">4 guests</option>
          <option value="5">5 guests</option>
          <option value="6">6 guests</option>
          <option value="7">7 guests</option>
          <option value="8">8 guests</option>
          <option value="9">9 guests</option>
          <option value="10">10 guests</option>
        </select>
      </label>
      <label>Occasion (optional)
        <input name="occasion" maxlength="100" placeholder="Birthday, family dinner...">
      </label>
      <label>Special requests (optional)
        <textarea name="notes" rows="3" maxlength="1000" placeholder="Any special requests?"></textarea>
      </label>
      <div class="form-trap" aria-hidden="true">
        <label>Leave this empty
          <input name="website" tabindex="-1" autocomplete="off">
        </label>
      </div>
      <button class="button button-primary" type="submit">Send reservation request</button>
      <p class="form-note">Your table is not confirmed until the restaurant contacts you.</p>
      <p id="reservationMessage" role="status"></p>
    </form>
  `);

  const dateInput = modalContent.querySelector('input[name="date"]');
  if (dateInput) {
    const today = new Date();
    dateInput.min = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
  }
}

document.addEventListener("click", event => {
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    activeFilter = filterButton.dataset.filter;
    if (menuFilters) {
      menuFilters.querySelectorAll("[data-filter]").forEach(button => {
        button.classList.toggle("active", button === filterButton);
        button.setAttribute("aria-pressed", String(button === filterButton));
      });
    }
    renderMenu();
    return;
  }

  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const item = menuItems.find(entry => entry.name === addButton.dataset.add);
    if (!item) return;

    const existing = cart.find(entry => entry.name === item.name);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1 });

    updateCartCount();
    showToast(`${item.name} added to your basket`);
    return;
  }

  const changeButton = event.target.closest("[data-change]");
  if (changeButton) {
    const item = cart.find(entry => entry.name === changeButton.dataset.change);
    if (!item) return;

    item.quantity += Number(changeButton.dataset.delta);
    cart = cart.filter(entry => entry.quantity > 0);
    updateCartCount();
    renderCart();
    return;
  }

  if (event.target.closest("[data-open-reservation]")) {
    reservationForm();
    return;
  }

  if (event.target.closest("#openCart")) {
    renderCart();
    return;
  }

  if (event.target.closest("[data-close]") ||
      event.target === modalBackdrop) {
    closeModal();
    return;
  }

  if (event.target.closest("#browseMenu")) {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }
});

document.addEventListener("submit", async event => {
  if (event.target.id !== "reservationForm") return;
  event.preventDefault();

  const form = event.target;
  const message = form.querySelector("#reservationMessage");
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const requestData = Object.fromEntries(formData.entries());

  if (requestData.website) return;

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  if (message) message.textContent = "";

  try {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Could not send your request.");
    }

    if (message) {
      message.textContent = "Request sent! The restaurant will contact you to confirm.";
    }
    showToast("Reservation request sent");
    form.reset();
  } catch (error) {
    if (message) {
      message.textContent = "We couldn't send this request. Please try again later or contact the restaurant directly.";
    }
    showToast("Reservation request could not be sent");
    console.error("Reservation request failed:", error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send reservation request";
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

renderMenu();
updateCartCount();
