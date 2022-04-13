const authSecret = process.env.APP_KEY;
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name,
            email: user.email,
            admin: user.admin,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    const signinWallet = async (req, res) => {
        if (!req.body.walletHash || req.body.walletHash===undefined) {
            return res.status(400).send('Wallet is null')
        }

        const user = await app.db('users')
            .where({ walletHash: req.body.walletHash })
            .first()

        if (!user) return res.status(400).send('Wallet not exists')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name,
            email: user.email,
            admin: user.admin,
            token: jwt.encode(payload, authSecret)
        })

    }

    return { signin, validateToken, signinWallet }
}