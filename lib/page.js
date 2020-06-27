'use strict'

/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */

/**
 * Page represents a page.
 */
class Page {
  /**
   * Constructor.
   */
  constructor() {
    this.currentPageUrl = null
    this.requests = new Map()
    this.openRequests = new Set()
  }

  /**
   * Sets current page.
   * @param {string} url Current page URL.
   */
  setCurrentPage(url) {
    this.currentPageUrl = url
  }

  /**
   * Clears the page info.
   */
  async clear() {
    this.openRequests.clear()

    this.requests.clear()
    this.currentPageUrl = null
  }

  /**
   * Indicates a request has been started.
   * @param {string} requestId Request ID.
   * @param {string} url Request URL.
   */
  async requestStarted(requestId, url) {
    try {
      const parsedUrl = new URL(url)
      const domain = parsedUrl.hostname

      if (!this.requests.has(domain)) {
        this.requests.set(domain, [])
      }
      this.requests.get(domain).push(true)
    } catch (exception) {
      console.log(
          `Failed to record a started request[${requestId}=${url}]: ` +
          `${exception.message}`)
    }

    this.openRequests.add(requestId)
  }

  /**
   * Indicates a request has been completed
   * @param {string} reqeustId Request ID.
   * @param {string} url Request URL.
   */
  async requestEnded(requestId, url) {
    if (this.openRequests.has(requestId)) {
      this.openRequests.delete(requestId)
      //console.log(`request completed[${this.requests.size}]: ${id}`)
    }

    //if (this.openRequests.size <= 0) {
    //  console.log('==============================================')
    //  this.requests.forEach((value, key) => {
    //    console.log(`${key}: ${value.length}`)
    //  })
    //}
  }

  /**
   * Retrieves a list of domains communicated from the current page.
   * @return {!Map<string, Object>} A Map object with following keys:
   *     - currentPage: URL of the current page.
   *     - domains: Array of object with the following keys:
   *         - domain: Domain of a request sent from the current page.
   *         - requestCount: A number of requests the page requested to the
   *             domain.
   */
  async domains() {
    const result = {
      currentPage: this.currentPageUrl,
    }

    const domains = []
    this.requests.forEach((value, domain) => {
      const entry = {
        domain: domain,
        requestCount: value.length,
      }
      domains.push(entry)
    })
    result.domains = domains

    return result
  }
}

module.exports = Page
