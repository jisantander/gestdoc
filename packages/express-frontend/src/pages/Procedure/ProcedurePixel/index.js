import React from "react";
import { useLocation } from "react-router-dom";

import ProcedurePixelInvite from "./ProcedurePixelInvite";
import ProcedurePixelValidate from "./ProcedurePixelValidate";

export default function ProcedurePixel({ canGoBack, handleBack }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pixel = params.get("p");
  if (pixel) {
    return <ProcedurePixelValidate canGoBack={canGoBack} handleBack={handleBack} />;
  }
  return <ProcedurePixelInvite canGoBack={canGoBack} handleBack={handleBack} />;
}
