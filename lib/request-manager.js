'use strict'

/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */

/**
 * RequestManager manages requests per page.
 */
class RequestManager {
  /**
   * Constructor.
   */
  constructor() {
    // `pages` is managed per tab ID. Note that tab ID can be -1 when a
    // request is not related to a tab.
    this.pages = new Map()
  }

  /**
   * Indicates a new page load.
   * @param {number} tabId Tab ID.
   * @param {string} url URL of the new page.
   */
  async newPageLoadStarted(tabId, url) {
    if (!this.pages.has(tabId)) {
      this.pages.set(tabId, new Page())
    }

    try {
      const page = this.pages.get(tabId)
      await page.clear()
      page.setCurrentPage(url)
    } catch (exception) {
      console.log(`Error clearning page: ${exception.message}`)
    }
  }

  /**
   * Indicates a request has been started.
   * @param {number} tabId Tab ID.
   * @param {string} requestId Request ID.
   * @param {string} url Request URL.
   */
  async requestStarted(tabId, requestId, url) {
    try {
      const page = this.pages.get(tabId)
      await page.requestStarted(requestId, url)
    } catch (exception) {
      console.log(`Error calling requestStarted: ${exception.message}`)
    }
  }

  /**
   * Indicates a request has been completed
   * @param {number} tabId Tab ID.
   * @param {string} requestId Request ID.
   * @param {string} url Request URL.
   */
  async requestEnded(tabId, requestId, url) {
    try {
      const page = this.pages.get(tabId)
      await page.requestEnded(requestId, url)
    } catch (exception) {
      console.log(`Error calling requestEnded: ${exception.message}`)
    }
  }

  /**
   * Retrieves a list of domains communicated from the current page.
   * @param {number} tabId Tab ID.
   * @return {!Map<string, Object>} A Map object with following keys:
   *     - currentPage: URL of the current page.
   *     - domains: Array of object with the following keys:
   *         - domain: Domain of a request sent from the current page.
   *         - requestCount: A number of requests the page requested to the
   *             domain.
   */
  async domains(tabId) {
    const page = this.pages.get(tabId)
    if (!page) {
      throw new Error(`Tab not found: ${tabId}`)
    }

    try {
      return await page.domains()
    } catch (exception) {
      console.log(`Error retrieving domains: ${exception.message}`)
    }
  }
}

module.exports = RequestManager
