'use strict'

import React, {useEffect} from 'react';

const useAsyncFetch = function(url, data, props_month, props_year, options, thenFunc, catchFunc) {
  console.log("in useAsyncFetch");

  async function fetchData(url, data) {
    let params = {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(data)};
    
    console.log(params);
    let response = await fetch(url, params);

    let json = await response.json();

    console.log(json);
    thenFunc(json);
  }

  console.log("calling fetch");

  //fetchData(url, data);

  useEffect(function() {
    console.log("calling fetch");
    fetchData(url, data);
  }, []);

  useEffect(function() {
    console.log("calling fetch update");
    fetchData(url, data);
  }, [props_month, props_year]);
 
}


export default useAsyncFetch;