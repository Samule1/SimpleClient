"use strict";
const io = require('socket.io');
const ioClient = require('socket.io-client');
const fs = require('fs');


var socket = ioClient.connect("http://localhost:3000/");

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

socket.emit('register', {user:'Marcus', type:'publisher', freq:'128.00', channel:0});

setTimeout(function(){
  socket.emit('register', {user:'Marcus', type:'publisher', freq:'128.00', channel:1});
}, 1000);


socket.on('registered', (data)=>{
  console.log(data.id);
  setTimeout(function(){
      sendAllData(rf, lf);
  },10000);
});

function sendAllData(rf, lf){
  console.log('sending all the data..')
  var i = 0;
  let loop =setInterval(function(){
    socket.emit('accelormeter_input', {x: rf.x[i], y:rf.y[i], z:rf.z[i], client_ts: Date.now(), index: i, channel:0});
    socket.emit('accelormeter_input', {x: lf.x[i], y:lf.y[i], z:lf.z[i], client_ts: Date.now(), index: i, channel:1});
    i++;
    if(i === 30000){
      clearInterval(loop);
    }
  },8);
  console.log('Done');
}
