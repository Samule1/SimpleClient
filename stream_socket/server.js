"use strict";
const io = require('socket.io');
const ioClient = require('socket.io-client');
const fs = require('fs');


var socket = ioClient.connect("http://localhost:3000");

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

socket.emit('register', {user:'Marcus', type:'publisher', freq:'128.00', channel:1});


setTimeout(function(){
  socket.emit('register', {user:'Hampus', type:'publisher', freq:'128.00', channel:2});
}, 1000);








socket.on('registered', (data)=>{
  console.log(data.id);
  if(data.channel === 1){
      sendAllData(rf, 1);
  }
  if(data.channel === 2){
      sendAllData(lf, 2);
  }


});

function sendAllData(points, channel){
  console.log('sending all the data..')
  var i = 0;
  let loop =setInterval(function(){
    socket.emit('accelormeter_input', {x: points.x[i], y:points.y[i], z:points.z[i], client_ts: Date.now(), index: i, channel:channel});

    i++;
    if(i === 30000){
      clearInterval(loop);
    }
  },8);
  console.log('Done');
}
