"use strict";
const io = require('socket.io');
const ioClient = require('socket.io-client');
const fs = require('fs');


var socket = ioClient.connect("http://35.157.38.255/");

let accX = fs.readFileSync('accX.txt').toString().split('\n').map(Number);
let accY = fs.readFileSync('accY.txt').toString().split('\n').map(Number);
let accZ = fs.readFileSync('accZ.txt').toString().split('\n').map(Number);

socket.emit('register', {type:'publisher', freq:'128.00'});

socket.on('registered', (data)=>{
  console.log(data.id);
  sendAllData(accX,accY,accZ);
});

function sendAllData(x,y,z){
  console.log('sending all the data..')
  var i = 0;
  let loop =setInterval(function(){
    socket.emit('accelormeter_input', {x: x[i], y:y[i], z:z[i]});
    i++;
    if(i === 6000){
      clearInterval(loop);
    }
  },8);

  console.log('fäääärdig');

}
