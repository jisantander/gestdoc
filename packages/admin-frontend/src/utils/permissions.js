export const defaultRoutes = [
	{ id: '/BpmnList', name: 'Lista BPMN' },
	{ id: '/BpmnBuilder', name: 'Editar BPMN' },
	{ id: '/FormList', name: 'Listar Formularios' },
	{ id: '/FormBuilder', name: 'Editar Formulario' },
	{ id: '/ThemeList', name: 'Listar Plantillas de Documentos' },
	{ id: '/DocsBuilder', name: 'Editar Documentos' },
	{ id: '/EmailList', name: 'Listar Plantillas de Correo' },
	{ id: '/EmailBuilder', name: 'Editar Plantillas de Correo' },
	{ id: '/HtmlsList', name: 'Listar Vista Previa de Documento' },
	{ id: '/HtmlsBuilder', name: 'Editar Vista Previa de Documento' },
	{ id: '/Procedure', name: 'Listar y Editar Procedimientos' },
	{ id: '/Company', name: 'Listar y Editar Empresas' },
	{ id: '/UserList', name: 'Listar y Editar Usuarios' },
	{ id: '/Interface', name: 'Listar y Editar Interfaces de conexión' },
	{ id: '/Dashboard', name: 'Ver indicadores' },
];

export const bizRoutes = [...defaultRoutes];

export const defaultNameRoutes = defaultRoutes.map((item) => item.name);

export const getIdRoutes = (routes) => {
	return defaultRoutes
		.filter((item) => {
			return routes.includes(item.name);
		})
		.map((it) => it.id);
};

export const getNameRoutes = (routes) => {
	return defaultRoutes
		.filter((item) => {
			return routes.includes(item.id);
		})
		.map((it) => it.name);
};
