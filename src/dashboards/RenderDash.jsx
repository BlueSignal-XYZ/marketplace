import React, { useEffect, useState } from "react";
import { Dash } from "../components";
import { dashDataInit } from "../components/dash.data";
import {useAppContext} from "../context/AppContext";

const RenderDash = ({ route }) => {
  const { STATES } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userDashes, setUserDashes] = useState(null);
  const [dashData, setDashData] = useState(null);
  const { user, searchResults } = STATES || {};
  const { uid } = user || {};

  // dashboard data loaded

  useEffect(() => {
    if (uid) {
      init()
    }
  }, [uid]);

  useEffect(() => {
    if (route && !searchResults) {
      const userDash = userDashes?.[route];
      if (userDash) {
        setDashData(userDash);
      }
    } else if (searchResults) {
      setDashData(searchResults);
    }
  }, [route, userDashes, searchResults]);

  const init = async () => {
    setIsLoading(true);
    try {
      setUserDashes(await dashDataInit(uid));
    } catch (error) {
      setError(error?.message || "Error Loading Data")
    } finally {
      setIsLoading(false);
    }
  }

  if(isLoading){
    <p>Loading...</p>
  }

  if(error){
    return <p style={{color: 'red'}}>{error}</p>
  }

  if (!dashData) {
    return <p>Dashboard Not Available</p>
  }

  return <Dash dashData={dashData} />;
};

export default RenderDash;
