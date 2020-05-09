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
      // since `newPageLoadStarted` is async method, it's better to wait
      // its completion before calling `requestStarted`.
      // i'm ignoring it at the moment as it's not significant to a regular
      // use.
      if (details.type === 'main_frame') {
        requestManager.newPageLoadStarted(details.tabId, details.url)
      }
      requestManager.requestStarted(
          details.tabId,
          details.requestId,
          details.url)

      console.log(
          `onBeforeRequest[${details.type}] - tabId=${details.tabId}, ` +
          `frameId=${details.frameId}, ` +
          `parentFrameId=${details.parentFrameId}`)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onCompleted.addListener(
    (details) => {
      requestManager.requestEnded(
          details.tabId,
          details.requestId,
          details.url)

      console.log(
          `onCompleted[${details.type}] - tabId=${details.tabId}, ` +
          `frameId=${details.frameId}, ` +
          `parentFrameId=${details.parentFrameId}`)
    },
    {
      urls: URL_FILTERS,
    })

chrome.webRequest.onErrorOccurred.addListener(
    (details) => {
      requestManager.requestEnded(
          details.tabId,
          details.requestId,
          details.url)

      console.log(
          `onErrorOccurred[${details.type}] - tabId=${details.tabId}, ` +
          `frameId=${details.frameId}, ` +
          `parentFrameId=${details.parentFrameId}`)
    },
    {
      urls: URL_FILTERS,
    })

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(`request: ${JSON.stringify(request)}`)

  requestManager.domains(request.tabId)
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
