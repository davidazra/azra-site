// ======= ANIMATION AU SURVOL DES PRODUITS =======
const products = document.querySelectorAll('.product');

products.forEach(product => {
  product.addEventListener('mouseenter', () => {
    product.style.transform = "translateY(-5px)";
    product.style.boxShadow = "0px 5px 15px rgba(0,0,0,0.2)";
  });
  product.addEventListener('mouseleave', () => {
    product.style.transform = "translateY(0)";
    product.style.boxShadow = "none";
  });
});

// ======= COMPTEUR DE PRODUITS "COMMANDÉS" =======
// Note : simple compteur visuel, même si WhatsApp gère la commande
const cartCount = document.getElementById('cart-count');
const orderButtons = document.querySelectorAll('.product .btn');

let count = 0;
orderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    count++;
    if(cartCount) cartCount.textContent = count;
  });
});

// ======= SCROLL ANIMATION POUR HERO =======
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if(hero){
    const scrollPos = window.scrollY;
    hero.style.opacity = 1 - scrollPos / 600;
  }
});

