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

const HttpClient = require('./lib/HttpClient');
const api = require('./api');

/**
 * Send an uplink to a sensor. If the sensor doesn't exist, then first
 * create that sensor then resend the uplink.
 * @param {HttpClient} httpClient
 */
async function app1(httpClient) {
    const { v1 } = api(httpClient);

    const sensorId = '0000FFFF1111EEEE';
    const uplinkBody = {
        payload: '0302016D026700EB156601',
        port: 3,
        frameCount: 1,
        rssi: -41,
        snr: 1.62,
        gatewayId: '0080000000001234',
        gatewayTime: new Date().toISOString(),
        frequency: 902.1,
        dataRate: 'SF7BW125',
    };

    try {
        // Try Sending an uplink.
        await v1.sensorApi.uplink(sensorId, uplinkBody);
    } catch (ex) {
        // If the sensor doesn't exist (status 404), then create it.
        const message = JSON.parse(ex.message);
        if (message.body && message.body.statusCode === 404) {
            const { id } = await v1.sensorApi.create({
                id: sensorId,
                name: `client-app1-test-${sensorId}`,
                type: 'api-client-test',
            });

            // Resend the uplink.
            await v1.sensorApi.uplink(id, uplinkBody);
        }
    }
}

/**
 * Test basic get methods.
 * These should at least return your token info and empty arrays.
 * @param {HttpClient} httpClient
 */
async function app2(httpClient) {
    const { v1 } = api(httpClient);

    await v1.oauth2TokenApi.get(process.env.API_KEY);
    await v1.parkingLotApi.getAll();
    await v1.laneApi.getAll();
    await v1.sensorApi.getAll();
    await v1.sensorLogApi.getAll({ limit: 1 }); // Newest log within the last 4 hours.
}

/**
 * Test get/post/put/delete methods.
 * This will create a number of resources which depend on each other. Resources will be removed
 * once finished.
 * @param {HttpClient} httpClient
 */
