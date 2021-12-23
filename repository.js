const { readFileSync, stat, writeFileSync, writeFile } = require('fs')

module.exports = new function () {
    let inc = 0;
    let data = {};
    const fileName = "./data.json";
    this.create = dt => {
        dt.Id = inc++;
        data[dt.Id] = dt;
        writeFile(fileName, JSON.stringify(data), err => {if (err) console.log(err);});
        return dt;
    }
    this.getAll = () => {
        return Object.values(data);
    }
    this.get = id => data[id];
    this.update = dt => {
        data[dt.Id] = dt;
        writeFile(fileName, JSON.stringify(data), err => {if (err) console.log(err);});
        return dt;
    }
    this.delete = id => {
        delete data[id];
        writeFile(fileName, JSON.stringify(data), err => {if (err) console.log(err);});
        return true
    }

    stat(fileName, (err, stats) => {
        if (err && err.code === "ENOENT") {
            writeFileSync(fileName, "{}");
        }
        data = JSON.parse(readFileSync(fileName, {encoding: "UTF-8"}));
        for (let el in data) {
            if(data[el].Id > inc) inc = data[el].Id;
        }
        inc++;
    });
}