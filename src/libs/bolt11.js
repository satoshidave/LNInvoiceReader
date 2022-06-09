/* eslint-disable */
const crypto = require('crypto-js')
const bech32 = require('bech32')
const secp256k1 = require('secp256k1')
const Buffer = require('safe-buffer').Buffer
const BN = require('bn.js')
const bitcoinjsAddress = require('bitcoinjs-lib/src/address')
const coininfo = require('coininfo')

const BITCOINJS_NETWORK_INFO = {
  bitcoin: coininfo.bitcoin.main.toBitcoinJS(),
  testnet: coininfo.bitcoin.test.toBitcoinJS(),
  regtest: coininfo.bitcoin.regtest.toBitcoinJS(),
  simnet: coininfo.bitcoin.regtest.toBitcoinJS(),
  litecoin: coininfo.litecoin.main.toBitcoinJS(),
  litecoin_testnet: coininfo.litecoin.test.toBitcoinJS()
}
BITCOINJS_NETWORK_INFO.bitcoin.bech32 = 'bc'
BITCOINJS_NETWORK_INFO.testnet.bech32 = 'tb'
BITCOINJS_NETWORK_INFO.regtest.bech32 = 'bcrt'
BITCOINJS_NETWORK_INFO.simnet.bech32 = 'sb'
BITCOINJS_NETWORK_INFO.litecoin.bech32 = 'ltc'
BITCOINJS_NETWORK_INFO.litecoin_testnet.bech32 = 'tltc'

const BECH32CODES = {
  bc: 'bitcoin',
  tb: 'testnet',
  bcrt: 'regtest',
  sb: 'simnet',
  ltc: 'litecoin',
  tltc: 'litecoin_testnet'
}

const DIVISORS = {
  m: new BN(1e3, 10),
  u: new BN(1e6, 10),
  n: new BN(1e9, 10),
  p: new BN(1e12, 10)
}

const MAX_MILLISATS = new BN('2100000000000000000', 10)

const MILLISATS_PER_BTC = new BN(1e11, 10)

const TAGCODES = {
  payment_hash: 1,
  description: 13,
  payee_node_key: 19,
  purpose_commit_hash: 23, // commit to longer descriptions (like a website)
  expire_time: 6, // default: 3600 (1 hour)
  min_final_cltv_expiry: 24, // default: 9
  fallback_address: 9,
  routing_info: 3 // for extra routing info (private etc.)
}

// reverse the keys and values of TAGCODES and insert into TAGNAMES
const TAGNAMES = {}
for (let i = 0, keys = Object.keys(TAGCODES); i < keys.length; i++) {
  let currentName = keys[i]
  let currentCode = TAGCODES[keys[i]].toString()
  TAGNAMES[currentCode] = currentName
}

const TAGPARSERS = {
  '1': (words) => wordsToBuffer(words, true).toString('hex'), // 256 bits
  '13': (words) => wordsToBuffer(words, true).toString('utf8'), // string variable length
  '19': (words) => wordsToBuffer(words, true).toString('hex'), // 264 bits
  '23': (words) => wordsToBuffer(words, true).toString('hex'), // 256 bits
  '6': wordsToIntBE, // default: 3600 (1 hour)
  '24': wordsToIntBE, // default: 9
  '9': fallbackAddressParser,
  '3': routingInfoParser // for extra routing info (private etc.)
}

const unknownTagName = 'unknownTag'

function getUnknownParser (tagCode) {
  return (words) => ({
    tagCode: parseInt(tagCode),
    words: bech32.encode('unknown', words, Number.MAX_SAFE_INTEGER)
  })
}

function wordsToIntBE (words) {
  return words.reverse().reduce((total, item, index) => {
    return total + item * Math.pow(32, index)
  }, 0)
}

function sha256 (data) {
  return crypto.createHash('sha256').update(data).digest()
}

