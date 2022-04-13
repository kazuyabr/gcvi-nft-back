const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const transactiosSellCount = await app.db('transactionsOffer').count('id').where('type','sell').first()
        const transactiosBuyCount = await app.db('transactionsOffer').count('id').where('type','buy').first()
        const transactiosOfferCount = await app.db('transactionsOffer').count('id').first()
        const trnasactions = await app.db('transactions').count('id').first()

        const lastStat = await app.db('stats').first();

        const stat = {
            users: usersCount.count,
            transactions: trnasactions.count,
            transactionsSell: transactiosSellCount.count,
            transactionsBuy: transactiosBuyCount.count,
            transactionsOffer: transactiosOfferCount.count,
            created_at: new Date()
        };

        const changeUsers = !lastStat || stat.users !== lastStat.data.users
        const changeTransactiosSell = !lastStat || stat.transactiosSell !== lastStat.data.transactiosSell
        const changeTransactiosBuy = !lastStat || stat.articles !== lastStat.data.transactionsBuy
        const changeTransactiosOffer = !lastStat || stat.articles !== lastStat.data.transactionsOffer
        const changeTrnasactions = !lastStat || stat.articles !== lastStat.data.transactions

        if(changeUsers || changeTransactiosSell || changeTransactiosBuy || changeTransactiosOffer || changeTrnasactions) {
            let stats = {data: JSON.stringify(stat)};
            app.db('stats').insert(stats).then(() => console.log('[Stats] Estatíticas atualizadas!'))
        }
    })
}