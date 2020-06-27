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
      console.log(`${details.type}[${details.tabId}]: ${details.url}`)

      if (details.type === 'main_frame') {
        requestManager.newPageLoadStarted(details.tabId, details.url)
      }
      requestManager.requestStarted(
          details.tabId,
          details.requestId,
          details.url)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onCompleted.addListener(
    (details) => {
      requestManager.requestEnded(details.tabId, details.requestId, details.url)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onErrorOccurred.addListener(
    (details) => {
      requestManager.requestEnded(details.tabId, details.requestId, details.url)
    },
    {
      urls: URL_FILTERS,
    })

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(request)
  requestManager.domains(request.tabId)
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
