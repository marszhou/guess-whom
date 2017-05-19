var Promise = require('bluebird');
var request = require('superagent');
var _ = require('lodash');

var __CORS_SUP = ('XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest());

class Request {
  constructor(baseUrl, version = '') {
    this._baseUrl = baseUrl
    this._headers = {}
    this._version = version
    this._errorCallbacks = []
    this._timer = null
  }

  /**
   * get
   * 发起GET请求
   *
   * @param string url
   * @param object options
   * @return promise | superagent request
   */
  get(url, options) {
    return this._request('get', url, options);
  }

  /**
   * post
   * 发起POST请求
   *
   * @param string url
   * @param object options
   * @return promise | superagent request
   */
  post(url, options) {
    return this._request('post', url, options);
  }

  /**
   * put
   * 发起PUT请求
   *
   * @param string url
   * @param object options
   * @return promise | superagent request
   */
  put(url, options) {
    return this._request('put', url, options);
  }

  /**
   * del
   * 发起DELETE请求
   *
   * @param string url
   * @param object options
   * @return promise | superagent request
   */
  del(url, options) {
    return this._request('del', url, options);
  }

  /**
   * addHeaders
   * 添加所有请求的公共HTTP Header
   *
   * @param object headers
   * @return undefined
   */
  addHeaders(headers) {
    for (var name in headers) {
      if (headers.hasOwnProperty(name)) {
        this._headers[name] = headers[name];
      }
    }
  }

  addErrorCallback(callback) {
    this._errorCallbacks.push(callback);
  }

  /**
   * setBaseUrl
   * 设置请求地址
   *
   * @param  string url
   * @return undefined
   */
  setBaseUrl(url) {
    this._baseUrl = url;
  }

  /**
   * setVersion
   * 设置版本号
   *
   * @param  string version
   * @return undefined
   */
  setVersion(version) {
    this._version = version;
  }

  /**
   * _request
   *
   * @param string method
   * @param string url
   * @param object options
   * @return promise | superagent request
   */
  _request(method, url, options) {

    var req, baseUrl, version;

    var _url = url;

    if (!options) {
      options = {};
    }

    if (options.baseUrl) {
      baseUrl = options.baseUrl;
    } else {
      baseUrl = this._baseUrl;
    }

    if (options.version) {
      version = options.version;
    } else {
      version = this._version;
    }

    baseUrl = _.trim(baseUrl, '/');
    version = _.trim(version, '/');
    url = _.trim(url, '/');
    // 有的接口没有version
    if (version) {
      url = baseUrl + '/' + version + '/' + url;
    } else {
      url = baseUrl + '/' + url;
    }

    req = request[method](url);
    req.set(this._headers);

    if (!options.headers) {
      options.headers = {};
    } else {
      req.set(options.headers);
    }

    if (options.query) {
      req.query(options.query);
    }

    if (options.files) {
        options.files.forEach(function(file) {
          req.attach(file.name, file.data);
        });
        for (var key in options.body) {
          req.field(key, options.body[key]);
        }
    } else if (options.body) {
      req.send(options.body);
    }

    if (options.request === true) {
      req.withCredentials();
      req.end(options.callback);
      return req;
    }

    var self = this;

    var promise = new Promise(function(resolve, reject) {
      req.withCredentials();

      req.end(function(err, res) {
        if (err) {

          if (!err.response && err.crossDomain) {
            err.message = '请求失败，请检查您的网络连接';
          }

          reject(err.response ? err.response.body : err);
        } else {
          resolve(res.body);
        }
      });
    });

    var errorCallbackLength = this._errorCallbacks.length;
    var _this = this;
    if (errorCallbackLength > 0) {
      for (var i = 0; i < errorCallbackLength; i++) {
        promise.error(_this._errorCallbacks[i]);
      }
    }

    return promise;
  }
}

module.exports = new Request('http://localhost:8080')
