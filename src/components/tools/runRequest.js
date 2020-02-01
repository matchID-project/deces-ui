import sum from 'hash-sum';
import { cachedResponses } from './stores.js';

let myCachedResponses;

let r = cachedResponses.subscribe((value) => { myCachedResponses = value });

export default async function runRequest(body) {
  let hash = sum(body);
  if (myCachedResponses[hash]) {
    return myCachedResponses[hash];
  }
  const response = await fetch('__ES_PROXY_PATH__', {
    method: "POST",
    headers: { "content-type": "application/json" },
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
    let json = response.json();
    cachedResponses.update(v => { v[hash]=json; return v } );
    return json;
  }
};
