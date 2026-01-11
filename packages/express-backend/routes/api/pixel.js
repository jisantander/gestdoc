const { findPixel, updatePixel, findPixelByProcedure } = require("../../models/pixel");

const TRANSPARENT_GIF_BUFFER = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAADYAAAAdCAYAAADhLp8oAAAACXBIWXMAAAsSAAALEgHS3X78AAABvUlEQVRYw9WYvXGDQBCFPxhykxNIHZgOJA0FQAfGHdCB5QpEB7Y6kApgJFdgXIFRQI4qwIEPm5HuRx4H3L0Q5hje7b7dt+v1fc+tiKp9CMRYjDZJjwCeiVhU7edADmTAPfbjrU3SpZKYiE4JPOAeVoGC1BLYAXc4Cl9CKgcODpM6A3VwQSoDXgwHT0BjKakGKNsk7X40JopErYnUVhyqXQjbOGKlgtQHkLtCaIDX9/1QLA4KUss2STvXhDZELFeIMJeREhdRAOGEWip0Fz4QyyTvdHqauhUsNAH5Lvfi9mU/WWo+bEMrmJv6WKywJTpdbS0gVpo0JtPJ0WA086jalxNqrDYVtOAfLtrq8u8rnoc4jgCQhTQ2jDIFsJnwv09ApssaX9ioq3IqxhYVNhMHZAastakoJs6z5F3hcir6o4Z7iaeo2qtS8lGkw2RTsilig1ecA5+KXI5d9Iq+KN2NounOgEa4E6cwnsdCYS5189jrsAVyhpggFwPvN+a4jeiAdZuk9dWWSuw8Ssd3HrF0/SYitxMacxErX+MDY+BZ0ePc0pjCPoX8boIXDnDatkmae3/Z3Y/S1FaT3A3+8QvOl7A6bQJDWQAAAABJRU5ErkJggg==",
    "base64"
);

module.exports = (app) => {
    app.get("/api/pixelc/:pixelId", async (req, res) => {
        try {
            const data = await findPixel(req.params.pixelId);
            res.json(data);
        } catch (err) {
            next(err);
        }
    });
    app.get("/api/pixelProcedure/:ProcedureId", async (req, res) => {
        try {
            const data = await findPixelByProcedure(req.params.ProcedureId);
            res.json(data);
        } catch (err) {
            next(err);
        }
    });
    app.get("/api/pixel/:pixel", async (req, res) => {
        const data = {
            host: req.headers.host,
            params: req.params,
            query: req.query,
            agent: req.headers["user-agent"],
            ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        };
        await updatePixel(req.params.pixel, { open: true, data });
        res.writeHead(200, {
            "Content-Type": "image/gif",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Cache-Control": "post-check=0, pre-check=0",
            Pragma: "no-cache",
        });
        res.end(TRANSPARENT_GIF_BUFFER, "binary");
    });
    app.post("/api/pixel/:transaction", async (req, res) => {
        try {
            const documento = await getDocumento(req.params.transaction);
            console.log({ documento });
            await mail.pixel({
                activity: nextStage.id,
                email: data.value,
                procedure: req.params.transaction,
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Hubo un error" });
        }
    });
};
