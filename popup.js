/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */
(() => {
  // quite a hack, but oh well
  'use strict'

  /**
   */
  async function initializePage() {
    try {
      const domains = await retrieveDomains()
      await showDomains(domains)

      // debug
      const element = document.getElementById('text-area')
      element.value = JSON.stringify(domains)
      console.log(domains)
    } catch (exception) {
      console.log(`Error initializing page: ${exception.message}`)
    }
  }

  /**
   */
  function retrieveDomains() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({}, (response) => {
        if (response.error) {
          reject(response.error)
          return
        }

        resolve(response.data)
        return
      })
    })
  }

  /**
   * Shows a list of domains.
   * @param {!Array<!Object>} domains A list of domains with following
   *     attributes in each element:
   *     - domain: Domain name.
   *     - requestCounts: Number of requests sent to the domain.
   */
  async function showDomains(domains) {
    const sortedDomains = domains.sort((domain, anotherDomain) => {
      // decending order
      return anotherDomain.requestCount - domain.requestCount
    })

    const list = document.getElementById('domain-list')
    for (let index = 0; index < sortedDomains.length; index++) {
      const domain = sortedDomains[index]

      const listItem = document.createElement('li')
      listItem.innerHTML = `${domain.domain}: ${domain.requestCount}`
      list.appendChild(listItem)
    }
  }

  // main
  window.addEventListener('DOMContentLoaded', () => {
    initializePage()
  })
})()
