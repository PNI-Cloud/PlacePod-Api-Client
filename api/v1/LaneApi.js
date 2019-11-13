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

const Lane = require('../../models/Lane');
const Sensor = require('../../models/Sensor');
const SensorLog = require('../../models/SensorLog');
/** @typedef {import('../../lib/HttpClient')} HttpClient */

class LaneApi {
    /**
     * @param {HttpClient} httpClient
     * */
    constructor(httpClient) {
        this.baseRoute = '/api/v1/lanes';

        this.httpClient = httpClient;
    }

    async getAll() {
        /** @type {object[]} */
        const res = await this.httpClient.get(`${this.baseRoute}`);
        return res.map((lane) => new Lane(lane));
    }

    /**
     * @param {{
     *  name: string,
     *  frontId: string,
     *  backId: string,
     *  parkingLotId: string,
     *  direction: boolean,
     *  count: number,
     * }} body
     */
    async create(body) {
        /** @type {{ id: string }} */
        const res = await this.httpClient.post(`${this.baseRoute}`, body);
        return res;
    }

    /**
     * @param {string} id
     */
    async get(id) {
        const res = await this.httpClient.get(`${this.baseRoute}/${id}`);
        return new Lane(res);
    }

    /**
     * @param {string} id
     * @param {{
     *  name: string,
     *  frontId: string,
     *  backId: string,
     *  parkingLotId: string,
     *  direction: boolean,
     *  count: number,
     * }} body
     */
    async update(id, body) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.put(`${this.baseRoute}/${id}`, body);
        return res;
    }

    /**
     * @param {string} id
     */
    async delete(id) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.delete(`${this.baseRoute}/${id}`);
        return res;
    }

    /**
     * @param {string} id
     * @param {{ state: string, type: string }} query
     */
    async getSensors(id, query = null) {
        /** @type {object[]} */
        const res = await this.httpClient.get(`${this.baseRoute}/${id}/sensors`, query);
        return res.map((sensor) => new Sensor(sensor));
    }

    /**
     * @param {string} id
     * @param {{
     *  startTime: string|Date,
     *  endTime: string|Date,
     *  limit: number,
     * }} query
     */
    async getSensorLogs(id, query = null) {
        /** @type {object[]} */
        const res = await this.httpClient.get(`${this.baseRoute}/${id}/sensorlogs`, query);
        return res.map((sensorLog) => new SensorLog(sensorLog));
    }
}

module.exports = LaneApi;
