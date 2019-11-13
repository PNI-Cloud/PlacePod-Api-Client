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

const LaneApi = require('./LaneApi');
const Oauth2TokenApi = require('./Oauth2TokenApi');
const ParkingLotApi = require('./ParkingLotApi');
const SensorApi = require('./SensorApi');
const SensorLogApi = require('./SensorLogApi');
/** @typedef {import('../../lib/HttpClient')} HttpClient */

/**
 * @param {HttpClient} httpClient
 */
module.exports = (httpClient) => ({
    laneApi: new LaneApi(httpClient),
    oauth2TokenApi: new Oauth2TokenApi(httpClient),
    parkingLotApi: new ParkingLotApi(httpClient),
    sensorApi: new SensorApi(httpClient),
    sensorLogApi: new SensorLogApi(httpClient),
});
