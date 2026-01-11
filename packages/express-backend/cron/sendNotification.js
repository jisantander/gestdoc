const cron = require("node-cron");

const notificationModel = require("../models/notification");
const userModel = require("../models/users");
const procedureModel = require("../models/procedures");
const asyncForEach = require("../lib/asyncForEach");
const mail = require("../lib/mail");

module.exports = () => {
    cron.schedule("* * * * *", async () => {
        const notifications = await notificationModel.findPending();

        const usersEmail = [];
        if (notifications.length > 0) {
            /*
			// Aqui deberia ir la logica para los correos de los usuarios a notificar
			// por ejemplo, los usuarios de gestdoc express:
            const users = await userModel.findAll({
                company: { $exists: false },
                role: { $exists: true, $ne: "VISITOR" },
            });
            users.forEach((it) => usersEmail.push(it.email));*/

            //está lógica debería pertenecer a los usuarios  Super Admin del gestdocFLow

            const users = await userModel.findAll({
                company: { $exists: false },
                role: { $exists: true, $eq: "ROLE_ADMIN" },
            });
            users.forEach((it) => usersEmail.push(it.email));
        }

        await asyncForEach(notifications, async (item) => {
            if (usersEmail.length > 0) {
                /*
				// Aqui debería ir la logica para enviar la notificacion
				// por ejemplo, un correo
                const procedure = await procedureModel.find({ _id: item.procedure });
                const mailgunData = await mail.notifyNextStage(usersEmail, {
                    procedure: item.procedure,
                    bpmn: procedure.docs[0].bpmn._nameSchema,
                    etapa: item.data.titleStage,
                });
                await notificationModel.readNotification(item._id, mailgunData);*/

                //implementación
                const procedure = await procedureModel.find({ _id: item.procedure });
                const mailgunData = await mail.notifyNextStage(usersEmail, {
                    procedure: item.procedure,
                    bpmn: procedure.docs[0].bpmn._nameSchema,
                    etapa: item.data.titleStage,
                    email: procedure.docs[0].email ? procedure.docs[0].email : "",
                });
                await notificationModel.readNotification(item._id, mailgunData, usersEmail);
            }
        });
    });
};
