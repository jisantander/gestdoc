const cron = require("node-cron");
const moment = require("moment");

const ecertModel = require("../models/ecert");
const asyncForEach = require("../lib/asyncForEach");

module.exports = () => {
    cron.schedule("0 2 * * *", async () => {
        const ecertResponses = await ecertModel.findAll({
            updatedAt: { $lte: moment().add(-2, "days") },
            valid: true,
        });

        if (ecertResponses.length > 0) {
            await asyncForEach(ecertResponses, async (ecertResponse) => {
                await ecertModel.removeEcert(ecertResponse._id);
            });
        }
    });
};
