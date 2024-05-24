// Copyright (c) 2017 PlanGrid, Inc.

import React from 'react';

import '../styles/error.scss';

const Error = props => (
  <div className="error-message">
    {props.errorComponent
      ? <props.errorComponent {...props} />
      : <p className="alert">File tải lên bị lỗi vui lòng liên hệ với admin để trợ giúp</p>}
  </div>
);

export default Error;
