const urlModel = require("../../models/url");
const bpmnModel = require("../../models/bpmn");
const companyModel = require("../../models/companyModel");
const {
    createDocumento,
} = require("../../models/procedures");

module.exports = (app) => {
    app.get("/api/quick/:code", async (req, res) => {
        try {
            const { rxsUrl } = await urlModel.findByCode(req.params.code);
            urlModel.updClick(req.params.code);
			const id = rxsUrl.split('/').pop();
			const bpmn = await bpmnModel.findOne(id);
			if (!bpmn)
				return res.status(404).json({ error: "BPMN not found" });
			if(bpmn.company){
				bpmn.company = await companyModel.findOne(bpmn.company);
				const company = JSON.parse(JSON.stringify(bpmn.company));
				bpmn.company = company._doc.name;
			}
			const {_bpmnModeler, _requirements, createdAt, updatedAt, _id, id: id2, __v, ...restBpmn} = bpmn;
			res.json({ bpmn: {
				...restBpmn
			} });
        } catch (err) {
            console.error("[get quick]", err);
            next(err);
        }
    });

    app.post("/api/quick/:code", async (req, res, next) => {
        try {
            const { rxsUrl } = await urlModel.findByCode(req.params.code);
            urlModel.updClick(req.params.code);
			const id = rxsUrl.split('/').pop();
			const bpmn = await bpmnModel.findOne(id);
			if (!bpmn)
				return res.status(404).json({ error: "BPMN not found" });
			const data = {
				//email: req.body.email || '',
				company: bpmn.company,
				bpmn: bpmn._id
			};
            const documento = await createDocumento(data);
            res.json(documento);
        } catch (err) {
            console.error("[create quick]", err);
            next(err);
        }
    });
};
