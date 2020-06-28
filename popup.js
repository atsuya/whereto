'use strict'

/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */

const DomainUtility = require('./lib/domain-utility')

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
    chrome.tabs.query(
        {
          active: true,
          lastFocusedWindow: true,
        },
        (tabs) => {
          const currentTab = tabs[0]
          chrome.runtime.sendMessage({ tabId: currentTab.id }, (response) => {
            if (response.error) {
              reject(response.error)
              return
            }

            resolve(response.data)
            return
          })
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

  const tableBody = document.getElementById('domain-table-body')
  for (let index = 0; index < sortedDomains.length; index++) {
    const domain = sortedDomains[index]

    const fqdn = domain.domain
    let registeredDomain = fqdn
    let subdomain = ''

    try {
      registeredDomain = DomainUtility.registeredDomain(fqdn)
      const registeredDomainLength = registeredDomain.split('.').length

      const domainSegments = fqdn.split('.')
      const subdomains = domainSegments.slice(
          0, (domainSegments.length - registeredDomainLength))
      subdomain = subdomains.join('.')
    } catch (exception) {
      console.log(`Error identifying registered domain: ${exception.message}`)
    }

    // domain
    const subdomainElement = document.createElement('span')
    subdomainElement.className = 'subdomain'
    subdomainElement.innerHTML = subdomain

    const tldElement = document.createElement('span')
    tldElement.className = 'tld'
    tldElement.innerHTML = `${subdomain === '' ? '' : '.'}${registeredDomain}`

    const domainColumn = document.createElement('td')
    domainColumn.className = 'domain-column-domain'
    domainColumn.append(subdomainElement, tldElement)

    // requests
    const requestCountElement = document.createElement('span')
    requestCountElement.className = 'request-count'
    requestCountElement.innerHTML = domain.requestCount

    const requestsColumn = document.createElement('td')
    requestsColumn.className = 'domain-column-requests'
    requestsColumn.append(requestCountElement)

    // add a new row
    const newRow = document.createElement('tr')
    newRow.append(domainColumn, requestsColumn)
    tableBody.append(newRow)
  }
}

// main
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializePage()
  } catch (exception) {
    console.log(`Error initializing the plugin: ${exception.message}`)
  }
})
