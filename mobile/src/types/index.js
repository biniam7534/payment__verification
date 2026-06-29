/**
 * Shared shape definitions used across the app (JSDoc, since the project is JS not TS).
 * TODO: migrate to TypeScript interfaces if/when the project moves to .tsx.
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} phoneNumber
 * @property {boolean} verified
 *
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} name
 * @property {string} date
 * @property {number} amount
 * @property {"verified"|"pending"|"failed"} status
 *
 * @typedef {Object} PaymentDetails
 * @property {string} id
 * @property {string} from
 * @property {string} reference
 * @property {number} amount
 * @property {string} currency
 * @property {string} [screenshotUri]
 *
 * @typedef {Object} Branch
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {number} staffCount
 */

export {};
