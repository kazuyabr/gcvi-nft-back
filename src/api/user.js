const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.first_name, 'First Name is null')
            existsOrError(user.last_name, 'Last Name is null')
            existsOrError(user.user_name, 'Last Name is null')
            existsOrError(user.email, 'E-mail is null')
            existsOrError(user.password, 'Password is null')
            existsOrError(user.confirmPassword, 'Confirm is null')
            equalsOrError(user.password, user.confirmPassword,'Password not match')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'User already registered')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deleted_at')
                .then(user => res.status(204).send({message:'User updated successfully',data: user}))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(user => res.status(204).send({message:'User saved successfully',data: user}))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deleted_at')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getWallet = (req, res) => {
        const user = { ...req.body }
        app.db('users')
            .select('walletHash')
            .where({ walletHash: user.walletHash })
            .whereNull('deleted_at')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deleted_at')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('users')
                .update({deleted_at: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send({message:'User deleted', data: rowsUpdated})
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getWallet, getById, remove }
}