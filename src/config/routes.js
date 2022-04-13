const admin = require('./admin')

module.exports = app => {
    app.get('/',()=>{
        return {message: "Teste de rota"};
    })
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/signinWallet', app.api.auth.signinWallet)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get))

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .get(admin(app.api.user.getWallet))
        .delete(admin(app.api.user.remove))

    app.route('/transaction/sell')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.transactionSell.save))
        .get(admin(app.api.transactionSell.getById))
        .delete(admin(app.api.transactionSell.remove))

    app.route('/transaction/buy')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.transactionBuy.save))
        .get(admin(app.api.transactionBuy.getById))
        .delete(admin(app.api.transactionBuy.remove))

    app.route('/transaction/offer')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.transactionOffer.save))
        .get(admin(app.api.transactionOffer.getById))
        .delete(admin(app.api.transactionOffer.remove))
}