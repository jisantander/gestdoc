import React, { useState, useEffect } from "react";
import "./ProcedureForm.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Handlebars from "handlebars";
import { setNextStage } from "../../reducers/documento";
import JustForm from "./styles-forms/JustForm";
import FromAndDoc from "./styles-forms/FormAndDoc";
import FormSignature from "./styles-forms/FormSignature";
import writtenNumber from "written-number";
import moment from "moment";

const RJSF_PREFIX = "rjsf_prefix";

export default function ProcedureForm({ handleBack, canGoBack }) {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();

  const documento = useSelector(({ documento }) => documento.documento);
  const participants = useSelector(({ documento }) => documento.documento.participants);
  const gestores = useSelector(({ documento }) => documento.gestores);

  const [formData, setFormData] = useState(null);
  const [htmlForm, setHtml] = useState("");
  const [htmlForm2, setHtml2] = useState();
  // const [focus, setFocus] = useState('');
  const [highlight, setHighlight] = useState("");
  const [viewForm, setviewForm] = useState(0);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }
  const jsonSchema = JSON.parse(participantData.form._stringJson || "{}");
  const uiSchema = participantData.form._stringUiJson ? JSON.parse(participantData.form._stringUiJson) : {};
  let totalData = {};
  gestores.forEach((item) => {
    totalData = { ...totalData, ...item.form };
  });

  const templateBase = participantData.html
    ? participantData.html._body
      ? replaceAll(participantData.html._body, "{{fn&nbsp;", `{{fn `)
      : ""
    : "";

  Handlebars.registerHelper("nm", function (value, options) {
    var newValue = "";
    if (options.hash.id) {
      if (!value) {
        if (options.data.root[options.hash.id]) {
          value = options.data.root[options.hash.id];
        }
      }
    }

    if (typeof value === "undefined" || value === "" || value === null) {
      newValue = new Handlebars.SafeString('<span class="hola" id="' + options.hash.id + '">_________</span>');
    } else {
      const currencyValue = new Intl.NumberFormat("es-CL").format(value);
      newValue = new Handlebars.SafeString(
        '<span class="hola" id="' + options.hash.id + '">' + currencyValue + "</span>"
      );
    }
    return newValue;
  });

  Handlebars.registerHelper("nl", function (value, options) {
    var newValue = "";
    if (options.hash.id) {
      if (!value) {
        if (options.data.root[options.hash.id]) {
          value = options.data.root[options.hash.id];
        }
      }
    }

    if (typeof value === "undefined" || value === "" || value === null) {
      newValue = new Handlebars.SafeString('<span class="hola" id="' + options.hash.id + '">_________</span>');
    } else {
	  value = value.replace(/\./g, '');
	  value = value.replace(/\,/g, '');
      newValue = new Handlebars.SafeString(
        '<span class="hola" id="' + options.hash.id + '">' + writtenNumber(parseInt(value), { lang: "es" }) + "</span>"
      );
    }
    return newValue;
  });

  Handlebars.registerHelper("fn", function (value, options) {
    var newValue = "";
    if (options.hash.id) {
      if (!value) {
        if (options.data.root[options.hash.id]) {
          value = options.data.root[options.hash.id];
        }
      }
    }

    if (typeof value === "object" && Array.isArray(value)) {
      newValue = new Handlebars.SafeString(
        '<span class="hola" id="' + options.hash.id + '">' + value.join(", ") + "</span>"
      );
    } else if (typeof value === "undefined" || value === "" || value === null || typeof value !== "string") {
      newValue = new Handlebars.SafeString('<span class="hola" id="' + options.hash.id + '">_________</span>');
    } else {
      if (value.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)) {
        var fecha = moment(value).toDate();
        value = fecha.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
      }
      newValue = new Handlebars.SafeString('<span class="hola" id="' + options.hash.id + '">' + value + "</span>");
    }
    return newValue;
  });

  Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
    switch (operator) {
      case "==":
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case "===":
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case "!=":
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case "!==":
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case "<":
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case "&lt;":
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case "<=":
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case "&lt;=":
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case ">":
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case "&gt;":
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case ">=":
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case "&gt;=":
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case "&&":
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case "||":
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  const log = (type) => console.log.bind(console, type);

  const handleSubmit = async () => {
    try {
      let participantDataCurrent = null;
      if (participant && documento) {
        participantDataCurrent = gestores.find((it) => it.id === participant);
      } else if (documento) {
        participantDataCurrent = gestores[0];
      }

      //TODOOO

      //debo crear una funcion donde me tome todos los title de propertied del nested del formulario a generar.

      /*form_names: {key : title}*/

      console.log("jsonSchema", jsonSchema);

      /*properties:
        prueba_formulario_domino_vigente_id: {title: "Domino Vigente", id: "prueba_formulario_domino_vigente_id", isRequired: true, type: "string", format: "data-url"}
        prueba_formulario_nombre_id: {title: "nombre", id: "prueba_formulario_nombre_id", isRequired: true, type: "string"} */

      let form_names = {};
      const form_types = {};

      for (const key in jsonSchema.properties) {
        if (jsonSchema.properties.hasOwnProperty(key)) {
          form_names[key] = jsonSchema.properties[key].title;
          form_types[key] = jsonSchema.properties[key].type;
        }
      }

      for (const key in jsonSchema.properties) {
        if (jsonSchema.properties.hasOwnProperty(key)) {
          if ((form_types[key] = jsonSchema.properties[key].type === "boolean")) {
            if (!formData[key]) {
              formData[key] = false;
            }
          }
        }
      }

      console.log("form_names", form_names);

      dispatch(
        setNextStage(transaction, participantDataCurrent.current, {
          type: "form",
          titleStage: participantData.next.name,
          notification: participantData.next["custom:notification"] === "true",
          form: formData,
          form_names,
          form_types,
          properties: jsonSchema.properties,
        })
      );
    } catch (err) {
      /** */
    }
  };

  const getThemeVars = (value) => {
    if (value === null) return {};
    if (value === "") return {};
    const matchedRegex = value.match(/{{([^}]+)}}/g);
    if (matchedRegex === null) return {};
    const result = matchedRegex.map((res) => res.replace(/{{|}}/g, ""));
    var newKeys = {};
    for (let i = 0; i < result.length; i++) {
      newKeys[result[i]] = result[i];
    }
    return newKeys;
  };

  const allVariables = getThemeVars(templateBase);

  const clickHandler = (e) => {
    if (e.target.id) {
      const fieldId = e.target.id;
      if (fieldId === "difuminado") {
        setHighlight(fieldId);
      } else if (allVariables["fn " + fieldId]) {
        setHighlight(fieldId);
      }
    }
  };

  const onResult = (result) => {
    console.log(formData);
    setFormData({ [result]: true });
  };

  const focusHandler = (e) => {
    const element = e.substr(RJSF_PREFIX.length + 1);
    try {
      for (const property in allVariables) {
        if (property.indexOf("fn ") === 0) {
          let id = replaceAll(property, "fn ", "");
          document.getElementById(id).style.backgroundColor = "white";
        }
      }
    } catch (error) {
      try {
        document.getElementById(element).style.backgroundColor = "yellow";
        // setFocus(e.substr(RJSF_PREFIX.length + 1));
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  };

  /* Define function for escaping user input to be treated as 
    a literal string within a regular expression */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Define functin to find and replace specified term with replacement string */
  function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), "g"), replacement);
  }

  useEffect(() => {
    let view = 0;
    if (participantData.form._title === "Tipo Firma") {
      view = 1;
    } else if (!participantData.html) {
      view = 2;
    } else if (participantData.html) {
      view = 3;
    }

    setviewForm(view);

    var templateBaseHere = templateBase;
    templateBaseHere = replaceAll(
      templateBaseHere,
      "{{difuminado}}",
      `<p class="noselect" style="color: transparent;text-shadow: 0 0 5px rgba(0,0,0,0.5);" id="difuminado">
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. In venenatis velit dolor, nec laoreet elit feugiat et. Quisque ligula neque, malesuada at magna eu, tristique eleifend lorem. Nulla quis fringilla sapien. Nullam a nisl vitae neque ultrices convallis. Aliquam vel arcu consectetur odio consequat interdum id nec justo. Donec eu venenatis lorem. Cras massa mi, fermentum quis pulvinar et, ultricies sed velit. Morbi rutrum nunc sed facilisis luctus.</p>`
    );
    templateBaseHere = replaceAll(templateBaseHere, "&deg;", "");
    // const allVariables = getThemeVars(templateBase);
    for (const property in allVariables) {
      if (property.indexOf("fn ") === 0) {
        let id = replaceAll(property, "fn ", "");
        templateBaseHere = replaceAll(templateBaseHere, property, `${property} id="${id}"`);
      }
    }
    setHtml2(templateBaseHere);
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    const formToUse = participantDataCurrent.form;
    if (participantData.files) {
      participantData.files
        .filter((file) => file.name)
        .forEach((file) => {
          if (formToUse[file.name]) {
            formToUse[file.name] = file.value;
          }
        });
    }
    setFormData(formToUse);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (formData) {
      if (formData.firma_simple || formData.firma_avanzada) {
        handleSubmit();
      }
    }
    // eslint-disable-next-line
  }, [formData]);

  useEffect(() => {
    var currentFormData = { ...totalData, ...formData };

    if (htmlForm2) {
      const compile = Handlebars.compile(htmlForm2);
      var result = compile(currentFormData);
      setHtml(result);
    }
    // eslint-disable-next-line
  }, [formData, htmlForm2]);

  let highlightText = "";
  if (highlight !== "") {
    if (jsonSchema.properties[highlight]) {
      if (jsonSchema.properties[highlight].title) {
        highlightText = `Se debe llenar la casilla denominada "${jsonSchema.properties[highlight].title}" en el formulario.`;
      }
    } else if (highlight === "difuminado") {
      highlightText = `El texto se completará al terminar el trámite...`;
    } else {
      highlightText = `El valor requerido se encuentra en otro paso de este trámite...`;
    }
  }

  /*if (!participantData.html._body) {
    return (
      <div>
        <p>No se ha configurado el contenido de HTML de la vista previa asociada al formulario</p>
      </div>
    );
  }*/

  return (
    <>
      {viewForm === 1 ? (
        <FormSignature documento={documento} onResult={onResult} handleBack={handleBack} canGoBack={canGoBack} />
      ) : (
        ""
      )}

      {viewForm === 2 ? (
        <JustForm
          documento={documento}
          jsonSchema={jsonSchema}
          uiSchema={uiSchema}
          handleSubmit={handleSubmit}
          log={log}
          formData={formData}
          setFormData={setFormData}
          RJSF_PREFIX={RJSF_PREFIX}
          handleBack={handleBack}
          canGoBack={canGoBack}
        />
      ) : (
        ""
      )}

      {viewForm === 3 ? (
        <FromAndDoc
          documento={documento}
          jsonSchema={jsonSchema}
          uiSchema={uiSchema}
          handleSubmit={handleSubmit}
          log={log}
          formData={formData}
          setFormData={setFormData}
          RJSF_PREFIX={RJSF_PREFIX}
          focusHandler={focusHandler}
          highlightText={highlightText}
          clickHandler={clickHandler}
          htmlForm={htmlForm}
          handleBack={handleBack}
          canGoBack={canGoBack}
        />
      ) : (
        ""
      )}
    </>
  );
}
