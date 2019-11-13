//
// Copyright (C) 2019 Protonex LLC dba PNI Sensor
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.
//

'use strict';

/* Imports */
const request = require('request');

/**
 * Module for making http requests to the API. */
class HttpClient {
    /**
     * @param {string} serverPath
     * @param {string} apiKey
     */
    constructor(serverPath, apiKey) {
        this.serverPath = serverPath;
        this.apiKey = apiKey;
    }

    /**
     * @param {string} route
     * @param {object} query
     * @param {boolean} noAuth
     */
    get(route, query = null, noAuth = false) {
        return this.makeRequest(route, 'GET', null, query, noAuth);
    }

    /**
     * @param {string} route
     * @param {object} body
     * @param {boolean} noAuth
     * @param {boolean} isUrlencoded
     */
    post(route, body = null, noAuth = false, isUrlencoded = false) {
        return this.makeRequest(route, 'POST', body, null, noAuth, isUrlencoded);
    }

    /**
     * @param {string} route
     * @param {object} body
     * @param {boolean} noAuth
     */
    put(route, body = null, noAuth = false) {
        return this.makeRequest(route, 'PUT', body, null, noAuth);
    }

    /**
     * @param {string} route
     * @param {object} body
     * @param {boolean} noAuth
     */
    delete(route, body = null, noAuth = false) {
        return this.makeRequest(route, 'DELETE', body, null, noAuth);
    }

    /**
     * @param {string} route
     * @param {string} method
     * @param {object} body
     * @param {object} query
     * @param {boolean} noAuth
     * @param {boolean} isUrlencoded
     */
    makeRequest(route, method, body = null, query = null, noAuth = false, isUrlencoded = false) {
        console.log(`${method}: '${route}'${(body) ? `, body: ${JSON.stringify(body)}` : ''}${(query) ? `, query: ${JSON.stringify(query)}` : ''}.`);

        return new Promise((resolve, reject) => {
            const headers = {
                accept: 'application/json',
                'content-type': (isUrlencoded)
                    ? 'application/x-www-form-urlencoded'
                    : 'application/json',
            };
            if (!noAuth) {
                headers.Authorization = `Bearer ${this.apiKey}`;
            }
            request({
                method,
                headers,
                json: body,
                qs: query,
                url: this.serverPath + route,
            }, (error, response, resBody) => {
                if (error) {
                    const errorMessage = JSON.stringify({
                        message: 'An error occured',
                        body: error,
                    }, null, 4);
                    console.error(errorMessage, '\n');

                    reject(new Error(errorMessage));
                    return;
                }

                if (response.statusCode !== 200 && response.statusCode !== 202) {
                    const errorMessage = JSON.stringify({
                        message: `Request replied with status code: ${response.statusCode}`,
                        body: resBody,
                    }, null, 4);
                    console.error(errorMessage, '\n');

                    reject(new Error(errorMessage));
                    return;
                }
                try {
                    const res = (typeof resBody === 'object') ? JSON.stringify(resBody, null, 4) : resBody;
                    console.log(res, '\n');

                    resolve(JSON.parse(res));
                } catch (ex) {
                    resolve({ result: resBody });
                }
            });
        });
    }
}

module.exports = HttpClient;
