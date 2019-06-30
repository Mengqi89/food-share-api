const xss = require('xss')

const ListService = {
    getAllListings(db) {
        return db
            .from('list')
            .select('*')
    },
    getListingById(db, id) {
        return ListService.getAllListings(db)
            .where('list.id', id)
            .first()
    },
    getListingsByUserId(db, userId) {
        return ListService.getAllListings(db)
            .where('list.username', userId)
    },
    insertListing(db, newListing) {
        return db
            .insert(newListing)
            .into('list')
            .returning('*')
            .then(([listing]) => listing)
            .then(listing => ListService.getListingById(db, listing.id))
    },
    updateListing(db, id, newListing) {
        return db('list')
            .where({ id })
            .update(newListing)
            .returning("*")
    },
    deleteListing(db, id) {
        return db('list')
            .where({ id })
            .del()
            .then(response => ListService.getAllListings(db)
            )
    },
    serializeListing(listing) {
        return {
            id: listing.id,
            title: xss(listing.title),
            summary: xss(listing.summary),
            address: xss(listing.address),
            contact: xss(listing.contact),
            type: xss(listing.type),
            zip: xss(listing.zip),
            username: parseInt(xss(listing.username))
        }
    }
}

module.exports = ListService