async function app3(httpClient) {
    const { v1 } = api(httpClient);

    // Create objects.
    const parkingLotId = (await v1.parkingLotApi.create({
        name: 'client-test-lot-new',
        totalSpaces: 14,
    })).id;
    const sensor1Id = (await v1.sensorApi.create({
        id: 'EEEE33336666FFFF',
        name: 'client-test-sensor1-new',
        type: 'api-client-test',
        parkingLotId,
    })).id;
    const sensor2Id = (await v1.sensorApi.create({
        id: '8888AAAA22220000',
        name: 'client-test-sensor2-new',
        type: 'api-client-test',
        parkingLotId,
    })).id;
    const laneId = (await v1.laneApi.create({
        name: 'client-test-lane-new',
        frontId: sensor1Id,
        backId: sensor2Id,
        parkingLotId,
        direction: true,
        count: 0,
    })).id;

    // Try getting new objects.
    await v1.parkingLotApi.get(parkingLotId);
    await v1.sensorApi.get(sensor1Id);
    await v1.sensorApi.get(sensor2Id);
    await v1.laneApi.get(laneId);
    await v1.parkingLotApi.getSensors(parkingLotId, { type: 'api-client-test' });
    await v1.parkingLotApi.getLanes(parkingLotId);
    await v1.laneApi.getSensors(laneId);

    // Update objects.
    await v1.parkingLotApi.update(parkingLotId, {
        name: 'client-test-lot-updated',
        totalSpaces: 2,
    });
    await v1.sensorApi.update(sensor1Id, {
        name: 'client-test-sensor1-updated',
        type: 'test',
    });
    await v1.sensorApi.update(sensor2Id, {
        name: 'client-test-sensor2-updated',
    });

    // Submit generic counting uplinks
    await v1.sensorApi.uplink(sensor1Id, {
        payload: '0302016D026700EB210001',
        port: 3,
        frameCount: 2,
        rssi: -48,
        snr: 2.74,
        gatewayId: '0080000000004321',
        gatewayTime: new Date().toISOString(),
        frequency: 902.5,
        dataRate: 'SF10BW125',
    });
    await v1.sensorApi.uplink(sensor2Id, {
        payload: '0302016D026700DD210001',
        port: 3,
        frameCount: 1,
        rssi: -55,
        snr: 1.84,
        gatewayId: '0080000000004321',
        gatewayTime: new Date().toISOString(),
        frequency: 902.7,
        dataRate: 'SF10BW125',
    });

    // Lane count should now have gone from 0 to 1 if the events were right after each other.
    await v1.laneApi.get(laneId);

    // Check sensor logs.
    await v1.parkingLotApi.getSensorLogs(parkingLotId, { limit: 2 });
    await v1.laneApi.getSensorLogs(laneId, { limit: 2 });
    await v1.sensorApi.getSensorLogs(sensor1Id, { limit: 1 });
    await v1.sensorLogApi.getAll({ limit: 1 });

    // Test 3rd party uplinks for presence sensor.
    const sensor3Id = (await v1.sensorApi.create({
        id: '00000000FFFFFFFF',
        name: 'client-test-sensor3-presence',
        type: 'api-client-test',
        parkingLotId,
    })).id;
    await v1.sensorApi.ttnUplink({
        hardware_serial: sensor3Id,
        port: 3,
        counter: 1,
        payload_raw: 'AmcAwhVmAQ==',
        metadata: {
            frequency: 903.5,
            data_rate: 'SF10BW125',
            gateways: [{
                gtw_id: '0000000000000000',
                time: new Date().toISOString(),
                rssi: -35,
                snr: 1.933,
            }],
        },
    });
    await v1.sensorApi.machineqUplink({
        Time: new Date().toISOString(),
        DevEUI: sensor3Id,
        FPort: 3,
        FCntUp: 2,
        payload_hex: '0302016D156600',
        GatewayRSSI: -37,
        GatewaySNR: 1.74,
        SpreadingFactor: '10',
        GatewayID: '0000000000000001',
    });
    await v1.sensorApi.loriotUplink({
        EUI: sensor3Id,
        ts: new Date().getTime(),
        fcnt: 3,
        port: 3,
        data: '156601',
        freq: 902300000,
        dr: 'SF10 BW125 4/5',
        rssi: -39,
        snr: 1.942,
    });
    await v1.sensorApi.chirpStackUplink({
        applicationID: '1',
        applicationName: 'test-app',
        deviceName: 'test-devie',
        devEUI: sensor3Id,
        rxInfo: [{
            gatewayID: '0000000000000002',
            time: new Date().toISOString(),
            uplinkID: '0',
            name: 'test-gateway',
            rssi: -43,
            loRaSNR: 3.2,
            location: {
                latitude: 0,
                longitude: 0,
                altitude: 0,
            },
        }],
        txInfo: {
            frequency: 902300000,
            dr: 2,
        },
        adr: false,
        fCnt: 4,
        fPort: 3,
        data: 'N2YB',
        object: {
            presenceSensor: {
                55: 1,
            },
        },
    });

    // Check results.
    await v1.sensorApi.get(sensor3Id);
    await v1.sensorApi.getSensorLogs(sensor3Id, { limit: 3 });

    // Remove objects.
    await v1.laneApi.delete(laneId);
    await v1.sensorApi.delete(sensor1Id);
    await v1.sensorApi.delete(sensor2Id);
    await v1.sensorApi.delete(sensor3Id);
    await v1.parkingLotApi.delete(parkingLotId);
}

/**
 * Vehicle counting test application.
 * @param {HttpClient} httpClient
 */
