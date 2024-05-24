/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import PreviewComponent from "../../../opinion-form/questions/preview";

function PreviewFormTemplateComponent(props) {
  const { data } = props;

  return <div>{data && <PreviewComponent list={data.questions} />}</div>;
}

export default PreviewFormTemplateComponent;
