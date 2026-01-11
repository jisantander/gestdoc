const jsonSchema = {
  title: "solo rut",
  description: "",
  type: "object",
  properties: {
    odoo_gestdoc_rut_id: {
      title: "Rut",
      id: "odoo_gestdoc_rut_id",
      isRequired: true,
      type: "string",
      validar: "Rut",
    },
  },
  required: ["odoo_gestdoc_rut_id"],
};

const uiSchema = {
  odoo_gestdoc_rut_id: {
    "ui:help": "Ingrese Rut de la persona para obtener su información de la plataforma odoo",
    "ui:placeholder": "19.112.039-7",
    "ui:widget": "ValidInput",
  },
};

export { jsonSchema, uiSchema };
