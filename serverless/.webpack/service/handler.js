(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("stream-chat");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("uuid/v4");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var stream_chat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var stream_chat__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(stream_chat__WEBPACK_IMPORTED_MODULE_2__);




exports.init = async event => {
  try {
    const data = JSON.parse(event.body);
    const client = new stream_chat__WEBPACK_IMPORTED_MODULE_2__["StreamChat"](process.env.STREAM_KEY, process.env.STREAM_SECRET);
    const user = Object.assign({}, data, {
      id: uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()(),
      role: 'admin'
    });
    const token = client.createToken(user.id);
    await client.updateUsers([user, {
      id: 'chuck',
      name: 'Chuck Norris',
      role: 'admin'
    }]);
    return {
      statusCode: 200,
      body: JSON.stringify({
        user,
        token
      })
    };
  } catch (error) {
    return error;
  }
};

exports.reply = async event => {
  const data = JSON.parse(event.body);

  try {
    if (data.message.user.id === 'chuck' || data.type !== 'message.new') {
      return {
        statusCode: 200
      };
    }

    const client = new stream_chat__WEBPACK_IMPORTED_MODULE_2__["StreamChat"](process.env.STREAM_KEY, process.env.STREAM_SECRET);
    const cid = data.cid.split(':');
    const channel = client.channel(cid[0], cid[1]);
    const joke = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get('https://api.chucknorris.io/jokes/random');
    await channel.sendMessage({
      text: joke.data.value,
      user: {
        id: 'chuck',
        name: 'Chuck Norris'
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify(joke.data)
    };
  } catch (error) {
    return error;
  }
};

/***/ })
/******/ ])));
//# sourceMappingURL=handler.js.map