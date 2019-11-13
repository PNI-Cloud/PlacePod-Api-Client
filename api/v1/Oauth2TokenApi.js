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

const Oauth2Token = require('../../models/Oauth2Token');
/** @typedef {import('../../lib/HttpClient')} HttpClient */

class Oauth2TokenApi {
    /**
     * @param {HttpClient} httpClient
     * */
    constructor(httpClient) {
        this.baseRoute = '/api/v1/oauth2tokens';

        this.httpClient = httpClient;
    }

    /**
     * @param {{
     *  clientId: string;
     *  clientSecret: string;
     *  validityPeriod: number
     * }} body
     */
    async create(body) {
        const res = await this.httpClient.post(`${this.baseRoute}`, body, true, true);
        return new Oauth2Token(res);
    }

    /**
     * @param {string} token
     */
    async get(token) {
        const res = await this.httpClient.get(`${this.baseRoute}/${token}`, null, true);
        return new Oauth2Token(res);
    }

    /**
     * @param {string} token
     */
    async delete(token) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.delete(`${this.baseRoute}/${token}`, null, true);
        return res;
    }
}

module.exports = Oauth2TokenApi;
