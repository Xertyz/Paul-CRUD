module.exports = new function() {
    const data = {};
    let inc = 0;
    this.create = dt => {
        dt.Id = inc++;
        data[dt.Id] = dt;
        return dt;
    }
    this.getAll = () => {
        return Object.values(data);
    }
    this.get = id => data[id];
    this.update = dt => {
        data[dt.Id] = dt;
        return dt;
    }
    this.delete = id => delete data[id];
};