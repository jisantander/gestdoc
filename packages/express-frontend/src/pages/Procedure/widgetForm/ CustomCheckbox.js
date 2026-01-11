import Popover from "./Popover";

const CustomCheckbox = function (props) {
  return (
    <div style={{ display: "inline-flex" }}>
      <div className="form__element">
        <label>
          <input
            type="checkbox"
            name="#ejemplo-checkbox"
            checked={props.value ? true : false}
            value={props.value ? true : false}
            onClick={() => props.onChange(!props.value)}
          />
          <div style={{ display: "inline-flex" }}>{props.label}</div>
        </label>
      </div>
      <label className="label_gestdoc" style={{ display: "inline-flex", marginTop: 9, marginLeft: 6 }}>
        {props.required && <span>*</span>}
        {props.options?.help && <Popover msg={props.options.help} title={props.label} />}
      </label>
    </div>
  );
};

export default CustomCheckbox;

/*
  <button id="custom" className={props.value ? "checked" : "unchecked"} onClick={() => props.onChange(!props.value)}>
            {String(props.value)}
        </button>
        <div class="form__element">
            <label>
                <input type="checkbox" name="#ejemplo-checkbox" value="1">Lorem ipsum
            </label>
        </div>
*/
