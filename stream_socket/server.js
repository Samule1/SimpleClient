"use strict";
const io = require('socket.io');
const ioClient = require('socket.io-client');
const fs = require('fs');


var socket = ioClient.connect("http://localhost:3000/");

let user1_accX = fs.readFileSync('User1_accX.txt').toString().split('\n').map(Number);
let user1_accY = fs.readFileSync('User1_accY.txt').toString().split('\n').map(Number);
let user1_accZ = fs.readFileSync('User1_accZ.txt').toString().split('\n').map(Number);

let user2_accX = fs.readFileSync('User2_accX.txt').toString().split('\n').map(Number);
let user2_accY = fs.readFileSync('User2_accY.txt').toString().split('\n').map(Number);
let user2_accZ = fs.readFileSync('User2_accZ.txt').toString().split('\n').map(Number);


socket.emit('register', {user:'Marcus', type:'publisher', freq:'128.00', channel:0});
socket.emit('register', {user:'Marcus', type:'publisher', freq:'128.00', channel:1});


socket.on('registered', (data)=>{
  console.log(data.id);
  setTimeout(function(){
      sendAllData(user1_accX,user1_accY,user1_accZ,0);
      sendAllData(user2_accX,user2_accY,user2_accZ,1);
  },10000);
});

function sendAllData(x,y,z,channel){
  console.log('sending all the data..')
  var i = 0;
  let loop =setInterval(function(){
    socket.emit('accelormeter_input', {x: x[i], y:y[i], z:z[i], client_ts: Date.now(), index: i, channel:channel});
    i++;
    if(i === 30000){
      clearInterval(loop);
    }
  },8);
  console.log('Done');
}
