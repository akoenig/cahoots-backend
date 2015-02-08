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

var debug = require('debug')('cahoots:api:services:Factory');
var mandatory = require('mandatory');

var services = {
    account: require('./account'),
    person: require('./person'),
    organization: require('./organization')
};

module.exports = function create (type) {
    var service = services[type];

    mandatory(service).is('function', 'The Service "' + type + '" does not exist.');

    debug('Created service with type "%s"', type);

    return service();
};
