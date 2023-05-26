const Log = require("../models/logsModel");

const getLogs = async (req, res) => {
  try {
    let result = await Log.find({});
    if (req.body.user) {
      result = result.filter((record) => {
        if (record.user == req.body.user) {
          return record;
        }
      });
    }
    if (req.body.type) {
      result = result.filter((record) => {
        if (record.type.includes(req.body.type)) {
          return record;
        }
      });
    }
    if (req.body.from) {
      result = result.filter((record) => {
        let tmp = JSON.stringify(record.createdAt).slice(1, 11);
        let date1 = new Date(tmp).getTime();
        let date2 = new Date(req.body.from).getTime();
        if (date1 >= date2) {
          return record;
        }
      });
    }
    if (req.body.to) {
      result = result.filter((record) => {
        let tmp = JSON.stringify(record.createdAt).slice(1, 11);
        let date1 = new Date(tmp).getTime();
        let date2 = new Date(req.body.to).getTime();
        if (date1 <= date2) {
          return record;
        }
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = getLogs;
