'use strict'

/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */

const RequestManager = require('./lib/request-manager')

const URL_FILTERS = [
  'https://*/*',
  'http://*/*',
]

const requestManager = new RequestManager()

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      // debug
      console.log(`details.type`)
      if (details.type === 'main_frame') {
        console.log(details.url)
      }

      if (details.type === 'main_frame') {
        requestManager.newPageLoadStarted(details.url)
      }
      requestManager.requestStarted(details.requestId, details.url)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onCompleted.addListener(
    (details) => {
      requestManager.requestEnded(details.requestId, details.url)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onErrorOccurred.addListener(
    (details) => {
      requestManager.requestEnded(details.requestId, details.url)
    },
    {
      urls: URL_FILTERS,
    })

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  requestManager.domains()
      .then((domains) => {
        sendResponse({
          error: null,
          data: domains,
        })
      })
      .catch((exception) => {
        sendResponse({
          error: new Error('Failed to retrieve domains'),
          data: null,
        })
      })

  return true
})
