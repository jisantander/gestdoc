const https = require("https");
const path = require("path");

module.exports = (app) => {
    app.get("/api/pdf/preview/:transaction", async (req, res) => {
        var url = `${process.env.PDF_PREVIEW}/${req.params.transaction}`; //pdf link
        https
            .get(url, async (response) => {
                if (req.query.download) {
                    res.setHeader(
                        "Content-disposition",
                        "attachment; filename=" + (req.params.transaction || "PDF_PREVIEW")
                    );
                } else {
                    res.setHeader("Content-disposition", 'inline; filename="PDF_PREVIEW.pdf"');
                }
                res.setHeader("Content-type", "application/pdf");
                await response.pipe(res);
            })
            .on("error", (e) => {
                console.error(e);
                res.status(500).json({ message: "Error al mostrar PDF" });
            });
    });

    app.get("/api/pdf/final/:transaction", async (req, res) => {
        var url = `${process.env.PDF_FINAL}/${req.params.transaction}`; //pdf link
        https
            .get(url, async (response) => {
                if (req.query.download) {
                    res.setHeader(
                        "Content-disposition",
                        "attachment; filename=" + (req.params.transaction || "PDF_FINAL")
                    );
                } else {
                    res.setHeader("Content-disposition", 'inline; filename="PDF_FINAL.pdf"');
                }
                res.setHeader("Content-type", "application/pdf");
                await response.pipe(res);
            })
            .on("error", (e) => {
                console.error(e);
                res.status(500).json({ message: "Error al mostrar PDF" });
            });
    });
};
