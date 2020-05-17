/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */
(() => {
  // quite a hack, but oh well
  'use strict'

  const DEBUG = true

  /**
   */
  async function initializePage() {
    try {
      const domains = await retrieveDomains()
      await showDomains(domains)

      // debug
      if (DEBUG) {
        const element = document.getElementById('text-area')
        element.value = JSON.stringify(domains)
        console.log(domains)
      }
    } catch (exception) {
      console.log(`Error initializing page: ${exception.message}`)
    }
  }

  /**
   * Retrieves domains.
   * @return {!Array<!Object>} The object returned from RequestManager.domains.
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
   * @param {!Array<!Object>} domains The object returned from
   *     RequestManager.domains.
   */
  async function showDomains(domains) {
    // current page url
    const currentPage = document.getElementById('current-page-url')
    currentPage.innerHTML = domains.currentPage

    // sort domains by decending order
    const sortedDomains = domains.domains.sort((domain, anotherDomain) => {
      return anotherDomain.requestCount - domain.requestCount
    })

    const listElement = document.getElementById('domain-list')
    for (let index = 0; index < sortedDomains.length; index++) {
      const domain = sortedDomains[index]

      const fqdn = domain.domain
      const domainSuffix = tldjs.getPublicSuffix(fqdn)
      const suffixIndex = fqdn.indexOf(domainSuffix)
      const subdomain = fqdn.substring(0, (suffixIndex - 1))

      //// TODO: needs to account for tld with > 2 dots (i.e. google.co.jp)
      //// [0]: subdomains
      //// [1]: tld
      //const domainEntities = domain.domain.split('.')
      //const domainComponents = domainEntities.reduce(
      //    (components, entity, index) => {
      //      let componentsIndex = 0
      //      if (index >= (domainEntities.length - 2)) {
      //        componentsIndex = 1
      //      }
      //      components[componentsIndex].push(entity)
      //      return components
      //    },
      //    [[], []])

      const subdomainElement = document.createElement('span')
      subdomainElement.className = 'subdomain'
      subdomainElement.innerHTML = subdomain

      const tldElement = document.createElement('span')
      tldElement.className = 'tld'
      tldElement.innerHTML = `.${domainSuffix}`

      const requestCountOpeningElement = document.createElement('span')
      requestCountOpeningElement.innerHTML = ' ['

      const requestCountElement = document.createElement('span')
      requestCountElement.className = 'request-count'
      requestCountElement.innerHTML = domain.requestCount

      const requestCountClosingElement = document.createElement('span')
      requestCountClosingElement.innerHTML = ']'

      const listItemElement = document.createElement('li')
      listItemElement.append(
          subdomainElement,
          tldElement,
          requestCountOpeningElement,
          requestCountElement,
          requestCountClosingElement)
      listElement.appendChild(listItemElement)
    }
  }

  // main
  window.addEventListener('DOMContentLoaded', () => {
    initializePage()
  })
})()
