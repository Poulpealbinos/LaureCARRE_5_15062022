/**
 * Return all the products JSON using fetch api
 * @return { Array } products
 */
async function getAllProducts() {
    try {
        const reponse = await fetch(" http://localhost:3000/api/products");
        if(!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;

    }
    catch(error) {
        console.error(`Impossible d'obtenir les produits : ${error}`);
    }
}

/**
 * Display the products in card
 * @param { Array } products
 * @return { HTMLElement } cards
 */
async function displayProductsCard(products){

    //en attente du tableau json
    let items = await products;

    //regroupement de toutes les cards
    let cards = '';

    for (let product of items) {
        //génération du HTML pour chaque produit
        let card = '<a href="./product.html?id=' + product._id + '"><article>';
        card += '<img src="' + product.imageUrl + '" alt="' + product.altTxt + '">';
        card += '<h3 class="productName">' + product.name + '</h3>';
        card += '<p class="productDescription">' + product.description + '</p>';
        card += '</article></a>';

        //ajout du produit itéré dans $cards
        cards += card;
    }
    
    let socle = document.getElementById("items")
        socle.innerHTML = cards;
}


const jsonPromise = getAllProducts();
displayProductsCard(jsonPromise);