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

var debug = require('debug')('cahoots:api:services:Person');
var mandatory = require('mandatory');
var VError = require('verror');

var storage = require('cahoots-api-storage');

module.exports = function instantiate () {
    var service = new PersonService();

    return {
        save: service.save.bind(service),
        findAll: service.findAll.bind(service),
        findById: service.findById.bind(service)
    };
};

function PersonService () {
    this.$dao = storage('person');
}

/**
 * Persists a person.
 *
 * @param {object} person
 * The person object that should be persisted.
 *
 * @param {function} callback
 * Will be executed when the person object has been stored. Executed as
 * `callback(err, person)`.
 *
 */
PersonService.prototype.save = function save (person, callback) {
    var self = this;

    mandatory(person).is('object', 'Please define a person which should be saved.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onUpdate (err, updatedPerson) {
        if (err) {
            if (err.type === 'NotFoundError') {
                debug('The person does not exist. Inserting it.');

                // This is a new person, set the timestamps accordingly
                person.created = person.modified = (Date.now() / 1000 | 0);

                return self.$dao.insert(person, onInsert);
            }

            return callback(new VError(err, 'failed to save the person.'));
        }

        debug('Updated existing person: %j', updatedPerson);

        callback(null, updatedPerson);
    }

    function onInsert (err, person) {
        if (err) {
            return callback(new VError(err, 'failed to persist a new person.'));
        }

        debug('save - Saved person: %j', person);

        callback(null, person);
    }

    person.modified = (Date.now() / 1000 | 0);

    this.$dao.update(person, onUpdate);
};

/**
 * Method for getting all persons.
 *
 * @param {function} callback
 * Will be executed when a result has arrived. Executed as
 * `callback(err, persons)` whereas `persons` CAN be an empty array when no
 * person has been found.
 *
 */
PersonService.prototype.findAll = function findAll (callback) {
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onQuery (err, persons) {
        if (err) {
            return callback(new VError(err, 'failed to find all persons.'));
        }

        callback(null, persons);
    }

    this.$dao.query({}, onQuery);
};

/**
 * Find a person by id.
 *
 * @param {function} callback
 * Will be executed when a result has arrived. Executed as `callback(err, person)`
 * whereas `person` CAN be `undefined` when no person has been found.
 *
 */
PersonService.prototype.findById = function findById (id, callback) {
    mandatory(id).is('string', 'Please define an id for the person that should be found.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onQuery (err, persons) {
        if (err) {
            return callback(new VError(err, 'failed to search for the person with the id "%s".', id));
        }

        if (persons.length > 1) {
            return callback(new VError('Hm. Found multiple persons with the id "%s" that should not be possible.', id));
        }

        callback(null, persons[0]);
    }

    this.$dao.query({id: id}, onQuery);
};
