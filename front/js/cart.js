/**
 * Return array with all produt carts within
 * @return { Array } $products with object
 */
function allStorage() {

    // Si le produit est vide => msg
    if (localStorage === null || localStorage.length == 0) {
        document.querySelector("#cart__items").innerHTML = `<p>Votre panier est vide</p>`;
        return null;
    }
    else {
        var products = [];
        var i = 0;
        // Transformation du localStorage en Array
        Object.keys(localStorage).forEach(function(key){
            products[i] = JSON.parse(localStorage.getItem(key));
            i ++
        });
        return products;
    }
}

/**
 * Insert the product info in template
 * @param { Object } items - Tableau des infos du produits
 * @return { HTMLElement } carts - Tableau des infos du produits
 */
function cartGenerateHTML() {
    let table = allStorage();

    //Exécution uniquement si article dans le panier
    if (table !== null) {
        let cartHTMLElement = '';
        
        table.forEach(function(item) {
            let fullprice = parseInt(item.prixUnitaire) * parseInt(item.quantity);
            let productcartHTML = '<article class="cart__item" data-id="' + item.id + '" data-color="' + item.color + '">';
            productcartHTML += '<div class="cart__item__img"><img src="' +  item.imageUrl + '" alt="' + item.altTxt + '"></div>';
            productcartHTML += '<div class="cart__item__content">';
            productcartHTML += '<div class="cart__item__content__description"><h2>' +  item.name + '</h2><p>' +  item.color + '</p><p>' + fullprice + ' €</p></div>';
            productcartHTML += '<div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' +  item.quantity + '"></div>';
            productcartHTML += '<div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>';
            return cartHTMLElement += productcartHTML;
        });
    document.getElementById("cart__items").innerHTML = cartHTMLElement;
    updateTotal();

    }
};

/**
 * Update total : price and number of article
 */
function updateTotal(){
    /**
    * Calcul du nombre d'article
    */
    //Récupération de toutes les quantités (et conversion en array)
    let everyQuantity = Array.from(document.getElementsByClassName('itemQuantity'));
    //Init du compteur
    let nmbArticle = 0;
    //Itération dans chaque résultat : addition
    everyQuantity.forEach( function(inputTarget) {
        let targetQty = inputTarget.value;
        nmbArticle += parseInt(targetQty);
    });
    //console.log(nmbArticle);
    document.getElementById("totalQuantity").innerHTML = nmbArticle;

    /**
    * Calcul du montant total
    */
    //Récupération de toutes les sommes (et conversion en array)
    let everyPrice = Array.from(document.querySelectorAll('div.cart__item__content__description > p:nth-child(3)'));
    //Init du compteur
    let prixTotal = 0;
    //Itération dans chaque résultat : addition
    everyPrice.forEach( function(inputTarget) {
        let targetPrice = inputTarget.innerText;
        targetPrice = targetPrice.replace(' €','');
        prixTotal += parseInt(targetPrice);
    });
    //console.log(prixTotal);
    document.getElementById("totalPrice").innerHTML = prixTotal;
}

/**
 * Change the quantity
 * @param loopElement { HTMLElement } input contenant la quantité modifiée
 */
function changeQuantity(loopElement){
    //Check si input non-vide, invalide, null ==> bloquer à 1
    if (loopElement.value < 1 || loopElement.value == null) {
        //Force l'affichage du 1
        loopElement.value = 1;
    }
    //Recupère le container parent
    let articleContainer = loopElement.closest('article.cart__item');
    //Recupère le date-id du container
    let idSelected = articleContainer.dataset.id;
    //Recupère le date-color du container
    let colorSelected = articleContainer.dataset.color;
    //Reforme le nom dans localStorage
    let storageName = idSelected + '_' + colorSelected;
    
    //Check si produit déjà dans le panier
    if (localStorage[storageName]) {

        // Si oui, reconstruction de l'objt
        let objLinea = localStorage[storageName];
        let objJson = JSON.parse(objLinea);

        //Modification de la quantité au panier
        objJson.quantity = loopElement.value;
        //console.log('Nouvelle quantité : ' + objJson.quantity);

        //Modification du prix
        let priceSelector = articleContainer.querySelector('div.cart__item__content > div.cart__item__content__description > p:nth-child(3)');
        let newTotalAmont = objJson.quantity * objJson.prixUnitaire;
        priceSelector.innerHTML = '<p>' + newTotalAmont + ' €</p>';

        //Reconversion en string et enregistrement
        let produitLinear = JSON.stringify(objJson);
        localStorage.setItem(storageName,produitLinear);
    }

    updateTotal();
}

/**
 * Call changeQuantity() function for each elements of getElementsByName
 */
function adjustQuantityLoop() {

    //Accroche des input à surveiller
    let inputQuantity = document.getElementsByName('itemQuantity');

    //Boucle pour chaque element puisque getElementsByName retourne une liste
    for (var i = 0, len = inputQuantity.length; i < len; i++) {
        //Wrapping dans fonction anonyme pour problème de closures
        (function() {
            let inputEnCours = inputQuantity[i];
            //console.log(inputEnCours);

            //Ecoute de l'event 'change', nvx wrap dans fonction anonyme pour entrer des variables
            inputQuantity[i].addEventListener('change', function(){ changeQuantity(inputEnCours) },false);
        }());
    }
    //Source pour correction : https://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
}

