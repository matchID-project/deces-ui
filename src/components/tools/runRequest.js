import sum from 'hash-sum';
import { cachedResponses, apiVersion } from './stores.js';

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
    return myCachedResponses[hash];
  }
  const response = await fetch(apiPath(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  if (response.status >= 400) {
    return {
      hits: {
        total: {
          value: 1
        },
        hits: [
          {
            _id: 0,
            _source: {
              status: response.status,
              statusText: response.statusText,
              error: true
            }
          }
        ]
      }
    };
  } else {
    let json = await response.json();
    if (myApiVersion === 'backend') {
      json = json.msg;
    }
    cachedResponses.update(v => { v[hash]=json; return v } );
    return json;
  }
};
