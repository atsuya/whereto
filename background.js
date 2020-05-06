'use strict'

/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */

const URL_FILTERS = [
  'https://*/*',
  'http://*/*',
]

const requestManager = new RequestManager()

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.type === 'main_frame') {
        requestManager.newPageLoadStarted()
      }
      requestManager.requestStarted(details.requestId, details.url)

      //console.log(`onBeforeRequest[${details.type}] - ${details.frameId} - ${details.parentFrameId}`)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onCompleted.addListener(
    (details) => {
      requestManager.requestEnded(details.requestId, details.url)
      //console.log(`onCompleted - ${details.frameId} - ${details.parentFrameId}`)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onErrorOccurred.addListener(
    (details) => {
      requestManager.requestEnded(details.requestId, details.url)
      //console.log(`onErrorOccurred - ${details.frameId} - ${details.parentFrameId}`)
    },
    {
      urls: URL_FILTERS,
    })

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(`request: ${JSON.stringify(request)}`)

  requestManager.domains()
      .then((domains) => {
        sendResponse({
          error: null,
          data: domains,
        })
      })
      .catch((exception) => {
        console.log(`Failed to retrieve domains: ${exception.message}`)

        sendResponse({
          error: new Error('Failed to retrieve domains'),
          data: null,
        })
      })

  return true
})
