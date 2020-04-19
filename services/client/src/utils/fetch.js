import 'whatwg-fetch';
import fetchIntercept from 'fetch-intercept';
import React from 'react';
import Modal from 'reactstrap/lib/Modal';
import ReactDOM from 'react-dom';
import {stringify} from 'query-string';

// Overriding fetch defaults like the crsf token, including the rootContext and sending the cookie
/* istanbul ignore next */
fetchIntercept.register({
  request: (url, config = {})=>{
    config = {
      ...config,
      headers: {
        ...config.headers
      },
      //fetch doesn't include the cookie by default
      credentials: 'include'
    };

    if(config.params)
      url += `?${stringify(config.params,{strict: false, encode: false})}`;

    let isFormDataObject = config.body instanceof FormData;
    if(config.body && !isFormDataObject){
      //automatically set headers if the body is JSON
      try{
        //TODO fix Babel issue where JSON.stringify can't be called globally
        config.body = window.JSON.stringify(config.body);
        config.headers = {
          ...config.headers,
          'Content-Type': 'application/json'
        };
      }catch(error){console.warn('Tried to stringify non json data')}
    }
    return [url, config];
  },

  requestError: (error)=>{
    return Promise.reject(error);
  },

  response: (response)=>{
    if ([302, 403, 0].includes(response.status)) {
      const mountNode = document.createElement('div');
      document.body.appendChild(mountNode);
      ReactDOM.render(<RedirectModal />, mountNode);
    }
    return parseResponse(response);
  }
});

/*
  by default fetch doesn't parse the stream into a json/text body.
  We'll rely on the server headers to parse the request. For other MIME types
  you will have to handle it yourself.
*/
export const parseResponse = (response)=>{
  return new Promise((resolve,reject)=>{
    (async ()=>{
      let body;
      let contentType = response.headers.get('Content-Type') || '';

      try{
        if (contentType.includes('application/json')) {
          body = response.json();
        }else if(contentType.includes('text/')){
          body = response.text();
        }
        let responseBody = await body;
        response.entity = responseBody;

      }catch(error){
        console.warn('Unable to parse the request, server might\'ve sent mismatching headers', error);
      }finally{
        response.status >= 200 && response.status < 300? resolve(response) : reject(response);
      }
    })();
  });
};


export const RedirectModal = (props)=>(
  <div className='static-modal'>
    <Modal
      enforceFocus={false}
      backdrop
      show
    >
      <Modal.Header>Error</Modal.Header>
      <Modal.Body>
        <h3>Your session either has expired or you do not have permission for this request.</h3>
      </Modal.Body>
      <Modal.Footer>
        <a href={window.__rootContext || '/'} className='btn btn-primary'>OK</a>
      </Modal.Footer>
    </Modal>
  </div>
);
