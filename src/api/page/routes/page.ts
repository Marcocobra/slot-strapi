import { factories } from '@strapi/strapi';

// Editors write through Content Manager. Website REST access is read only.
export default factories.createCoreRouter('api::page.page', { only: ['find', 'findOne'] });
