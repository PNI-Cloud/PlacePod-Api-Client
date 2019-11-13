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

const SensorLog = require('../../models/SensorLog');
/** @typedef {import('../../lib/HttpClient')} HttpClient */

class SensorLogApi {
    /**
     * @param {HttpClient} httpClient
     * */
    constructor(httpClient) {
        this.baseRoute = '/api/v1/sensorlogs';

        this.httpClient = httpClient;
    }

    /**
     * @param {string} id
     * @param {{
     *  startTime: string|Date,
     *  endTime: string|Date,
     *  limit: number,
     * }} query
     */
    async getAll(query = null) {
        /** @type {object[]} */
        const res = await this.httpClient.get(`${this.baseRoute}`, query);
        return res.map((sensorLog) => new SensorLog(sensorLog));
    }
}

module.exports = SensorLogApi;
