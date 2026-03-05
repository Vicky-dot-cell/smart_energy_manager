const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on("connect", () => {
    console.log("Connected to HiveMQ broker");

    setInterval(() => {
        const data = {
            device_id: "dev_001",
            voltage: (220 + Math.random() * 10).toFixed(2),
            current: (5 + Math.random() * 2).toFixed(2),
            power: (1000 + Math.random() * 200).toFixed(2),
            energy: (500 + Math.random() * 10).toFixed(2),
            timestamp: Date.now()
        };

        client.publish("energy/dev_001", JSON.stringify(data));

        console.log("Published to energy/dev_001:", data);
    }, 2000);
});

client.on("error", (err) => {
    console.error("MQTT Error:", err);
});
