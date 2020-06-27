'use strict'

/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */

const { isValid, getDomain } = require('tldjs')

/**
 * DomainUtility class provides utility functions around domains.
 */
class DomainUtility {
  /**
   * Returns a registered domain.
   * @param {string} domain Domain name.
   * @return {string} A registered domain segment from the domain name passed.
   */
  static registeredDomain(domain) {
    if (!isValid(domain)) {
      throw new Error(`Not a valid domain: ${domain}`)
    }

    return getDomain(domain)
  }
}

module.exports = DomainUtility
