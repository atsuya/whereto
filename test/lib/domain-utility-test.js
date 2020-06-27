'use strict'

const assert = require('assert')

const DomainUtility = require('../../lib/domain-utility')

describe('DomainUtility', () => {
  it('returns a registered domain', () => {
    assert.strictEqual(
        DomainUtility.registeredDomain('www.apple.com'),
        'apple.com')
  })
})
