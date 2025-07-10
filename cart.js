document.addEventListener('DOMContentLoaded', () => {
  const cart = {};
  const cartContainer = document.querySelector('.cart-container');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
  
  function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;
    let cartHTML = '';
    for (let itemName in cart) {
      const item = cart[itemName];
      totalItems += item.quantity;
      totalPrice += item.quantity * item.price;
      cartHTML += `
        <div class="cart-item">
          <div>
            <div class = "item-name">
              <span>${item.name}</span>
            </div>
            <div class = "item-cart-info">
              <span class = "item-quantity">${item.quantity}x </span>
              <span class = "item-quantititem-cart-totaly">@ $${item.price}</span>
              <span class = "item-cart-total">$${(item.quantity * item.price).toFixed(2)}</span>
              <Button class = "remove-from-cart"><i class = "fas fa-times-circle"></i></Button>
            </div>
          </div>
        </div>`;
    }
    cartContainer.innerHTML = `
      <div class="cart-header">Your Cart (${totalItems})</div>
      <div>${cartHTML || 'No items in cart.'}</div>
      <div class = "item-cart-total-order-price">
        <div>
          Order Total:
        </div>
        <div class = "total-order-price">
          $${totalPrice.toFixed(2)}
        </div>
      </div>
      <div><button class="Confirm">Confirm Order</button></div>
      <div class = "delivery-info">This is carbon-neutral Delivery</div>`;
  }

    addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      if (e.target.classList.contains('plus') || e.target.classList.contains('minus')) {
        return;
      }

      const itemDiv = button.closest('.item');
      const nameEl = itemDiv.querySelector('.full-name') || itemDiv.querySelector('div:nth-of-type(2)');
      const priceEl = itemDiv.querySelector('.price') || itemDiv.querySelector('h4');
      const itemName = nameEl.textContent.trim();
      const itemPrice = parseFloat(priceEl.textContent.replace('$', ''));

      cart[itemName] = cart[itemName] || {
        name: itemName,
        price: itemPrice,
        quantity: 0
      };
      cart[itemName].quantity += 1;
      const imageContainer = itemDiv.querySelector('.image-container');
      if (imageContainer) {
        imageContainer.classList.add('highlighted');
      }
      button.classList.add('added');
      button.innerHTML = `
        <span class="qty-controls" data-name="${itemName}">
          <button class="qty-btn minus">−</button>
          <span class="qty-value">${cart[itemName].quantity}</span>
          <button class="qty-btn plus">+</button>
        </span>`;
      updateCartUI();
    });
  });
  
  

  cartContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-from-cart')) {
      const cartItemDiv = e.target.closest('.cart-item');
      const itemName = cartItemDiv.querySelector('.item-name span').textContent.trim();

      delete cart[itemName];

      // un-highlight item image
      const productDiv = [...document.querySelectorAll('.item')].find(item => {
        const nameEl = item.querySelector('.full-name') || item.querySelector('div:nth-of-type(2)');
        return nameEl && nameEl.textContent.trim() === itemName;
      });
      

      if (productDiv) {
        const imageContainer = productDiv.querySelector('.image-container');
        if (imageContainer) {
          imageContainer.classList.remove('highlighted');
        }

        const addButton = productDiv.querySelector('.add-to-cart-button');
        if (addButton) {
          addButton.classList.remove('added');
          addButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Add to Cart`;
        }
      }

      updateCartUI();
    }
  });


  document.querySelector('.list').addEventListener('click', (e) => {
    if (e.target.classList.contains('plus') || e.target.classList.contains('minus')) {
      e.preventDefault();

      const controlWrapper = e.target.closest('.qty-controls');
      const itemName = controlWrapper.dataset.name;
      const quantityDisplay = controlWrapper.querySelector('.qty-value');
      const buttonWrapper = controlWrapper.closest('.add-to-cart-button');

      if (e.target.classList.contains('plus')) {
        cart[itemName].quantity += 1;
      } else if (e.target.classList.contains('minus')) {
        cart[itemName].quantity -= 1;
        if (cart[itemName].quantity <= 0) {
          delete cart[itemName];
          const imageContainer = buttonWrapper.closest('.item').querySelector('.image-container');
          if (imageContainer) {
            imageContainer.classList.remove('highlighted');
          }
          buttonWrapper.classList.remove('added');
          buttonWrapper.innerHTML = `<i class="fas fa-shopping-cart"></i> Add to Cart`;
          buttonWrapper.addEventListener('click', function handleAddClick(ev) {
            if (ev.target.classList.contains('plus') || ev.target.classList.contains('minus')) {
              return;
            }
            const itemDiv = buttonWrapper.closest('.item');
            const nameEl = itemDiv.querySelector('.full-name') || itemDiv.querySelector('div:nth-of-type(2)');
            const priceEl = itemDiv.querySelector('.price');
            const itemName = nameEl.textContent.trim();
            const itemPrice = parseFloat(priceEl.textContent.replace('$', ''));
            cart[itemName] = {
              name: itemName,
              price: itemPrice,
              quantity: 1
            };
            buttonWrapper.classList.add('added');
            buttonWrapper.innerHTML = `
              <span class="qty-controls" data-name="${itemName}">
                <button class="qty-btn minus">−</button>
                <span class="qty-value">1</span>
                <button class="qty-btn plus">+</button>
              </span>
            `;
            updateCartUI();
          });
          updateCartUI();
          return;
        }
      }
      if (quantityDisplay && cart[itemName]) {
        quantityDisplay.textContent = cart[itemName].quantity;
      }
      updateCartUI();
    }
  });

  document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('Confirm')) {
    const modal = document.getElementById('order-modal');
    modal.classList.remove('hidden');
  }

  if (e.target && e.target.id === 'close-modal') {
    const modal = document.getElementById('order-modal');
    modal.classList.add('hidden');
  }
});

});
