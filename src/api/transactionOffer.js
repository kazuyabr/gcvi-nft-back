module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

    const get = (req, res) => {
        app.db('transactions')
            .select('id','user_id','transaction_id','name','quantity','amount','type','created_at')
            .whereNull('deleted_at')
            .orWhereNull('closed_at')
            .then(transactions => res.status(200).json(transactions))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        app.db('transactions')
        .select('id','user_id','transaction_id','name','quantity','amount','type','created_at')
        .where({ id: req.params.id })
        .whereNull('deleted_at')
        .orWhereNull('closed_at')
        .first()
        .then(transactions => res.json(transactions))
        .catch(err => res.status(500).send(err))
    }

    const save = async (req, res) => {
        const transaction = { ...req.body }
        if(req.params.id) transaction.id = req.params.id

        try {
            existsOrError(transaction.name, 'Transaction Name is null')
            existsOrError(transaction.quantity, 'Transaction Quantity is null')
            existsOrError(transaction.amount, 'Transaction Amount is null')
            existsOrError(transaction.type, 'Transaction Type is null')

            const transactionFromDB = await app.db('transactionsoffer')
                .where({ id: transaction.id }).first()
            if(!transactionFromDB.id) {
                notExistsOrError(transactionFromDB, 'TransactionsOffer no Exists')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }


        if(transaction.id) {
            app.db('transactionsoffer')
                .update(transaction)
                .where({ id: transaction.id })
                .whereNull('deleted_at')
                .then(transaction => res.status(204).send({message:'TransactionsOffer updated successfully',data: transaction}))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('transactionsoffer')
                .insert(transaction)
                .then(transaction => res.status(204).send({message:'TransactionsOffer saved successfully',data: transaction}))
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('transactionsoffer')
                .update({deleted_at: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'TransactionsOffer no Exists.')

            res.status(204).send({message:'TransactionsOffer Deleted', data: rowsUpdated})
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const close = async (req, res) => {
        try {
            const rowsUpdated = await app.db('transactionsoffer')
                .update({closed_at: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'TransactionsOffer no Exists.')

            res.status(204).send({message:'TransactionsOffer Closed', data: rowsUpdated})
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, close, remove }
}