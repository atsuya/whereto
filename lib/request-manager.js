'use strict'

/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */

/**
 * RequestManager manages requests.
 */
class RequestManager {
  /**
   * Constructor.
   */
  constructor() {
    this.currentPageUrl = null
    this.requests = new Map()
    this.openRequests = new Set()
  }

  /**
   * Indicates a new page load.
   * @param {string} url URL of the new page.
   */
  async newPageLoadStarted(url) {
    this.openRequests.clear()

    this.requests.clear()
    this.currentPageUrl = url

    console.log('\n\n\n\n\n\n')
  }

  /**
   * Indicates a request has been started.
   * @param {string} id Request ID.
   * @param {string} url Request URL.
   */
  async requestStarted(id, url) {
    try {
      const parsedUrl = new URL(url)
      const domain = parsedUrl.hostname

      if (!this.requests.has(domain)) {
        this.requests.set(domain, [])
      }
      this.requests.get(domain).push(true)
    } catch (exception) {
      console.log(
          `Failed to record a started request[${id}=${url}]: ` +
          `${exception.message}`)
    }

    this.openRequests.add(id)
  }

  /**
   * Indicates a request has been completed
   * @param {string} id Request ID.
   * @param {string} url Request URL.
   */
  async requestEnded(id, url) {
    if (this.openRequests.has(id)) {
      this.openRequests.delete(id)
      //console.log(`request completed[${this.requests.size}]: ${id}`)
    }

    if (this.openRequests.size <= 0) {
      console.log('==============================================')
      this.requests.forEach((value, key) => {
        console.log(`${key}: ${value.length}`)
      })
    }
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

module.exports = RequestManager
