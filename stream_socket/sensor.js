"use strict"

const fs = require('fs');

var rf = {
    x: fs.readFileSync('rf_accX.txt').toString().split('\n').map(Number),
    y: fs.readFileSync('rf_accY.txt').toString().split('\n').map(Number),
    z: fs.readFileSync('rf_accZ.txt').toString().split('\n').map(Number)
}

var lf = {
    x: fs.readFileSync('lf_accX.txt').toString().split('\n').map(Number),
    y: fs.readFileSync('lf_accY.txt').toString().split('\n').map(Number),
    z: fs.readFileSync('lf_accZ.txt').toString().split('\n').map(Number)
}

module.exports = {

    Sensor: function (user, stream_length, channel, socket, callback) {
        this.user = user;
        this.socket = socket;
        this.channel = channel;
        this.stream_length = stream_length;
        this.data = channel === 1 ? rf : lf;
        this.register = function () {
            console.log("The channel is: "+this.channel)
            socket.emit('register', { user: this.user, type: 'publisher', freq: '128.00', channel: this.channel });
        };
        this.stream = function () {
            var i = 0;
            let t = this;
            let loop = setInterval(function () {
                //console.log(t.stream_length)
                socket.emit('accelormeter_input', {d:[{ x: t.data.x[i], y: t.data.y[i], z: t.data.z[i], client_ts: Date.now(), index: i, channel: t.channel}]});
                i++;
                if (i >= t.stream_length) {
                    console.log("BREAKING THE LOOP")
                    clearInterval(loop);
                    callback();
                }
            }, 8);
        }

    }
}
