// Hover produits
const products = document.querySelectorAll('.product');
products.forEach(p => {
  p.addEventListener('mouseenter',()=>{p.style.transform="translateY(-5px)";p.style.boxShadow="0px 5px 15px rgba(0,0,0,0.2)";});
  p.addEventListener('mouseleave',()=>{p.style.transform="translateY(0)";p.style.boxShadow="none";});
});

// Hover catégories (si tu ajoutes des catégories)
const categories = document.querySelectorAll('.category');
categories.forEach(c => {
  c.addEventListener('mouseenter',()=>{c.style.transform="translateY(-5px)";c.style.boxShadow="0px 5px 15px rgba(0,0,0,0.1)";});
  c.addEventListener('mouseleave',()=>{c.style.transform="translateY(0)";c.style.boxShadow="none";});
});

// Compteur produits commandés (optionnel)
const cartCount = document.getElementById('cart-count');
const orderButtons = document.querySelectorAll('.product .btn');
let count = 0;
orderButtons.forEach(btn => {
  btn.addEventListener('click',()=>{count++;if(cartCount) cartCount.textContent=count;});
});

// Scroll hero
const hero = document.querySelector('.hero');
window.addEventListener('scroll',()=>{if(hero){const s=window.scrollY;hero.style.opacity=1-s/600;}}); 
