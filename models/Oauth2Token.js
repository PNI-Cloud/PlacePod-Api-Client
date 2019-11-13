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

class Oauth2Token {
    /**
     * Create a new access token object.
     * @param {{
     *  token: string,
     *  expiresAt: Date|string,
     *  type: string,
     *  clientId: string?,
     * }} params
     */
    constructor(params) {
        this.token = params.token;
        this.expiresAt = params.expiresAt;
        this.type = params.type;
        this.clientId = params.clientId;
    }
}

module.exports = Oauth2Token;
