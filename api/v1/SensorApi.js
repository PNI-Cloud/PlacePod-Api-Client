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

const Sensor = require('../../models/Sensor');
const SensorLog = require('../../models/SensorLog');
/** @typedef {import('../../lib/HttpClient')} HttpClient */

class SensorApi {
    /**
     * @param {HttpClient} httpClient
     * */
    constructor(httpClient) {
        this.baseRoute = '/api/v1/sensors';

        this.httpClient = httpClient;
    }

    /**
     * @param {{ state: string, type: string }} query
     */
    async getAll(query = null) {
        /** @type {object[]} */
        const res = await this.httpClient.get(`${this.baseRoute}`, query);
        return res.map((sensor) => new Sensor(sensor));
    }

    /**
     * @param {{
     *  id: string,
     *  name: string,
     *  type: string,
     *  parkingLotId: string?,
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
        return new Sensor(res);
    }

    /**
     * @param {string} id
     * @param {{
     *  name: string,
     *  type: string,
     *  parkingLotId: string,
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
     * @param {{
     *  payload: string,
     *  port: number,
     *  frameCount: number,
     *  rssi: number,
     *  snr: number,
     *  gatewayId: string,
     *  gatewayTime: string,
     *  frequency: number,
     *  dataRate: string,
     * }} body
     */
    async uplink(id, body) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.post(`${this.baseRoute}/${id}/uplink`, body);
        return res;
    }

    /**
     * @param {{
     *  hardware_serial: string,
     *  port: number,
     *  counter: number,
     *  payload_raw: string,
     *  metadata: {
     *      frequency: number,
     *      data_rate: string,
     *      gateways: [{
     *          gtw_id: string,
     *          time: string|Date,
     *          rssi: number,
     *          snr: number,
     *      }],
     *  },
     * }} body
     */
    async ttnUplink(body) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.post(`${this.baseRoute}/uplink/ttn`, body);
        return res;
    }

    /**
     * @param {{
     *  Time: string|Date
     *  DevEUI: string,
     *  FPort: number,
     *  FCntUp: number,
     *  payload_hex: string,
     *  GatewayRSSI: number,
     *  GatewaySNR: number,
     *  SpreadingFactor: string,
     *  GatewayID: string,
     * }} body
     */
    async machineqUplink(body) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.post(`${this.baseRoute}/uplink/machineq`, body);
        return res;
    }

    /**
     * @param {{
     *  EUI: string,
     *  ts: number,
     *  fcnt: number,
     *  port: number,
     *  data: string,
     *  freq: number,
     *  dr: string,
     *  rssi: number,
     *  snr: number,
     * }} body
     */
    async loriotUplink(body) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.post(`${this.baseRoute}/uplink/loriot`, body);
        return res;
    }

    /**
     * @param {{
     *  devEUI: string,
     *  rxInfo: [{
     *      gatewayID: string,
     *      time: string|Date,
     *      rssi: number,
     *      loRaSNR: number,
     *  }],
     *  txInfo: {
     *      frequency: number,
     *      dr: number,
     *  },
     *  fCnt: number,
     *  fPort: number,
     *  data: string,
     * }} body
     */
    async chirpStackUplink(body) {
        /** @type {{ message: string }} */
        const res = await this.httpClient.post(`${this.baseRoute}/uplink/chirpstack`, body);
        return res;
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

module.exports = SensorApi;
