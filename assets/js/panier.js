// panier.js - version finale (devise : Fc)

// Récupérer panier depuis localStorage ou créer vide
// Initialisation robuste du panier depuis localStorage
let panier;
try {
    panier = JSON.parse(localStorage.getItem('panier'));
    if (!Array.isArray(panier)) {
        panier = [];
    }
} catch(e) {
    panier = [];
}


/* ------------------------------
   Afficher le panier complet (panier.html)
   ------------------------------ */
function afficherPanier() {
    const tbody = document.getElementById('panier-items');
    if (!tbody) return; // Si on n'est pas sur panier.html, on sort

    tbody.innerHTML = '';
    let total = 0;

    panier.forEach((item, index) => {
        const itemTotal = item.prix * item.quantite;
        total += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nom}</td>
            <td>${item.prix.toLocaleString('fr-FR')} Fc</td>
            <td><input type="number" min="1" value="${item.quantite}" data-index="${index}" class="qty"></td>
            <td>${itemTotal.toLocaleString('fr-FR')} Fc</td>
            <td><button data-index="${index}" class="supprimer">X</button></td>
        `;
        tbody.appendChild(tr);
    });

    const totalElement = document.getElementById('total');
    if (totalElement) totalElement.textContent = total.toLocaleString('fr-FR') + ' Fc';

    // Écoute des champs quantité (dans panier complet)
    document.querySelectorAll('.qty').forEach(input => {
        input.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index, 10);
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1) {
                panier[idx].quantite = val;
                sauvegarderEtAfficher();
            } else {
                // remettre à 1 si valeur invalide
                e.target.value = panier[idx].quantite;
            }
        });
    });

    // Écoute suppression dans panier complet
    document.querySelectorAll('.supprimer').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = parseInt(e.target.dataset.index, 10);
            if (!isNaN(idx)) {
                panier.splice(idx, 1);
                sauvegarderEtAfficher();
            }
        });
    });
}

/* ------------------------------
   Sauvegarder et rafraîchir affichage
   ------------------------------ */
function sauvegarderEtAfficher() {
    localStorage.setItem('panier', JSON.stringify(panier));
    // Mettre à jour la page panier (si ouverte) et le mini-panier
    afficherPanier();
    afficherMiniPanier();
}

/* ------------------------------
   Ajouter un produit au panier
   (appelé depuis index.html : ajouterAuPanier(nom, prix))
   ------------------------------ */
function ajouterAuPanier(nom, prix) {
    const existant = panier.find(p => p.nom === nom);
    if (existant) {
        existant.quantite += 1;
    } else {
        panier.push({ nom, prix, quantite: 1 });
    }
    sauvegarderEtAfficher();
}

/* ------------------------------
   Mini-panier (index.html) - gestion + / -
   ------------------------------ */

function miniPanierControls() {
    // Pour chaque mini-item on ajoute événements
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
    // prendre les 3 derniers produits ajoutés (dans l'ordre du plus récent au moins récent)
    const derniers = panier.slice(-3); // ex: [a,b,c] (ordre ancien->nouveau)
    // on veut afficher du plus récent au moins récent
    const derniersInverse = derniers.slice().reverse(); // [c,b,a]

    const miniPanierSection = document.querySelector('.mini-panier');
    if (!miniPanierSection) return;

    if (derniersInverse.length === 0) {
        miniPanierSection.classList.add('hidden');
        return;
    } else {
        miniPanierSection.classList.remove('hidden');
    }

    // Pour chaque élément affiché, calculer son index d'origine dans "panier"
    // Si derniers = panier.slice(-3), alors pour chaque position j (0..), origIndex = panier.length - (j+1)
    // But since we reversed, for displayed index i (0..len-1), origIndex = panier.length - 1 - i
    derniersInverse.forEach((item, i) => {
        const origIndex = panier.length - 1 - i;
        const div = document.createElement('div');
        div.className = 'mini-item';
        // stocker l'index d'origine pour retrouver le bon élément (évite collisions)
        div.dataset.origIndex = origIndex;
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
        miniCart.appendChild(div);
    });

    // Après injection, attacher les events
    miniPanierControls();
}

/* ------------------------------
   Boutons de la page panier : continuer et confirmer (WhatsApp)
   ------------------------------ */

const continueBtn = document.getElementById('continue-btn');
if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (panier.length === 0) {
            alert("Votre panier est vide !");
            return;
        }

        // Construire le message (en Fc)
        let message = "Bonjour, je souhaite passer ma commande :\n\n";
        panier.forEach(item => {
            message += `- ${item.nom} x ${item.quantite} = ${ (item.prix * item.quantite).toLocaleString('fr-FR') } Fc\n`;
        });
        const total = panier.reduce((sum, item) => sum + item.prix * item.quantite, 0);
        message += `\nTotal : ${total.toLocaleString('fr-FR')} Fc`;

        // Met ton numéro WhatsApp Business (sans +, indicatif pays inclus)
        const numeroWhatsApp = "243891182454";

        // Encodage du message pour l'URL
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;

        // Ouvrir WhatsApp (nouvel onglet)
        window.open(url, "_blank");
    });
}

/* ------------------------------
   Initialisation et attach boutons produits (index.html)
   ------------------------------ */

function attachProductButtons() {
    // Les boutons dans index.html appellent déjà onclick="ajouterAuPanier(...)" dans ton HTML.
    // Mais on s'assure aussi d'attacher un rafraîchissement du mini-panier si l'utilisateur clique.
    document.querySelectorAll('.produit .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // petit délai pour s'assurer que ajouterAuPanier (si appelé via onclick) a mis à jour localStorage
            setTimeout(afficherMiniPanier, 50);
        });
    });
}

// Lancer initialisation quand le script est chargé (scripts sont en defer)
afficherPanier();
afficherMiniPanier();
attachProductButtons();
