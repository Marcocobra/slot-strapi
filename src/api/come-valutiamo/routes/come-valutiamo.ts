import { factories } from '@strapi/strapi';

// Content Manager handles editing; the website API only reads the single page.
export default factories.createCoreRouter('api::come-valutiamo.come-valutiamo', { only: ['find'] });
