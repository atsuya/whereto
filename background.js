/**
 * Licensed under MIT
 * (https://github.com/atsuya/whereto/blob/master/LICENSE)
 */
'use strict'

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
      urls: [
        'https://*/*',
        'http://*/*',
      ],
    })

chrome.webRequest.onCompleted.addListener(
    (details) => {
      requestManager.requestEnded(details.requestId, details.url)
      //console.log(`onCompleted - ${details.frameId} - ${details.parentFrameId}`)
    },
    {
      urls: [
        'https://*/*',
        'http://*/*',
      ],
    })

chrome.webRequest.onErrorOccurred.addListener(
    (details) => {
      requestManager.requestEnded(details.requestId)
      //console.log(`onErrorOccurred - ${details.frameId} - ${details.parentFrameId}`)
    },
    {
      urls: [
        'https://*/*',
        'http://*/*',
      ],
    })
