import { trim, toLower, split, size, slice, startsWith, get, toString, includes } from 'lodash';
import bech32 from 'bech32';
import { Buffer } from 'buffer';
import { BOLT11_SCHEME, LIGHTNING_SCHEME, LNURL_SCHEME } from '../variables/labels';
import { validateInternetIdentifier } from './misc';
import Bolt11JS from '../libs/bolt11';

const handleLightningAddress = (internetIdentifier) => {
    const addressArray = split(internetIdentifier, '@');

    if (size(addressArray) !== 2) {
        return {
            success: false,
            message: 'Invalid internet identifier format.'
        }
    }
    const [username, domain] = addressArray;

    if (addressArray[1].indexOf('.') === -1) {
        return {
            success: false,
            message: 'Invalid internet identifier format.',
        };
    }

    const url = `https://${domain}/.well-known/lnurlp/${username}`;

    return fetch('https://satcors.fiatjaf.com/?url=' + encodeURIComponent(url))
        .then(response => response.json())
        .then(data => {
            data.domain = domain;

            return {
                success: true,
                data: {
                    ...data,
                    domain,
                    username,
                },
            }
        }).catch(_ => {
            return {
                success: false,
                message: 'This identifier does not support Lightning Address yet.',
            };
        });
}

const handleLNURL = (invoice) => {
    const decodedLNURL = bech32.decode(invoice, 1500);
    const url = toString(Buffer.from(bech32.fromWords(get(decodedLNURL, 'words'))));
    return fetch('https://satcors.fiatjaf.com/?url=' + encodeURIComponent(url))
        .then(response => response.json())
}

const handleBolt11 = (invoice) => {
    if (!includes(invoice, BOLT11_SCHEME)) {
        return null;
    }

    const result = Bolt11JS.decode(invoice);
    return result;
}

const parseInvoice = async (invoice) => {
    if (!invoice || invoice === '') return null;

    const lowercaseInvoice = trim(toLower(invoice));
    let requestCode = lowercaseInvoice;

    if (validateInternetIdentifier(requestCode)) {
        const { success, data, message } = await handleLightningAddress(requestCode);

        if (!success) {
            return {
                data: null,
                error: message,
                isLNURL: false,
                isLNAddress: true
            }
        }

        return {
            data,
            isLNURL: true,
            isLNAddress: true
        }
    }

    const hasLightningPrefix = lowercaseInvoice.indexOf(`${LIGHTNING_SCHEME}:`) !== -1;
    if (hasLightningPrefix) {
        requestCode = slice(lowercaseInvoice, 10, size(lowercaseInvoice));
    }

    const hasLNURLPrefix = lowercaseInvoice.indexOf(`${LNURL_SCHEME}:`) !== -1;
    if (hasLNURLPrefix) {
        requestCode = slice(lowercaseInvoice, 6, size(lowercaseInvoice));
    }

    const isLNURL = startsWith(requestCode, LNURL_SCHEME);
    if (isLNURL) {
        return {
            isLNURL: true,
            data: handleLNURL(requestCode)
        }
    } else {
        return {
            isLNURL: false,
            data: handleBolt11(requestCode)
        }
    }
};

export {
    parseInvoice
};
