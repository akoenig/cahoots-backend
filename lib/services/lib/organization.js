/*
 * cahoots-api-services
 *
 * Copyright Cahoots.pw
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

var debug = require('debug')('cahoots:api:services:Organization');
var mandatory = require('mandatory');
var VError = require('verror');

var storage = require('cahoots-api-storage');

module.exports = function instantiate () {
    var service = new OrganizationService();

    return {
        save: service.save.bind(service),
        findAll: service.findAll.bind(service),
        findById: service.findById.bind(service),
        findByIds: service.findByIds.bind(service)
    };
};

function OrganizationService () {
    this.$dao = storage('organization');
}

/**
 * Persists an organization.
 *
 * @param {object} organization
 * The organization object that should be persisted.
 *
 * @param {function} callback
 * Will be executed when the organization object has been stored. Executed as
 * `callback(err, organization)`.
 *
 */
OrganizationService.prototype.save = function save (organization, callback) {
    var self = this;

    mandatory(organization).is('object', 'Please define a organization which should be saved.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onUpdate (err, updatedOrg) {
        if (err) {
            if (err.type === 'NotFoundError') {
                debug('The organization does not exist. Inserting it.');

                // Due to the fact that this is a new organization entry, set the
                // timestamps accordingly.
                organization.created = organization.modified = (Date.now() / 1000 | 0);

                return self.$dao.insert(organization, onInsert);
            }

            return callback(new VError(err, 'failed to save the organization.'));
        }

        debug('Updated existing organization: %j', updatedOrg);

        callback(null, updatedOrg);
    }

    function onInsert (err, insertedOrg) {
        if (err) {
            return callback(new VError(err, 'failed to save the organization.'));
        }

        debug('Created new organization: %j', insertedOrg);

        callback(null, insertedOrg);
    }

    organization.modified = (Date.now() / 1000 | 0);

    this.$dao.update(organization, onUpdate);
};

/**
 * Method for finding all organizations.
 *
 * @param {function} callback
 * Will be executed when the search operation is done. Executed as `callback(err, organizations)`.
 *
 */
OrganizationService.prototype.findAll = function findAll (callback) {
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onFindAll (err, organizations) {
        if (err) {
            return callback(new VError(err, 'failed to find all organizations'));
        }

        callback(null, organizations);
    }

    this.$dao.query({}, onFindAll);
};

/**
 * Find an organization by id.
 *
 * @param {function} callback
 * Will be executed when a result has arrived. Executed as `callback(err, organization)`
 * whereas `organization` CAN be `undefined` when no organization has been found.
 *
 */
OrganizationService.prototype.findById = function findById (id, callback) {
    mandatory(id).is('string', 'Please provide an organization id.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onFind (err, organizations) {
        if (err) {
            return callback(new VError(err, 'failed to search for the organization with the id "%s"', id));
        }

        if (organizations.length > 1) {
            return callback(new VError('Hm. Found multiple organizations with the id "%s" that should not be possible.', id));
        }

        callback(null, organizations[0]);
    }

    this.$dao.query({id: id}, onFind);
};

/**
 * Method for finding multiple organizations by an array of ids.
 *
 * @param {array} ids
 * An array with organization ids.
 *
 * @param {function} callback
 * Will be executed as `callback(err, organizations)`
 *
 */
OrganizationService.prototype.findByIds = function findByIds (ids, callback) {
    mandatory(ids).is('array', 'Please define an array with ids.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onFind (err, organizations) {
        if (err) {
            return callback(new VError(err, 'failed to search for organizations by ids: %j', ids));
        }

        callback(null, organizations);
    }

    this.$dao.query({id: {$in: ids}}, onFind);
};
