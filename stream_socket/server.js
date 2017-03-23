"use strict";
const io = require('socket.io');
const ioClient = require('socket.io-client');
const fs = require('fs');
const Sensor = require('./sensor.js').Sensor; 
const connection_server = "http://104.155.61.178";
const connection_local = "http://localhost:3000";

let finished_streams = 0; 
let registered_sensors = 0; 

let number_of_clients = process.argv[2];
let time_between_connect = process.argv[3]; 
let number_of_packets = process.argv[4]

let sensors = []; 
let sockets = [];

for(let i = 0; i < number_of_clients; i++){
  let socket = ioClient.connect(connection_local);
  sockets.push(socket);
}

sockets.forEach((socket) => {
  let s1 = new Sensor("Hampus", number_of_packets, 1, socket, sensor_done);
  let s2 = new Sensor("Hampus", number_of_packets, 2, socket, sensor_done);
  sensors.push(s1);
  sensors.push(s2);
});

sensors.forEach((sensor) => {sensor.register()})


sockets.forEach((socket) => {
  socket.on('registered', (data) =>{handle_reg(data)})
})

function handle_reg(data){
  registered_sensors++; 
  console.log(registered_sensors)
  if(registered_sensors == (2*number_of_clients)){
    console.log("STREAMING")
    sensors.forEach((s) => {s.stream()})
  }
}

function sensor_done(){
  finished_streams++; 
  if(finished_streams ===( 2 * number_of_clients)){
    console.log("done.")
   // process.exit(); 
  }
}