/**
 * Delete element from cart and localStorage
 * @param loopElement { HTMLElement } button de suppresion du produit
 */
 function deleteProduct(loopElement){
    //Message d'alerte
    let confirmation = confirm("Êtes-vous sur·e de vouloir supprimer ce produit de votre panier ?");
    if (confirmation) {
        //Recupère le container parent
        let articleContainer = loopElement.closest('article.cart__item');
        //Recupère le date-id du container
        let idSelected = articleContainer.dataset.id;
        //Recupère le date-color du container
        let colorSelected = articleContainer.dataset.color;
        //Reforme le nom dans localStorage
        let storageName = idSelected + '_' + colorSelected;
        
        //Check si produit dans le panier
        if (localStorage[storageName]) {
    
            //Suppression de l'article
            localStorage.removeItem(storageName);
            //Actualisation pour MAJ du panier
            location.reload();
        }
    }
}

/**
 * Call deleteProduct() function
 * Activation au click sur le button
 */
function deleteElementRoad() {

    //Accroche des input à surveiller
    let deleteButton = document.getElementsByClassName('deleteItem');

    //Boucle pour chaque element puisque getElementsByClassName retourne une liste
    for (var i = 0, len = deleteButton.length; i < len; i++) {
        //Wrapping dans fonction anonyme pour problème de closures
        (function() {
            let produitEnSuppression = deleteButton[i];
            //console.log(inputEnCours);

            //Ecoute de l'event 'change', nvx wrap dans fonction anonyme pour entrer des variables
            deleteButton[i].addEventListener('click', function(){ deleteProduct(produitEnSuppression) },false);
        }());
    }
    updateTotal();
    //Source pour correction : https://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
}

cartGenerateHTML();
adjustQuantityLoop();
deleteElementRoad();

//TRAITEMENT DES COMMANDES

/**
 * Vérifie si la valeur d'un input est conforme à une RegExp et renvoit un msg erreur dans le cas contraire
 * @param {HTMLInputElement} testedHTMLelement Input à tester
 * @param {RegExp} regex Var contenant la RegExp ciblée
 * @returns {InnerText} Message d'erreur
 */
function checkRegExp(testedHTMLelement, regex){
    let errorMsgPlace = testedHTMLelement.nextElementSibling;
    if (regex.test(testedHTMLelement.value)) {
        errorMsgPlace.innerText = '';
    } else {
        errorMsgPlace.innerText = "Le champs n'est pas valide, merci de vérifier";
    }
}

function validateInput() {
    //Création des expressions régulières
    let latinRegExp = new RegExp("^[A-z\u00C0-\u00ff ,.'-]{3,}$");
    let addressRegExp = new RegExp("^[A-z0-9\u00C0-\u00ff ,.'-]{3,}$");
    let emailRegExp = new RegExp('^[-A-z0-9.%_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,4}$');

    //Checking dès modification
    let form = document.querySelector(".cart__order__form");
    form.firstName.addEventListener('change', function() {checkRegExp(this,latinRegExp)});
    form.lastName.addEventListener('change', function() {checkRegExp(this,latinRegExp)});
    form.address.addEventListener('change', function() {checkRegExp(this,addressRegExp)});
    form.city.addEventListener('change', function() {checkRegExp(this,latinRegExp)});
    form.email.addEventListener('change', function() {checkRegExp(this,emailRegExp)});
}



function checkTheForm(){
    //Init valeur de retour
    let contact = {};
    let productsOrder = [];

    //Création object contact
    let firstname = document.getElementById('firstName').value;
    let lastname = document.getElementById('lastName').value;
    let address = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let email = document.getElementById('email').value;
    contact = {
        firstName: firstname,
        lastName: lastname,
        address: address,
        city: city,
        email: email
        };
    
    //Création tableau produit
    let productsStorage = allStorage();
    if (productsStorage !== null) {
        //Remappage de l'array
        let i = 0;
        productsStorage.forEach(function(item) {
            let quantity = parseInt(item.quantity);

            //si le produit est qty=1, stokage et passe au suivant
            if(quantity == 1) {
                productsOrder[i] = item.id;
                i ++
            }
            //si le produit est qty>1, 1 entrée par unité
            else if (quantity >= 2) {
                for (let qi = 0; qi < quantity; qi++) {
                    productsOrder[i] = item.id;
                    i ++
                }
            }
        });
    }

    const returning = {
        contact : contact,
        products: productsOrder,
    }
    return returning;
}

function passOrder(e) {
    e.preventDefault();

    let data = checkTheForm();
    console.log(data);

    let urlAPI = 'http://localhost:3000/api/products/order';
    fetch(urlAPI, {
      method: 'POST',
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then( (res) => res.json() )
    .then( function(order) {
       localStorage.clear();
        console.log(order)
        let URLconfirm = "confirmation.html?order=" + order.orderId;
        console.log(URLconfirm);
        document.location.href = URLconfirm ;
    })
    .catch( (err) => {
        alert ("Problème avec fetch : " + err.message);
    });
  }
  
document.getElementById("order")
        .addEventListener("click", passOrder);
validateInput();
checkTheForm();