async function app4(httpClient) {
    const { v1 } = api(httpClient);

    const parkingLotId = (await v1.parkingLotApi.create({
        name: 'vehicle-counting-test',
        totalSpaces: 20,
    })).id;

    const sensor1Id = (await v1.sensorApi.create({
        id: 'FF00000000000001',
        name: 'lane1-front',
        type: 'testing',
        parkingLotId,
    })).id;
    const sensor2Id = (await v1.sensorApi.create({
        id: 'FF00000000000002',
        name: 'lane1-back',
        type: 'testing',
        parkingLotId,
    })).id;
    const sensor3Id = (await v1.sensorApi.create({
        id: 'FF00000000000003',
        name: 'lane2-front',
        type: 'testing',
        parkingLotId,
    })).id;
    const sensor4Id = (await v1.sensorApi.create({
        id: 'FF00000000000004',
        name: 'lane2-back',
        type: 'testing',
        parkingLotId,
    })).id;
    const sensor5Id = (await v1.sensorApi.create({
        id: 'FF00000000000005',
        name: 'lane3-front',
        type: 'testing',
        parkingLotId,
    })).id;
    const sensor6Id = (await v1.sensorApi.create({
        id: 'FF00000000000006',
        name: 'lane3-back',
        type: 'testing',
        parkingLotId,
    })).id;

    const lane1Id = (await v1.laneApi.create({
        name: 'lane1',
        frontId: sensor1Id,
        backId: sensor2Id,
        parkingLotId,
        direction: true,
        count: 0,
    })).id;
    const lane2Id = (await v1.laneApi.create({
        name: 'lane2',
        frontId: sensor3Id,
        backId: sensor4Id,
        parkingLotId,
        direction: false,
        count: 0,
    })).id;
    const lane3Id = (await v1.laneApi.create({
        name: 'lane3',
        frontId: sensor5Id,
        backId: sensor6Id,
        parkingLotId,
        direction: false,
        count: 0,
    })).id;

    // 5 vehicles entered lane1.
    await v1.sensorApi.uplink(sensor1Id, { payload: '210001', port: 3 });
    await v1.sensorApi.uplink(sensor2Id, { payload: '210001', port: 3 });
    await v1.sensorApi.uplink(sensor1Id, { payload: '210002', port: 3 });
    await v1.sensorApi.uplink(sensor2Id, { payload: '210002', port: 3 });
    await v1.sensorApi.uplink(sensor1Id, { payload: '210003', port: 3 });
    await v1.sensorApi.uplink(sensor2Id, { payload: '210003', port: 3 });
    await v1.sensorApi.uplink(sensor1Id, { payload: '210004', port: 3 });
    await v1.sensorApi.uplink(sensor2Id, { payload: '210004', port: 3 });
    await v1.sensorApi.uplink(sensor1Id, { payload: '210005', port: 3 });
    await v1.sensorApi.uplink(sensor2Id, { payload: '210005', port: 3 });

    // 1 vehicle left lane2.
    await v1.sensorApi.uplink(sensor3Id, { payload: '210001', port: 3 });
    await v1.sensorApi.uplink(sensor4Id, { payload: '210001', port: 3 });

    // 2 vehicles left lane3.
    await v1.sensorApi.uplink(sensor5Id, { payload: '210001', port: 3 });
    await v1.sensorApi.uplink(sensor6Id, { payload: '210001', port: 3 });
    await v1.sensorApi.uplink(sensor5Id, { payload: '210002', port: 3 });
    await v1.sensorApi.uplink(sensor6Id, { payload: '210002', port: 3 });

    // Change lane2 from out to in.
    await v1.laneApi.update(lane2Id, { direction: true });

    // 2 vehicles enter lane2.
    await v1.sensorApi.uplink(sensor3Id, { payload: '210002', port: 3 });
    await v1.sensorApi.uplink(sensor4Id, { payload: '210002', port: 3 });
    await v1.sensorApi.uplink(sensor3Id, { payload: '210003', port: 3 });
    await v1.sensorApi.uplink(sensor4Id, { payload: '210003', port: 3 });

    // Change lane1 from in to out.
    await v1.laneApi.update(lane1Id, { direction: false });

    // 1 vehicle left lane1.
    await v1.sensorApi.uplink(sensor1Id, { payload: '210006', port: 3 });
    await v1.sensorApi.uplink(sensor2Id, { payload: '210006', port: 3 });

    // Final count... 3?
    await v1.parkingLotApi.get(parkingLotId);
    await v1.parkingLotApi.getLanes(parkingLotId);
    await v1.parkingLotApi.getSensors(parkingLotId);

    // Remove objects.
    await v1.laneApi.delete(lane1Id);
    await v1.laneApi.delete(lane2Id);
    await v1.laneApi.delete(lane3Id);
    await v1.sensorApi.delete(sensor1Id);
    await v1.sensorApi.delete(sensor2Id);
    await v1.sensorApi.delete(sensor3Id);
    await v1.sensorApi.delete(sensor4Id);
    await v1.sensorApi.delete(sensor5Id);
    await v1.sensorApi.delete(sensor6Id);
    await v1.parkingLotApi.delete(parkingLotId);
}

// Ensure required environment variables are set.
['API_URL', 'API_KEY'].forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`"${envVar}" environment variable not set! Exiting...`);
    }
});

/**
 * Example test applications. Comment out any of these which you do not want to run. */
(async () => {
    const httpClient = new HttpClient(process.env.API_URL, process.env.API_KEY);

    try {
        await app1(httpClient);
        await app2(httpClient);
        await app3(httpClient);
        await app4(httpClient);
    } catch (ex) {
        console.error(ex);
    }
})();
