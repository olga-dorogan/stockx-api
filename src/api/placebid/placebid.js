const request = require('request-promise');
const moment = require('moment');

module.exports = async (bearer, options) => {
    const { amount, variantID, currency, proxy, cookieJar } = options;
    const expiresAt = moment().add(30, 'days').utc().format();

    const res = await request({
        uri: 'https://stockx.com/api/portfolio?a=bid',
        method: 'POST',
        headers: {
            'Host': 'stockx.com',
            'sec-fetch-mode': 'cors',
            'origin': 'https://stockx.com',
            'authorization': `Bearer ${bearer}`,
            'content-type': 'application/json',
            'appos': 'web',
            'x-requested-with': 'XMLHttpRequest',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
            'appversion': '0.1',
            'accept': '*/*',
            'sec-fetch-site': 'same-origin',
            'accept-language': 'en-US,en;q=0.9',
        },
        json: {
            PortfolioItem: {
                localAmount: amount,
                skuUuid: variantID,
                localCurrency: currency,
                expiresAt: expiresAt
            }
        },
        jar: cookieJar,
        simple: false,
        resolveWithFullResponse: true,
        proxy
    });

    if (res.statusCode != 200) throw new Error(`Status code error: ${res.statusCode} - Response: ${res.body}`);
    
    return {
        id: res.body.PortfolioItem.chainId,
        response: res.body
    };
};