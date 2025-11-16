// Récupérer panier depuis localStorage ou créer vide
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Afficher le panier dans panier.html
function afficherPanier() {
    const tbody = document.getElementById('panier-items');
    if (!tbody) return; // Si on n'est pas sur la page panier, sortir
    tbody.innerHTML = '';
    let total = 0;

    panier.forEach((item, index) => {
        const itemTotal = item.prix * item.quantite;
        total += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nom}</td>
            <td>${item.prix} $</td>
            <td><input type="number" min="1" value="${item.quantite}" data-index="${index}" class="qty"></td>
            <td>${itemTotal} $</td>
            <td><button data-index="${index}" class="supprimer">X</button></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('total').textContent = total.toFixed(2);

    // Modifier quantité
    document.querySelectorAll('.qty').forEach(input => {
        input.addEventListener('change', e => {
            const idx = e.target.dataset.index;
            panier[idx].quantite = parseInt(e.target.value);
            sauvegarderEtAfficher();
        });
    });

    // Supprimer produit
    document.querySelectorAll('.supprimer').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.dataset.index;
            panier.splice(idx, 1);
            sauvegarderEtAfficher();
        });
    });
}

// Sauvegarder dans localStorage et rafraîchir affichage
function sauvegarderEtAfficher() {
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
}

// Ajouter produit au panier (fonction à appeler depuis bouton)
function ajouterAuPanier(nom, prix) {
    const existant = panier.find(p => p.nom === nom);
    if (existant) {
        existant.quantite += 1;
    } else {
        panier.push({nom, prix, quantite: 1});
    }
    sauvegarderEtAfficher();
}

// Initialiser affichage
afficherPanier();

