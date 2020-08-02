import sum from 'hash-sum';
import { cachedResponses, scrollIdTimeout } from './stores.js';

let myCachedResponses;

let r = cachedResponses.subscribe((value) => { myCachedResponses = value });

const apiPath = '__BACKEND_PROXY_PATH__/search';

export default async function runRequest(body, cache=true) {
  let hash = sum(body);
  if (cache && myCachedResponses[hash]) {
    if ((Date.now() - myCachedResponses[hash].date) < scrollIdTimeout) {
      return myCachedResponses[hash].response;
    }
  }
  const response = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
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
