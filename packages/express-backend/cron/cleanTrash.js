const cron = require("node-cron");
const moment = require("moment");

const trashModel = require("../models/trash");

module.exports = () => {
    cron.schedule("0 3 * * *", async () => {
        await trashModel.deleteAll({
            deletedAt: { $lte: moment().add(-15, "days") },
        });
    });
};
