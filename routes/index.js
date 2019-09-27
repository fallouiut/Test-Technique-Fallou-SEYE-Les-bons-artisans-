var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/load', function (req, res) {
    res.render("index", {products: req.session.products});
});

router.use('/create', function (req, res, next) {
    // si le formulaire est vide, on renvoie la page de base
    if(Object.keys(req.body).length === 0) {
        res.render("edit");
    } else {
        var id;

        if(req.body.product_id) {// si l'id est spécifié (dans le cas d'un message socket.io)
            id = parseInt(req.body.product_id);// convertit en string même si ça ne change rien
        } else {// sinon on cherche le dernier et on l'incrémente
            var lastProduct = req.session.products.pop();
            if (lastProduct) {
                id = lastProduct._id + 1
            } else {
                id = 1;
            }
            req.session.products.push(lastProduct);// pas oublier de le remettre
        }
        var productToAdd = {
            _id: id,
            name: req.body.product_name,
            type: req.body.product_type,
            price: req.body.product_price,
            rating: req.body.product_rating,
            warranty_years: req.body.product_warranty,
            available: (req.body.product_available == "true") ? true: false
        };

        // ajoute l'objet dans le tableau de produits
        req.session.products.push(productToAdd);

        // envoi d'un msg socket.io pour avertir d'un nouvel ajout
        req.app.get("io").sockets.emit("adding", {product: productToAdd});

        // redirection à la liste
        res.redirect("/products/load");
    }
});

router.use('/edit/:productId', function (req, res) {
    // si le form est vide
    if(Object.keys(req.body).length === 0) {
        req.session.products.forEach(function (foundProduct) {
            if (foundProduct._id == req.params.productId) {
                res.render("edit", {product: foundProduct});
            }
        });

    } else {
        req.session.products.forEach(function (foundProduct) {
            if (foundProduct._id == req.params.productId) {
                // on l'a trouvé, on le modifie
                foundProduct.name = req.body.product_name;
                foundProduct.type = req.body.product_type;
                foundProduct.price = req.body.product_price;
                foundProduct.rating = req.body.product_rating;
                foundProduct.warranty_years = req.body.product_warranty;
                foundProduct.available = req.body.product_available == "true" ? true: false;

                // notifier la modification à tous les utilisateurs
                req.app.get("io").sockets.emit("editing", {product: foundProduct});

                // redirection vers liste /load
                res.redirect("/products/load");
            }
        });
    }
});

router.use('/delete/:productId', function (req, res) {
    // je ne teste pas req.params.productId mais c'est possible avec express-validator
    req.session.products.forEach(function(foundProduct) {
        if(foundProduct._id == req.params.productId) {
            req.session.products = req.session.products.filter(function(elem){
                // on renvoie dans le nouvel array tous les product dont l'id, n'est pas celui que l'on veut supprimer
                return elem._id != req.params.productId;
            });
            // redirection a /load
            res.redirect("/products/load");

            // notifier tous les utilisateurs de la suppression
            req.app.get("io").sockets.emit("deleting", {productId: req.params.productId});
        }
    });
});

module.exports = router;
