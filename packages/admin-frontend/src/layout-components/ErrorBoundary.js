import React from "react";

import imgError from "../assets/error_500.png";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "..." };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.toString() };
  }
  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.error(errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: "#fff",
            height: "100vh",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1>Hubo un error en el sistema!</h1>
          <span>Nuestro equipo está trabajando en descubrir el problema.</span>
          {this.state.message !== "" ? <p>{this.state.message}</p> : null}
          <p>Habrá la consola de desarrollador para encontrar más información del error</p>
          <br />
          <img src={imgError} style={{ width: "70vh" }} alt="Imagen de error" />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
