import sum from 'hash-sum';
import { cachedResponses, apiVersion, scrollIdTimeout } from './stores.js';

let myCachedResponses;
let myApiVersion;

let r = cachedResponses.subscribe((value) => { myCachedResponses = value });
let a = apiVersion.subscribe((value) => { myApiVersion = value });

const apiPath = () => {
  return myApiVersion === 'backend' ? '__BACKEND_PROXY_PATH__/search' : '__ES_PROXY_PATH__';
}

export default async function runRequest(body) {
  console.log(`AB_THRESHOLD=__AB_THRESHOLD__ runRequest to ${myApiVersion} ${JSON.stringify(body)}`);
  let hash = sum(body);
  if (myCachedResponses[hash]) {
    if ((Date.now() - myCachedResponses[hash].date) < scrollIdTimeout) {
      return myCachedResponses[hash];
    }
  }
  const response = await fetch(apiPath(), {
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
