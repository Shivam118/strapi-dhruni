'use strict';

/**
 * web-config service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::web-config.web-config');
