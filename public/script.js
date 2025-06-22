const ws = new WebSocket("ws://localhost:5500");

// ✅ DOM references
const logDiv = () => document.getElementById("log");
const log = msg => {
    const div = logDiv();
    if (div) {
        div.innerHTML += msg + "<br>";
        div.scrollTop = div.scrollHeight;
    }
};

// 📊 Chart setup
const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
        { label: "Temp", data: [], borderColor: "red", fill: false },
        { label: "Battery", data: [], borderColor: "green", fill: false },
        { label: "Distance", data: [], borderColor: "blue", fill: false }
        ]
    },
    options: {
        animation: false,
        scales: {
        x: { display: false },
        y: { beginAtZero: true }
        }
    }
});

// 🤖 Robot simulation
const sim = document.getElementById("sim").getContext("2d");
function drawRobot(x, y, dir) {
    sim.clearRect(0, 0, 300, 300);
    sim.fillStyle = "black";
    sim.fillRect(140, 140, 20, 20); // robot body at center
    sim.beginPath();
    sim.moveTo(x + 150, y + 150);
    sim.lineTo(x + 150 + 10 * Math.cos(dir), y + 150 + 10 * Math.sin(dir));
    sim.stroke();
}

// 🌐 WebSocket events
ws.onopen = () => {
    log("✅ Connected to server");
};

ws.onmessage = event => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === "update") {
        log(`📡 T:${data.temp}, D:${data.dist}, B:${data.battery}`);

        chart.data.labels.push("");
        chart.data.datasets[0].data.push(data.temp);
        chart.data.datasets[1].data.push(data.battery);
        chart.data.datasets[2].data.push(data.dist);

        // keep chart data at most 50 points
        if (chart.data.labels.length > 50) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(ds => ds.data.shift());
        }

        chart.update();
        drawRobot(data.robot.x, data.robot.y, data.robot.dir);
        } else if (data.type === "ack") {
            log(`✅ Ack: ${data.cmd}`);
        }
    } catch (err) {
        log("❌ Invalid JSON: " + event.data);
    }
};

// 🕹️ Command sender
function send(cmd) {
    ws.send(cmd);
    log("🕹️ Sent: " + cmd);
}

// Make `send()` accessible from HTML buttons
window.send = send;
