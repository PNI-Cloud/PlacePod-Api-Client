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

class SensorLog {
    /**
     * @param {{
     *  sensorId: string,
     *  mode: string,
     *  status: number,
     *  keepAlive: boolean,
     *  temperature: number,
     *  battery: number,
     *  frameCount: number,
     *  rssi: number,
     *  snr: number,
     *  serverTime: Date,
     *  gatewayTime: Date,
     * }} params
     * */
    constructor(params) {
        this.sensorId = params.sensorId;
        this.mode = params.mode;
        this.status = params.status;
        this.keepAlive = params.keepAlive;
        this.temperature = params.temperature;
        this.battery = params.battery;
        this.frameCount = params.frameCount;
        this.rssi = params.rssi;
        this.snr = params.snr;
        this.serverTime = params.serverTime;
        this.gatewayTime = params.gatewayTime;
    }
}

module.exports = SensorLog;
