/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */
'use strict'

/**
 * RequestManager manages requests.
 */
class RequestManager {
  /**
   * Constructor.
   */
  constructor() {
    this.requests = new Map()
    this.openRequests = new Set()
  }

  /**
   * Indicates a new page load.
   */
  newPageLoadStarted() {
    this.requests.clear()
    this.openRequests.clear()

    console.log('\n\n\n\n\n\n')
  }

  /**
   * Indicates a request has been started.
   * @param {string} id Request ID.
   * @param {string} url Request URL.
   */
  requestStarted(id, url) {
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
  requestEnded(id, url) {
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
}
