const fs = require("fs");

const FILE = "./data/infractions.json";

function load() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, "{}");
    }

    return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function add(userId, type) {

    const data = load();

    if (!data[userId]) {
        data[userId] = {
            level: 0,
            history: []
        };
    }

    data[userId].level++;

    data[userId].history.push({
        type,
        date: new Date().toISOString()
    });

    save(data);

    return data[userId].level;
}

function get(userId) {
    return load()[userId];
}

function clear(userId) {
    const data = load();

    delete data[userId];

    save(data);
}

module.exports = {
    add,
    get,
    clear
};