function convert (data, inBits, outBits) {
  let value = 0
  let bits = 0
  let maxV = (1 << outBits) - 1

  let result = []
  for (let i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (bits > 0) {
    result.push((value << (outBits - bits)) & maxV)
  }

  return result
}

function wordsToBuffer (words, trim) {
  let buffer = Buffer.from(convert(words, 5, 8, true))
  if (trim && words.length * 5 % 8 !== 0) {
    buffer = buffer.slice(0, -1)
  }
  return buffer
}

// see encoder for details
function fallbackAddressParser (words, network) {
  let version = words[0]
  words = words.slice(1)

  let addressHash = wordsToBuffer(words, true)

  let address = null

  switch (version) {
    case 17:
      address = bitcoinjsAddress.toBase58Check(addressHash, network.pubKeyHash)
      break
    case 18:
      address = bitcoinjsAddress.toBase58Check(addressHash, network.scriptHash)
      break
    case 0:
      address = bitcoinjsAddress.toBech32(addressHash, version, network.bech32)
      break
  }

  return {
    code: version,
    address,
    addressHash: addressHash.toString('hex')
  }
}

// first convert from words to buffer, trimming padding where necessary
// parse in 51 byte chunks. See encoder for details.
function routingInfoParser (words) {
  let routes = []
  let pubkey, shortChannelId, feeBaseMSats, feeProportionalMillionths, cltvExpiryDelta
  let routesBuffer = wordsToBuffer(words, true)
  while (routesBuffer.length > 0) {
    pubkey = routesBuffer.slice(0, 33).toString('hex') // 33 bytes
    shortChannelId = routesBuffer.slice(33, 41).toString('hex') // 8 bytes
    feeBaseMSats = parseInt(routesBuffer.slice(41, 45).toString('hex'), 16) // 4 bytes
    feeProportionalMillionths = parseInt(routesBuffer.slice(45, 49).toString('hex'), 16) // 4 bytes
    cltvExpiryDelta = parseInt(routesBuffer.slice(49, 51).toString('hex'), 16) // 2 bytes

    routesBuffer = routesBuffer.slice(51)

    routes.push({
      pubkey,
      short_channel_id: shortChannelId,
      fee_base_msat: feeBaseMSats,
      fee_proportional_millionths: feeProportionalMillionths,
      cltv_expiry_delta: cltvExpiryDelta
    })
  }
  return routes
}

function tagsItems (tags, tagName) {
  let tag = tags.filter(item => item.tagName === tagName)
  let data = tag.length > 0 ? tag[0].data : null
  return data
}

function tagsContainItem (tags, tagName) {
  return tagsItems(tags, tagName) !== null
}

function orderKeys (unorderedObj) {
  let orderedObj = {}
  Object.keys(unorderedObj).sort().forEach((key) => {
    orderedObj[key] = unorderedObj[key]
  })
  return orderedObj
}

function hrpToSat (hrpString, outputString) {
  let millisatoshisBN = hrpToMillisat(hrpString, false)
  if (!millisatoshisBN.mod(new BN(1000, 10)).eq(new BN(0, 10))) {
    throw new Error('Amount is outside of valid range')
  }
  let result = millisatoshisBN.div(new BN(1000, 10))
  return outputString ? result.toString() : result
}

function hrpToMillisat (hrpString, outputString) {
  let divisor, value
  if (hrpString.slice(-1).match(/^[munp]$/)) {
    divisor = hrpString.slice(-1)
    value = hrpString.slice(0, -1)
  } else if (hrpString.slice(-1).match(/^[^munp0-9]$/)) {
    throw new Error('Not a valid multiplier for the amount')
  } else {
    value = hrpString
  }

  if (!value.match(/^\d+$/)) throw new Error('Not a valid human readable amount')

  let valueBN = new BN(value, 10)

  let millisatoshisBN = divisor
    ? valueBN.mul(MILLISATS_PER_BTC).div(DIVISORS[divisor])
    : valueBN.mul(MILLISATS_PER_BTC)

  if (((divisor === 'p' && !valueBN.mod(new BN(10, 10)).eq(new BN(0, 10))) ||
      millisatoshisBN.gt(MAX_MILLISATS))) {
    throw new Error('Amount is outside of valid range')
  }

  return outputString ? millisatoshisBN.toString() : millisatoshisBN
}

// decode will only have extra comments that aren't covered in encode comments.
// also if anything is hard to read I'll comment.
function decode (paymentRequest, network) {
  if (typeof paymentRequest !== 'string') throw new Error('Lightning Payment Request must be string')
  if (paymentRequest.slice(0, 2).toLowerCase() !== 'ln') throw new Error('Not a proper lightning payment request')
  let decoded = bech32.decode(paymentRequest, Number.MAX_SAFE_INTEGER)
  paymentRequest = paymentRequest.toLowerCase()
  let prefix = decoded.prefix
  let words = decoded.words

  // signature is always 104 words on the end
  // cutting off at the beginning helps since there's no way to tell
  // ahead of time how many tags there are.
  let sigWords = words.slice(-104)
  // grabbing a copy of the words for later, words will be sliced as we parse.
  let wordsNoSig = words.slice(0, -104)
  words = words.slice(0, -104)

  let sigBuffer = wordsToBuffer(sigWords, true)
  let recoveryFlag = sigBuffer.slice(-1)[0]
  sigBuffer = sigBuffer.slice(0, -1)

  if (!(recoveryFlag in [0, 1, 2, 3]) || sigBuffer.length !== 64) {
    throw new Error('Signature is missing or incorrect')
  }

  // Without reverse lookups, can't say that the multipier at the end must
  // have a number before it, so instead we parse, and if the second group
  // doesn't have anything, there's a good chance the last letter of the
  // coin type got captured by the third group, so just re-regex without
  // the number.
  let prefixMatches = prefix.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/)
  if (prefixMatches && !prefixMatches[2]) prefixMatches = prefix.match(/^ln(\S+)$/)
  if (!prefixMatches) {
    throw new Error('Not a proper lightning payment request')
  }

  let bech32Prefix = prefixMatches[1]
  let coinNetwork, coinType
  if (BECH32CODES[bech32Prefix]) {
    coinType = BECH32CODES[bech32Prefix]
    coinNetwork = BITCOINJS_NETWORK_INFO[coinType]
  } else if (network && network.bech32) {
    coinType = 'unknown'
    coinNetwork = network
  }
  if (!coinNetwork || coinNetwork.bech32 !== bech32Prefix) {
    throw new Error('Unknown coin bech32 prefix')
  }

  let value = prefixMatches[2]
  let satoshis, millisatoshis, removeSatoshis
  if (value) {
    let divisor = prefixMatches[3]
    try {
      satoshis = parseInt(hrpToSat(value + divisor, true))
    } catch (e) {
      satoshis = null
      removeSatoshis = true
    }
    millisatoshis = hrpToMillisat(value + divisor, true)
  } else {
    satoshis = null
    millisatoshis = null
  }

  // reminder: left padded 0 bits
  let timestamp = wordsToIntBE(words.slice(0, 7))
  let timestampString = new Date(timestamp * 1000).toISOString()
  words = words.slice(7) // trim off the left 7 words

  let tags = []
  let tagName, parser, tagLength, tagWords
  // we have no tag count to go on, so just keep hacking off words
  // until we have none.
  while (words.length > 0) {
    let tagCode = words[0].toString()
    tagName = TAGNAMES[tagCode] || unknownTagName
    parser = TAGPARSERS[tagCode] || getUnknownParser(tagCode)
    words = words.slice(1)

    tagLength = wordsToIntBE(words.slice(0, 2))
    words = words.slice(2)

    tagWords = words.slice(0, tagLength)
    words = words.slice(tagLength)

    // See: parsers for more comments
    tags.push({
      tagName,
      data: parser(tagWords, coinNetwork) // only fallback address needs coinNetwork
    })
  }

  let timeExpireDate, timeExpireDateString
  // be kind and provide an absolute expiration date.
  // good for logs
  if (tagsContainItem(tags, TAGNAMES['6'])) {
    timeExpireDate = timestamp + tagsItems(tags, TAGNAMES['6'])
    timeExpireDateString = new Date(timeExpireDate * 1000).toISOString()
  }

  let toSign = Buffer.concat([Buffer.from(prefix, 'utf8'), Buffer.from(convert(wordsNoSig, 5, 8))])
  let payReqHash = sha256(toSign)
  let sigPubkey = secp256k1.recover(payReqHash, sigBuffer, recoveryFlag, true)
  if (tagsContainItem(tags, TAGNAMES['19']) && tagsItems(tags, TAGNAMES['19']) !== sigPubkey.toString('hex')) {
    throw new Error('Lightning Payment Request signature pubkey does not match payee pubkey')
  }

  let finalResult = {
    paymentRequest,
    complete: true,
    prefix,
    wordsTemp: bech32.encode('temp', wordsNoSig.concat(sigWords), Number.MAX_SAFE_INTEGER),
    coinType,
    satoshis,
    millisatoshis,
    timestamp,
    timestampString,
    payeeNodeKey: sigPubkey.toString('hex'),
    signature: sigBuffer.toString('hex'),
    recoveryFlag,
    tags
  }

  if (removeSatoshis) {
    delete finalResult['satoshis']
  }

  if (timeExpireDate) {
    finalResult = Object.assign(finalResult, {timeExpireDate, timeExpireDateString})
  }

  return orderKeys(finalResult)
}

module.exports = {
  decode,
  hrpToSat,
  hrpToMillisat
}
