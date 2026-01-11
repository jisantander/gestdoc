import React, { Component } from "react";
import PropTypes from "prop-types";
import Popover from "./Popover";
import AttachFile from "@material-ui/icons/AttachFile";
import { Button } from "@material-ui/core";

import { dataURItoBlob, shouldRender } from "@rjsf/core/lib/utils";

function addNameToDataURL(dataURL, name) {
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
}

function processFile(file) {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      resolve({
        dataURL: addNameToDataURL(event.target.result, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}

function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}

function FilesInfo(props) {
  const { filesInfo } = props;
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <ul
      className="file-info"
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      {filesInfo.map((fileInfo, key) => {
        const { name } = fileInfo;
        return (
          <li key={key} style={{ color: "#fff" }}>
            <label className="label_gestdoc" style={{ display: "inline-flex", marginTop: 5 }}>
              {name}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function extractFileInfo(dataURLs) {
  return dataURLs
    .filter((dataURL) => typeof dataURL !== "undefined")
    .filter((dataURL) => dataURL.substr(0, 5) !== "https")
    .map((dataURL) => {
      try {
        const { blob, name } = dataURItoBlob(dataURL);
        return {
          name: name,
          size: blob.size,
          type: blob.type,
        };
      } catch (e) {
        return [];
      }
    });
}

class FileWidget extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    const values = Array.isArray(value) ? value : [value];
    this.state = { values, filesInfo: extractFileInfo(values) };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onChange = (event) => {
    const { multiple, onChange } = this.props;
    processFiles(event.target.files).then((filesInfo) => {
      const state = {
        values: filesInfo.map((fileInfo) => fileInfo.dataURL),
        filesInfo,
      };
      this.setState(state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });
  };

  render() {
    const { multiple, rawErrors, id, readonly, disabled, autofocus, options, label, placeholder, required } =
      this.props;
    const { filesInfo } = this.state;
    return (
      <>
        <label className="label_gestdoc" style={{ display: "inline-flex" }}>
          {label}
          {required && <span style={{ fontSize: 13 }}>*</span>}
          {options?.help && <Popover msg={options.help} title={label} />}
        </label>

        <div className="fileWidget">
          <div style={{ display: "inline-flex" }}>
            <p style={{ display: "flex" }}>
              <label htmlFor={id}>
                <input
                  style={{ display: "none" }}
                  ref={(ref) => (this.inputRef = ref)}
                  id={id}
                  name={id}
                  type="file"
                  disabled={readonly || disabled}
                  onChange={this.onChange}
                  defaultValue=""
                  autoFocus={autofocus}
                  multiple={multiple}
                  accept={options.accept}
                />
                <Button style={{ backgroundColor: "rgb(241 244 251)" }} variant="contained" component="span">
                  <AttachFile /> {placeholder}
                </Button>{" "}
              </label>
            </p>
            <div
              style={{
                marginLeft: 19,
                marginTop: 6,
              }}
            ></div>
          </div>

          <FilesInfo filesInfo={filesInfo} />
        </div>
        <span className="error">{rawErrors && rawErrors.join(", ").toString()}</span>
      </>
    );
  }
}

FileWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  FileWidget.propTypes = {
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    autofocus: PropTypes.bool,
  };
}

export default FileWidget;
