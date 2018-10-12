'use strict';

class Api {

  constructor(path, baseUrl = window.location.origin) {
    this.baseUrl = baseUrl;
    this.path = path;
  }

  _buildUrl(path, query = {}) {
    var url = new URL(path, this.baseUrl);

    const queryKeys = Object.keys(query);
    queryKeys.forEach(key => url.searchParams.set(key, query[key]));

    return url;
  }

  _normalizeResponseErrors(res) {
    if (!res.ok) {
      if (
        res.headers.has('content-type') &&
        res.headers.get('content-type').startsWith('application/json')
      ) {
        return res.json().then(err => Promise.reject(err));
      }
      return Promise.reject({
        status: res.status,
        message: res.statusText
      });
    }
    return res;
  }

  create(document) {
    const url = this._buildUrl(this.path);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: document ? JSON.stringify(document) : null
    }).then(this._normalizeResponseErrors)
      .then(res => res.json());
  }

  search(query) {
    const url = this._buildUrl(this.path, query);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(this._normalizeResponseErrors)
      .then(res => res.json());
  }  

  details(id) {
    const url = this._buildUrl(`${this.path}/${id}`);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(this._normalizeResponseErrors)
      .then(res => res.json());
  }

  replace(id, obj) {
    const url = this._buildUrl(`${this.path}/${id}`);

    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: obj ? JSON.stringify(obj) : null
    }).then(this._normalizeResponseErrors)
      .then(res => res.json());
  }

  update(id, obj) {
    const url = this._buildUrl(`${this.path}/${id}`);

    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: obj ? JSON.stringify(obj) : null
    }).then(this._normalizeResponseErrors)
      .then(res => res.json());
  }

  remove(id) {
    const url = this._buildUrl(`${this.path}/${id}`);

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    }).then(this._normalizeResponseErrors)
      .then(res => res.text());
  }
  
}
