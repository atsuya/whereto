/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */
(() => {
  // quite a hack, but oh well
  'use strict'

  /**
   * DomainUtility provides utility functionality around domains.
   */
  class DomainUtility {
    /**
     * Returns a registered domain.
     * @param {string} domain Domain name.
     * @return {string} A registered domain segment from the domain name passed.
     */
    static registeredDomain(domain) {
      if (!tldjs.isValid(domain)) {
        throw new Error(`Not a valid domain: ${domain}`)
      }

      return tldjs.getDomain(domain)
    }
  }

  window.DomainUtility = DomainUtility
})()
