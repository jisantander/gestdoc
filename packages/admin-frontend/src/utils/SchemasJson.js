import { defaultNameRoutes } from "./permissions";

const settingProcessNoExpress = {
	title: "Información del proceso",
	description: "Estos campos son opcionales y pueden servir para integraciones con otros sitemas",
	definitions: {
		Thing: {
			type: "object",
			properties: {
				name: {
					type: "string",
					default: "Default name",
				},
			},
		},
	},
	type: "object",
	properties: {
		_description: {
			type: "string",
			title: "Descripción del proceso",
		},
		_category: {
			type: "string",
			title: "Categoría",
		},
		download: {
			type: "string",
			title: "Título de descarga PDF",
		},
	},
};

const settingProcess = {
	title: "Información del proceso",
	description: "Estos campos son opcionales y pueden servir para integraciones con otros sitemas",
	definitions: {
		Thing: {
			type: "object",
			properties: {
				name: {
					type: "string",
					default: "Default name",
				},
			},
		},
	},
	type: "object",
	properties: {
		_description: {
			type: "string",
			title: "Descripción del proceso",
		},
		download: {
			type: "string",
			title: "Título de descarga PDF",
		},
		_link: {
			type: "string",
			title: "Adjuntar a Link",
		},
		_category: {
			type: "string",
			title: "Categoría",
		},
		_valor: {
			type: "number",
			title: "$ Valor",
		},
		_requirements: {
			type: "array",
			title: "Lista de requisitos",
			items: {
				type: "string",
			},
		},
	},
};

const LoginInputs = {
	title: "Ingresar",
	description: "Complete los campos para poder ingresar",
	type: "object",
	properties: {
		email: {
			title: "Usuario",
			type: "string",
		},
		password: {
			title: "Contraseña",
			type: "string",
			minLength: 6,
		},
	},
};

const LoginUi = {
	password: {
		"ui:widget": "password",
	},
};

const RecoverInputs = {
	title: "Recuperar contraseña",
	description: "Complete los campos para resetear su acceso",
	type: "object",
	properties: {
		password: {
			title: "Nueva contraseña",
			type: "string",
			minLength: 6,
		},
		password2: {
			title: "Repetir contraseña",
			type: "string",
			minLength: 6,
		},
	},
};

const RecoverUi = {
	password: {
		"ui:widget": "password",
	},
	password2: {
		"ui:widget": "password",
	},
};

const UserInputs = (companies) => {
	return {
		title: "Editar Usuario",
		description: "Complete los datos para actualizar",
		type: "object",
		properties: {
			admin: {
				title: "Administrador general",
				type: "boolean",
			},
			name: {
				title: "Nombres",
				type: "string",
			},
			surname: {
				title: "Apellidos",
				type: "string",
			},
			email: {
				title: "Correo Electrónico",
				type: "string",
			},
			routes: {
				title: "Rutas Permitidas",
				type: "array",
				uniqueItems: true,
				items: {
					type: "string",
					enum: defaultNameRoutes,
				},
			},
			company: {
				title: "Empresa asociada",
				type: "string",
				enum: companies.map((it) => it._id),
				enumNames: companies.map((it) => it.name),
			},
			ecert_title_rol: {
				title: "Titulo del Rol para ojos del usuario final, uso en usuario enrolado ej:Notaría (campo no obligatorio)",
				type: "string",
			},
			ecert_rut: {
				title: "RUT para fines enrolamiento eCert (campo no obligatorio)",
				type: "string",
			},
			ecert_nombre: {
				title: "Nombre Legal para fines enrolamiento eCert (campo no obligatorio)",
				type: "string",
			},
			ecert_appat: {
				title: "Apellido Paterno para fines enrolamiento eCert (campo no obligatorio)",
				type: "string",
			},
			ecert_apmat: {
				title: "Apellido Materno  para fines enrolamiento eCert (campo no obligatorio)",
				type: "string",
			},
		},
		required: ["name", "surname", "email"],
	};
};

const UserUi = {
	routes: {
		"ui:widget": "checkboxes",
	},
};

const FilterProcedureInputs = (tramites) => {
	return {
		title: "Filtrar Procedimientos",
		description: "Complete los datos para filtrar",
		type: "object",
		properties: {
			email: {
				title: "Correo Electrónico",
				type: "string",
			},
			bpmn: {
				title: "Procedimiento",
				type: "string",
				enum: tramites.map((it) => it._id),
				enumNames: tramites.map((it) => it._nameSchema),
			},
		},
	};
};

const ProfileInputs = {
	title: "Editar Mi Perfil",
	description: "Complete los datos para actualizar",
	type: "object",
	properties: {
		name: {
			title: "Nombres",
			type: "string",
		},
		surname: {
			title: "Apellidos",
			type: "string",
		},
		email: {
			title: "Correo Electrónico",
			type: "string",
		},
	},
	required: ["name", "surname", "email"],
};

const ResetInputs = {
	title: "Modificar contraseña",
	description: "Tenemos que verificar su contraseña anterior para poder validar la nueva.",
	type: "object",
	properties: {
		old: {
			title: "Contraseña original",
			type: "string",
			minLength: 1,
		},
		password: {
			title: "Nueva contraseña",
			type: "string",
			minLength: 6,
		},
	},
};

const ResetUi = {
	old: {
		"ui:widget": "password",
	},
	password: {
		"ui:widget": "password",
	},
};

export {
	settingProcessNoExpress,
	settingProcess,
	LoginInputs,
	LoginUi,
	RecoverInputs,
	RecoverUi,
	UserInputs,
	UserUi,
	FilterProcedureInputs,
	ProfileInputs,
	ResetInputs,
	ResetUi,
};
