import sum from 'hash-sum';
import { cachedResponses, scrollIdTimeout } from './stores.js';

let myCachedResponses;

let r = cachedResponses.subscribe((value) => { myCachedResponses = value });

const apiSearchPath = '__BACKEND_PROXY_PATH__/search';
const apiIdPath = '__BACKEND_PROXY_PATH__/id';

export const runSearchRequest = async (body, cache=true) => {
  return await runRequest(apiSearchPath, 'POST', body, cache);
};

export const runIdRequest = async (id, cache=true) => {
  return await runRequest(apiIdPath, 'GET', id, cache);
};

const runRequest = async (apiPath, method, request, cache=true) => {
  let hash = sum(request);
  if (cache && myCachedResponses[hash]) {
    if ((Date.now() - myCachedResponses[hash].date) < scrollIdTimeout) {
      return myCachedResponses[hash].response;
    }
  }
  const response = await fetch(`${apiPath}${method === 'GET' ? '/' + request : ''}`,
    method === "POST" ? {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    } : { method: 'GET'});
  if (response.status >= 400) {
    let json;
    try {
       json = await response.json();
    } catch(error) {
      console.log('response json error', error);
    }
    return {
      response: {
        total: 1,
        persons: [
          {
            error: true,
            status: response.status,
            statusText: response.statusText,
            msg: json && json.msg
          }
        ]
      }
    };
  } else {
    let json = await response.json();
    cachedResponses.update(v => { v[hash]={date: Date.now(), response: json}; return v } );
    return json;
  }
};
