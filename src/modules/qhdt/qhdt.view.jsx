import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { UrlCollection } from '../../common/url-collection';

export const QHDT = () => {
  const history = useHistory();

  useEffect(() => {
    history.push(UrlCollection.PlanningAnnouncementProcess);
  }, [])
  return <div></div>
}