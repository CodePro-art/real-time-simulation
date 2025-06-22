const ws = new WebSocket("ws://localhost:5500"),
    logDiv = id=>"log",
    log = msg=>{logDiv().innerHTML += msg+"<br>"; logDiv().scrollTop=1e9;};

let c = document.getElementById("chart").getContext("2d");
let chart = new Chart(c, {
    type:"line", data:{
        labels:[], datasets:[
        {label:"Temp", data:[], borderColor:"red", fill:false},
        {label:"Battery", data:[], borderColor:"green", fill:false},
        {label:"Distance", data:[], borderColor:"blue", fill:false}
        ]
    }, options:{animation:false, scales: {x:{display:false}}}
});

let sim = document.getElementById("sim").getContext("2d");
function drawRobot(x,y,dir){
    sim.clearRect(0,0,300,300);
    sim.fillStyle="black"; sim.fillRect(140,140,20,20);
    sim.beginPath();
    sim.moveTo(x+150,y+150);
    sim.lineTo(x+150+10*Math.cos(dir),y+150+10*Math.sin(dir));
    sim.stroke();
    }

    ws.onopen = ()=>log("Connected");
    ws.onmessage = e=>{
    let d = JSON.parse(e.data);
    if(d.type=="update"){
        log(`T:${d.temp}, D:${d.dist}, B:${d.battery}`);
        chart.data.labels.push("");
        chart.data.datasets[0].data.push(d.temp);
        chart.data.datasets[1].data.push(d.battery);
        chart.data.datasets[2].data.push(d.dist);
        if(chart.data.labels.length>50){
        chart.data.labels.shift(); chart.data.datasets.forEach(ds=>ds.data.shift());
        }
        chart.update();
        drawRobot(d.robot.x, d.robot.y, d.robot.dir);
    } else if(d.type=="ack"){
        log(`Ack: ${d.cmd}`);
    }
};
function send(cmd){ws.send(cmd); log("Sent:"+cmd);}
