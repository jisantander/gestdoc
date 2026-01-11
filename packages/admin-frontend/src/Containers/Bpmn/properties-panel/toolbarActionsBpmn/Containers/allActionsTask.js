const allActionsTask = [
	{
		value: "doc",
		label: "Revisar Documento",
	},
	{
		value: "form",
		label: "Solicitar Datos Vía Formulario",
	},
	{
		value: "signature",
		label: "Vista Firma Simple",
	},
	{
		value: "advanced_signature",
		label: "Vista Firma E-cert",
	},
	{
		value: "sign_in",
		label: "Registro",
	},
	{
		value: "email",
		label: "Envío de correo",
	},
	{
		value: "charge",
		label: "Cobrar",
	},
	{
		value: "request_signature",
		label: "Solicitar Firmas",
	},
	{
		value: "insert_site",
		label: "Embeber Sitio",
	},
	{
		value: "get_Info_odoo",
		label: "Obtener Información Odoo",
	},
	{
		value: "interface",
		label: "Extraer por interfaz",
	},
	{
		value: "upload",
		label: "Subir Documento",
	},
];

/*
esta tarea la saqué por que ya no se usa, esto permitía mostrar los participantes y tenía sentido cuando había más
de una pscina de participantes en le gestdoc express.
	{
		value: 'view_collaborations',
		label: 'Mostrar Participantes',
	},
*/

export default allActionsTask;
