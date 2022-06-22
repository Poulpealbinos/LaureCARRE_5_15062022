let pageURL = new URL(window.location.href);
let searchParams = new URLSearchParams(pageURL.search);
//Check si ID produit existant dans URL
if(searchParams.has('id')) {
    var idProduit = searchParams.get('id');
} else {
    console.error(`Impossible de récupérer les informations produit`);
}

/**
 * Return single product JSON using fetch api
 * @param { Int } id Id du produit
 * @return { Object } product
 */
 async function getSingleProduct(id) {
    try {
        let urlAPI = 'http://localhost:3000/api/products/' + id;
        const reponse = await fetch(urlAPI);
        if(!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;

    }
    catch(error) {
        console.error(`Impossible d'obtenir le produit : ${error}`);
    }
}

/**
 * Insert the product info in template
 * @param { Object } product
 * @return { HTMLElement } cards
 */
 async function insertSingleProduct(product){
    //en attente du tableau json
    let info = await product;
    document.getElementsByClassName("item__img")[0].innerHTML = '<img src="' + info.imageUrl + '" alt="' + info.altTxt + '">';
    document.getElementById("title").innerHTML = info.name;
    document.getElementById("price").innerHTML = info.price;
    document.getElementById("description").innerHTML = info.description;

    let colorsHTML = '';
    info.colors.forEach(
        function(color){
            colorsHTML += '<option value="' + color + '">' + color + '</option>'
        }
    )
    document.getElementById("colors").innerHTML = colorsHTML;
}

const jsonPromise = getSingleProduct(idProduit);
insertSingleProduct(jsonPromise);


/**Add the product to localStorage
 * @param { Int } id Id du produit
 * @return { Array }
 */
async function addToCard() {
    //Couleur du produit {string}
    let colorProduit = document.getElementById('colors').value;
    //Qtt du produit {int}
    let quantityProduit = parseInt(document.getElementById('quantity').value);
    //Nom de la variable pour localStorage (Id + couleur) {string}
    let strgName = idProduit + '_' + colorProduit;

    //Verifier si quantité valide
    if (quantityProduit == 0 || quantityProduit == null || quantityProduit == '' || !Number.isInteger(quantityProduit)) {
        window.alert("La quantité doit être comprise en 1 et 100");
        console.log(quantityProduit);
    }
    else {
        //Check si produit déjà dans le panier
        if (localStorage[strgName]) {

            // Si oui, reconstruction de l'objt
            let objLinea = localStorage[strgName];
            let objJson = JSON.parse(objLinea);

            //Ajout de la quantité au panier
            objJson.quantity = parseInt(objJson.quantity);
            objJson.quantity += quantityProduit;
            
            //Reconversion en string et enregistrement
            let produitLinear = JSON.stringify(objJson);
            localStorage.setItem(strgName,produitLinear);

            window.alert("La quantité à été mise à jour");
            console.log('produit déjà dans le panier ! Nouvelle quantité : ' + objJson.quantity);

        } else {
            console.log('produit PAS dans le panier');
            
            let info = await getSingleProduct(idProduit);
            let produitTable = {
                id : idProduit,
                quantity : Number(quantityProduit),
                color : colorProduit,
                name : info.name,
                imageAlt : info.altTxt,
                imageUrl : info.imageUrl,
                prixUnitaire : info.price,
                description : info.description
            };
    
            //LocalStorage ne stock que des strings => conversion
            let produitLinear = JSON.stringify(produitTable);
            localStorage.setItem(strgName,produitLinear);

            window.alert("Produit ajouté à votre panier");
        }
    }
}

document.getElementById('addToCart').addEventListener("click", addToCard);