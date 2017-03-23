"use strict"

const spawn = require('child_process').spawn;
const fork = require('child_process').fork;

//input args: number of clients, time between spawn. 

let number_of_clients = process.argv[2];
let time_between_connect = process.argv[3]; 
let number_of_packets = process.argv[4]

let test = fork('server.js', [number_of_clients, time_between_connect], [{ stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }]);


//Handle console out from test.
test.on('message', (data)=>{
    console.log(JSON.stringify(data)); 
});

//Handle the termination of a test and 
test.on('close', (code) =>{
    let message = code === 0 ? "Finished test ok." : "Test failed";
})