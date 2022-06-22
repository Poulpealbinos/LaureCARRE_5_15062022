/**
 * Return orderId
 * @return { String } order ID
 */
 function urlOrderNumb() {
    //Check si GET param dans l'URL
    let pageURL = new URL(window.location.href);
    let searchParams = new URLSearchParams(pageURL.search);

    if(searchParams.has('order') && searchParams.get('order') !== null && searchParams.get('order') !== '') {
        let orderId = searchParams.get('order');
        return orderId;
    } else {
        document.getElementsByClassName('confirmation')[0].innerHTML = '<p>Une erreur est survenue : Numéro de commande introuvable !</p>';
        return null;
    }
}
/**
 * Insert orderID dans HTML
 * @return { HTMLElement } numéro de commande
 */
 function orderIdHTML() {
    let orderId = urlOrderNumb();

    //Exécution uniquement si article dans le panier
    if (orderId !== null) {
        document.getElementById("orderId").innerHTML = orderId;
    }
};
orderIdHTML();