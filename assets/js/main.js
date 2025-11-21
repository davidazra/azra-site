// ==========================
// Hover produits et catégories
// ==========================
const products = document.querySelectorAll('.product');
products.forEach(p => {
    p.addEventListener('mouseenter', () => {
        p.style.transform = "translateY(-5px)";
        p.style.boxShadow = "0px 5px 15px rgba(0,0,0,0.2)";
    });
    p.addEventListener('mouseleave', () => {
        p.style.transform = "translateY(0)";
        p.style.boxShadow = "none";
    });
});

const categories = document.querySelectorAll('.category');
categories.forEach(c => {
    c.addEventListener('mouseenter', () => {
        c.style.transform = "translateY(-5px)";
        c.style.boxShadow = "0px 5px 15px rgba(0,0,0,0.1)";
    });
    c.addEventListener('mouseleave', () => {
        c.style.transform = "translateY(0)";
        c.style.boxShadow = "none";
    });
});

// ==========================
// Compteur produits commandés
// ==========================
const cartCount = document.getElementById('cart-count');
const orderButtons = document.querySelectorAll('.product .btn');
let count = 0;
orderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        count++;
        if (cartCount) cartCount.textContent = count;
    });
});

// ==========================
// Scroll hero
// ==========================
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    if (hero) {
        const s = window.scrollY;
        hero.style.opacity = 1 - s / 600;
    }
});

// ==========================
// Mini-panier draggable + mobile
// ==========================
const miniPanier = document.getElementById('mini-panier');
if (miniPanier) {
    let isDragging = false;
    let offsetX, offsetY;

    // Charger position sauvegardée
    const savedPos = JSON.parse(localStorage.getItem('miniPanierPos'));
    if (savedPos) {
        miniPanier.style.left = savedPos.left + 'px';
        miniPanier.style.top = savedPos.top + 'px';
    } else {
        miniPanier.style.left = '20px';
        miniPanier.style.top = '20px';
    }

    function limitToScreen(x, y) {
        const maxX = window.innerWidth - miniPanier.offsetWidth;
        const maxY = window.innerHeight - miniPanier.offsetHeight;
        return {
            left: Math.min(Math.max(0, x), maxX),
            top: Math.min(Math.max(0, y), maxY)
        };
    }

    function startDrag(clientX, clientY) {
        isDragging = true;
        miniPanier.classList.add('dragging');
        offsetX = clientX - miniPanier.getBoundingClientRect().left;
        offsetY = clientY - miniPanier.getBoundingClientRect().top;
    }

    function doDrag(clientX, clientY) {
        if (!isDragging) return;
        const pos = limitToScreen(clientX - offsetX, clientY - offsetY);
        miniPanier.style.left = pos.left + 'px';
        miniPanier.style.top = pos.top + 'px';
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        miniPanier.classList.remove('dragging');
        localStorage.setItem('miniPanierPos', JSON.stringify({
            left: parseInt(miniPanier.style.left),
            top: parseInt(miniPanier.style.top)
        }));
    }

    // Desktop
    miniPanier.addEventListener('mousedown', e => { startDrag(e.clientX, e.clientY); e.preventDefault(); });
    document.addEventListener('mousemove', e => doDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    // Mobile
    miniPanier.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
        e.preventDefault();
    }, {passive: false});

    document.addEventListener('touchmove', e => {
        const touch = e.touches[0];
        doDrag(touch.clientX, touch.clientY);
    }, {passive: false});

    document.addEventListener('touchend', endDrag);
}

// ==========================
// Mini-panier dynamique + / -
// ==========================
function miniPanierControls() {
    document.querySelectorAll('.mini-item').forEach((div, i) => {
        const plusBtn = div.querySelector('.plus');
        const minusBtn = div.querySelector('.minus');
        const origIndex = parseInt(div.dataset.origIndex, 10);

        if (!isNaN(origIndex)) {
            if (plusBtn) {
                plusBtn.addEventListener('click', () => {
                    panier[origIndex].quantite += 1;
                    sauvegarderEtAfficher();
                });
            }

            if (minusBtn) {
                minusBtn.addEventListener('click', () => {
                    panier[origIndex].quantite -= 1;
                    if (panier[origIndex].quantite <= 0) {
                        panier.splice(origIndex, 1);
                    }
                    sauvegarderEtAfficher();
                });
            }
        }
    });
}

function afficherMiniPanier() {
    const miniCart = document.getElementById('mini-cart-items');
    if (!miniCart) return;

    miniCart.innerHTML = '';
    const derniers = panier.slice(-3).reverse();

    const miniPanierSection = document.getElementById('mini-panier');
    if (!miniPanierSection) return;

    if (derniers.length === 0) {
        miniPanierSection.classList.add('hidden');
        return;
    } else {
        miniPanierSection.classList.remove('hidden');
    }

    derniers.forEach((item, i) => {
        const origIndex = panier.length - 1 - i;
        const div = document.createElement('div');
        div.className = 'mini-item';
        div.dataset.origIndex = origIndex;
        div.style.opacity = '1'; // texte lisible
        miniCart.appendChild(div);

        div.innerHTML = `
            <div class="mini-left">
                <strong>${item.nom}</strong><br>
                <small>${item.quantite} x ${item.prix.toLocaleString('fr-FR')} Fc</small>
            </div>
            <div class="qty-control">
                <button class="minus">-</button>
                <span class="mini-qty">${item.quantite}</span>
                <button class="plus">+</button>
            </div>
        `;
    });

    // Mettre opacité du fond à 40%
    miniPanier.style.backgroundColor = 'rgba(255,255,255,0.4)';
    miniPanierControls();
}

// Mettre à jour mini-panier à chaque ajout
const boutons = document.querySelectorAll('.product .btn');
boutons.forEach(btn => btn.addEventListener('click', afficherMiniPanier));

// Initialisation
afficherMiniPanier();
