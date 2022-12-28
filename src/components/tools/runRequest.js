import sum from 'hash-sum';
import { cachedResponses, accessToken, scrollIdTimeout } from './stores.js';

let myCachedResponses;
let myAccessToken;

cachedResponses.subscribe((value) => { myCachedResponses = value });
accessToken.subscribe((value) => { myAccessToken = value });

const fullApiPath = (api) => {
  return `__BACKEND_PROXY_PATH__/${api}`;
}

export const runSearchRequest = async (body, cache=true) => {
  return await runRequest('search', 'POST', body, cache);
};

export const runCompareRequest = async (body, cache=true) => {
  return await runRequest('compare', 'POST', body, cache);
};

export const runSearchStreamRequest = async (body, cache=true) => {
  return await runRequest('search', 'POST', body, cache, 'csvStream');
};

export const runAggregationRequest = async (body, cache=true) => {
  return await runRequest('agg', 'POST', body, cache, 'csvStream');
};

export const runIdRequest = async (id, cache=true) => {
  return await runRequest('id', 'GET', id, cache);
};

const runRequest = async (api, method, request, cache=true, responseType = 'json') => {
  let hash = sum(api + JSON.stringify(request));
  if (cache && myCachedResponses[hash]) {
    if ((Date.now() - myCachedResponses[hash].date) < scrollIdTimeout) {
      return myCachedResponses[hash].response;
    }
  }
  const apiPath = fullApiPath(api);
  const headers = {
    "Content-Type": "application/json",
    "Accept": (responseType === 'json') ? "application/json": "text/csv"
  };
  if (myAccessToken) {
    headers.Authorization = `Bearer ${myAccessToken}`;
  }

  const response = await fetch(`${apiPath}${method === 'GET' ? '/' + request : ''}`,
    method === "POST" ? {
      method: "POST",
      headers: headers,
      body: JSON.stringify(request)
    } : { method: 'GET'});
  if (response.status >= 400) {
    if (responseType === 'json') {
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
      return response;
    }
  } else {
    if (responseType === 'json') {
      let json = await response.json();
      cachedResponses.update(v => { v[hash]={date: Date.now(), response: json}; return v } );
      return json;
    } else if (responseType === 'csvStream') {
      if (response.body) {
        const reader = response.body.getReader();
        let streamCache = '';
        const decoder = new TextDecoder("utf-8");
        const stream = new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                // Is there no more data to read?
                if (done) {
                  // Tell the browser that we have finished sending data
                  controller.close();
                  cachedResponses.update(v => { v[hash]={date: Date.now(), response: streamCache}; return v } );
                  return;
                }
                // Get the data and send it to the browser via the controller
                streamCache += decoder.decode(value);
                controller.enqueue(value);
                push();
              });
            }
            push();
          }
        });
        stream.headers = response.headers
        return stream;
        } else {
          const streamCache = await response.text();
          cachedResponses.update(v => { v[hash]={date: Date.now(), response: streamCache}; return v } );
          return streamCache;
      }
    }
  }
};
