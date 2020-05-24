/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/typescript/options.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../crossfoam-data/dst/index.js":
/*!***************************!*\
  !*** .-data/dst/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(/*! @crossfoam/utils */ "../crossfoam-data/node_modules/@crossfoam/utils/dst/index.js");
var get = function (key, defaultValue) {
    return browser.storage.local.get(key).then(function (data) {
        if (data && data !== null && data !== undefined && !utils_1.objEmpty(data)) {
            if (typeof data === "object" && key in data) {
                return data[key];
            }
            return data;
        } else if (defaultValue) {
            return set(key, defaultValue);
        } else {
            return null;
        }
    });
};
exports.get = get;
var set = function (key, value) {
    var _a;
    return browser.storage.local.set((_a = {}, _a[key] = value, _a)).then(function () {
        if (typeof value === "object" && key in value) {
            return value[key];
        }
        return value;
    });
};
exports.set = set;
var remove = function (key) {
    return browser.storage.local.remove(key);
};
exports.remove = remove;

/***/ }),

/***/ "../crossfoam-data/node_modules/@crossfoam/utils/dst/index.js":
/*!*********************************************************!*\
  !*** .-data/node_modules/@crossfoam/utils/dst/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var throttle = function (t) {
    return new Promise(function (resolve) {
        setTimeout(resolve, t);
    });
};
exports.throttle = throttle;
// inspired by uuid v4 (shortened) https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
/* tslint:disable:no-bitwise */
var uuid = function () {
    return "xxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
exports.uuid = uuid;
/* tslint:enable:no-bitwise */
var formatDate = function (date, withTime) {
    if (withTime === void 0) { withTime = false; }
    // TODO: Language based formatting of dates
    var lang = "en";
    switch (lang) {
        case "de":
            return dateNull(date.getDate())
                + "." + dateNull((date.getMonth() + 1))
                + "." + dateNull(date.getFullYear())
                + ((withTime) ? " " + dateNull(date.getHours()) + ":" + dateNull(date.getMinutes()) : "");
            break;
        default:
            return dateNull(date.getFullYear())
                + "/" + dateNull((date.getMonth() + 1))
                + "/" + dateNull(date.getDate())
                + ((withTime) ? " " + dateNull(date.getHours()) + ":" + dateNull(date.getMinutes()) : "");
            break;
    }
};
exports.formatDate = formatDate;
var dateNull = function (num) {
    return (num < 10) ? "0" + num : "" + num;
};
var cleanNumber = function (duration) {
    if (duration === Math.floor(duration)) {
        return duration;
    }
    else if (parseFloat(duration.toFixed(1)) === parseFloat(duration.toFixed(2))) {
        return duration.toFixed(1);
    }
    else {
        return duration.toFixed(2);
    }
};
var formatDuration = function (duration) {
    duration = duration / 1000;
    if (duration < 60) {
        return Math.floor(duration) +
            " " + browser.i18n.getMessage("secondsShort");
    }
    else {
        duration = duration / 60;
        if (duration < 60) {
            return cleanNumber(duration) +
                " " + browser.i18n.getMessage("minutesShort");
        }
        else {
            duration = duration / 60;
            if (duration < 24) {
                return cleanNumber(duration) +
                    " " + browser.i18n.getMessage("hoursShort");
            }
            else {
                duration = duration / 24;
                return cleanNumber(duration) +
                    " " + browser.i18n.getMessage("daysShort");
            }
        }
    }
};
exports.formatDuration = formatDuration;
var objEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
exports.objEmpty = objEmpty;
var downloadFile = function (fileData, fileType, fileName) {
    var file = new Blob([fileData], {
        type: fileType,
    });
    return browser.downloads.download({
        // window.URL ??
        filename: fileName,
        saveAs: true,
        url: URL.createObjectURL(file),
    }).then(function (downloadId) {
        return Promise.resolve();
    }).catch(function (error) {
        throw new Error("Download failed. " + JSON.stringify(error));
    });
};
exports.downloadFile = downloadFile;
var debounce = function (func, wait, immediate) {
    if (wait === void 0) { wait = 200; }
    if (immediate === void 0) { immediate = false; }
    var timeout = null;
    var again = false;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callNow = immediate && timeout === null;
        var next = function () { return func.apply(null, args); };
        if (timeout === null) {
            timeout = setTimeout(function () {
                timeout = null;
                if (again) {
                    next();
                    again = false;
                }
            }, wait);
        }
        else {
            again = true;
        }
        if (callNow) {
            next();
        }
    };
};
exports.debounce = debounce;


/***/ }),

/***/ "../crossfoam-service-twitter/config.js":
/*!***********************************!*\
  !*** .-service-twitter/config.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  "api_key": "kePD9gflNGY9JgDgvObYkZqI4",
  "api_secret": "gNbCOEvQpfOX8s3toKJUZLGzyDwttsl0yuki43NeCNZiokT5Y5",
  "auth": true,
  "service_name": "Twitter",
  "service_key": "twitter",
  "queue_functions": [{ "name": "getUser", "paramCount": [1, 1], "skip": false, "passDown": true, "timeout": 60000 }, { "name": "getUsers", "paramCount": [2, 2], "skip": true, "passDown": true, "timeout": 1000 }, { "name": "getFriendsIds", "paramCount": [5, 5], "skip": true, "passDown": true, "timeout": 60000 }, { "name": "getFriends", "paramCount": [5, 5], "skip": true, "passDown": true, "timeout": 60000 }],
  "regex": /http[s]*:\/\/[wwww.]*twitter\.com\/((?!(settings|hashtag|status|hashtags|explore|notifications|messages|home|compose|search|tos))[^\/]{3,})/,
  "regex_exclude": /http[s]*:\/\/[wwww.]*twitter\.com\/([^\/]{3,})\/(status|followers_you_follow|following|followers)/
});

/***/ }),

/***/ "../crossfoam-service-twitter/dst/index.js":
/*!**************************************!*\
  !*** .-service-twitter/dst/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cfData = __webpack_require__(/*! @crossfoam/data */ "../crossfoam-service-twitter/node_modules/@crossfoam/data/dst/index.js");
var config_js_1 = __webpack_require__(/*! ../config.js */ "../crossfoam-service-twitter/config.js");
exports.config = config_js_1.default;
// Allow content_scripts to include the services module without codebird
var cb;
if (typeof Codebird === "function") {
    cb = new Codebird();
    cb.setUseProxy(false);
    cb.setConsumerKey(config_js_1.default.api_key, config_js_1.default.api_secret);
}
var requestTokenKey = "twitter--request-token";
var authTokenKey = "twitter--auth-token";
var authRequired = function () {
    return cfData.get(authTokenKey).then(function (value) {
        if (value && value !== undefined && "oauth_token" in value) {
            return testAuth(value);
        } else {
            return true;
        }
    });
};
exports.authRequired = authRequired;
var asyncAuthRequired = function () {
    return __awaiter(void 0, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, authRequired()];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r];
            }
        });
    });
};
var testAuth = function (data) {
    cb.setToken(data.oauth_token, data.oauth_token_secret);
    return cb.__call("account_verifyCredentials", {}).then(function (result) {
        if ("reply" in result && "httpstatus" in result.reply && result.reply.httpstatus === 200) {
            return false;
        }
        return true;
    });
};
var createOptions = function (htmlContainer) {
    authRequired().then(function (required) {
        if (required) {
            htmlContainer.innerHTML = "<p>" + browser.i18n.getMessage("servicesTwitterAuthorizeNote") + "</p><br /><button id='twitter--auth-button'>" + browser.i18n.getMessage("servicesTwitterAuthorize") + "</button>";
            document.getElementById("twitter--auth-button").addEventListener("click", function () {
                auth(htmlContainer);
            });
        } else {
            htmlContainer.innerHTML = browser.i18n.getMessage("servicesTwitterAuthorized");
        }
    }).catch(function (err) {
        throw err;
    });
};
exports.createOptions = createOptions;
var cbCall = function (endpoint, params) {
    // TODO: Check if authentication is still valid, otherwise throw error
    return cfData.get(authTokenKey).then(function (data) {
        cb.setToken(data.oauth_token, data.oauth_token_secret);
        return cb.__call(endpoint, params);
    });
};
var cbErrorHandling = function (result) {
    if ("errors" in result.reply && result.reply.errors.length >= 1 || "error" in result.reply) {
        if ("errors" in result.reply && result.reply.errors[0].message === "Not authorized." || result.reply.httpstatus === 401 || "errors" in result.reply && "code" in result.reply.errors[0] && result.reply.errors[0].code === 89 || "error" in result.reply && result.reply.error === "Not authorized.") {
            var isAuthRequired = asyncAuthRequired();
            if (isAuthRequired) {
                return "auth";
            } else {
                return "again";
            }
        } else if ("errors" in result.reply && result.reply.errors[0].code === 88) {
            return "again";
        } else {
            throw new Error(JSON.stringify(result));
            return "again";
        }
    } else if (result.reply.httpstatus === 0) {
        return "again";
    } else {
        return "good";
    }
};
/*
 * The auth function handles the authentication, if required
 * If any interaction between the options page the authentication is required
 * the html_container element is a div, allowing the modul to embed interactions
 * The data object gives access to the data storage functionalities
 */
var auth = function (htmlContainer) {
    return cb.__call("oauth_requestToken", { oauth_callback: "oob" }).then(function (reply) {
        return cfData.set(requestTokenKey, reply.reply);
    }).then(function (requestToken) {
        cb.setToken(requestToken.oauth_token, requestToken.oauth_token_secret);
        return cb.__call("oauth_authorize", {});
    }).then(function (authUrl) {
        return browser.tabs.create({ url: authUrl.reply });
    }).then(function () {
        // Modify the html add a click listener with connection to new function
        htmlContainer.innerHTML = "<p>" + browser.i18n.getMessage("servicesTwitterAuthorizeNote") + "</p><br />              <input                 type='text'                 placeholder='Twitter PIN'                 id='twitter--auth-pin' />              <button                 id='twitter--auth-button'>                " + browser.i18n.getMessage("servicesTwitterAuthorizeFinish") + "              </button>";
        document.getElementById("twitter--auth-button").addEventListener("click", function () {
            var value = document.getElementById("twitter--auth-pin").value;
            if (value && value.length === 7) {
                auth2(htmlContainer, value);
            } else {
                alert(browser.i18n.getMessage("servicesTwitterAuthAlert"));
            }
        });
    });
};
exports.auth = auth;
var auth2 = function (htmlContainer, pin) {
    return cb.__call("oauth_accessToken", { oauth_verifier: pin }).then(function (reply) {
        cfData.set(authTokenKey, reply.reply);
        htmlContainer.innerHTML = browser.i18n.getMessage("servicesTwitterAuthorized");
    });
};
var getBiggerPicture = function (url) {
    var search = "normal";
    var replace = "bigger";
    var position = url.lastIndexOf(search);
    if (position > 0) {
        url = url.substr(0, position) + replace + url.substr(position + search.length);
    }
    return url;
};
var getUser = function (screenName, timestamp, uniqueID, queue) {
    return cbCall("users_show", {
        screen_name: screenName
    }).then(function (result) {
        var errorAnalysis = cbErrorHandling(result);
        if (errorAnalysis === "again") {
            queue.call(config_js_1.default.service_key + "--getUser", [screenName], timestamp, uniqueID);
            return Promise.resolve();
        } else if (errorAnalysis === "auth") {
            console.log("AAAAHHHHH auth me!");
        } else {
            return cfData.get("s--" + config_js_1.default.service_key + "--nw--" + screenName, {}).then(function (networkObject) {
                var nUuid = uniqueID;
                networkObject[nUuid] = {
                    callCount: null,
                    completeCount: 0,
                    date: Date.now(),
                    lastUpdated: Date.now(),
                    screenName: screenName,
                    state: "queuing"
                };
                return cfData.set("s--" + config_js_1.default.service_key + "--nw--" + screenName, networkObject).then(function () {
                    return cfData.set("s--" + config_js_1.default.service_key + "--a--" + screenName + "-" + nUuid + "--c", {
                        followers_count: result.reply.followers_count,
                        friends_count: result.reply.friends_count,
                        handle: screenName,
                        id: result.reply.id_str,
                        image: getBiggerPicture(result.reply.profile_image_url_https),
                        name: result.reply.name
                    });
                }).then(function () {
                    queue.call(config_js_1.default.service_key + "--getFriendsIds", [screenName, undefined, screenName, nUuid, -1], timestamp, uniqueID);
                    // queue.call("getFollowersIds", [screenName, true, nUuid, -1]);
                    return Promise.resolve();
                });
            });
        }
    });
};
exports.getUser = getUser;
// The web extension does not support the scraping of protected accounts
// This is implemented on privacy purpose to protect such accounts
var scrapeAble = function (screenName, userId, centralNode, nUuid) {
    return cfData.get("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", {}).then(function (nodes) {
        if (userId in nodes && !nodes[userId].protected) {
            return true;
        } else {
            return false;
        }
    });
};
var getFriendsIds = function (screenName, userId, centralNode, nUuid, cursor, timestamp, uniqueID, queue) {
    // Check if this user is scrape-able
    return scrapeAble(screenName, userId, centralNode, nUuid).then(function (isScrapeAble) {
        if (!isScrapeAble && screenName !== centralNode) {
            return Promise.resolve();
        } else {
            var params = {
                count: 5000,
                cursor: cursor,
                stringify_ids: true
            };
            if (userId === null || userId === undefined || !userId) {
                Object.assign(params, { screen_name: screenName });
            } else {
                Object.assign(params, { user_id: userId });
            }
            return cbCall("friends_ids", params).then(function (result) {
                var errorAnalysis = cbErrorHandling(result);
                if (errorAnalysis === "again") {
                    queue.call(config_js_1.default.service_key + "--getFriendsIds", [screenName, userId, centralNode, nUuid, cursor], timestamp, uniqueID);
                    return Promise.resolve();
                } else if (errorAnalysis === "auth") {
                    console.log("AAAAHHHHH auth me!");
                } else {
                    if (result.reply.ids === null) {
                        // So far not able to figure this out
                        queue.call(config_js_1.default.service_key + "--getFriendsIds", [screenName, userId, centralNode, nUuid, cursor], timestamp, uniqueID);
                        return Promise.resolve();
                    } else {
                        return cfData.get("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", {}).then(function (nodes) {
                            if (screenName === centralNode) {
                                var newNodes_1 = {};
                                result.reply.ids.forEach(function (id) {
                                    newNodes_1[id] = {
                                        followers: [],
                                        followers_count: 0,
                                        friends: [],
                                        friends_count: 0,
                                        handle: null,
                                        image: null,
                                        name: null
                                    };
                                });
                                Object.assign(nodes, newNodes_1);
                            } else {
                                // make sure we don't have duplicates in here...
                                result.reply.ids.forEach(function (newNode) {
                                    if (nodes[userId].friends.indexOf(newNode) === -1) {
                                        nodes[userId].friends.push(newNode);
                                    }
                                });
                            }
                            return cfData.set("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", nodes);
                        }).then(function (savedData) {
                            if (result.reply.next_cursor_str && result.reply.next_cursor_str !== "0" && result.reply.next_cursor_str !== 0
                            // LIMIT the number of friends of friends to 20.000
                            // TODO: move to configs
                            && savedData[userId].friends.length < 20000) {
                                queue.call(config_js_1.default.service_key + "--getFriendsIds", [screenName, userId, centralNode, nUuid, result.reply.next_cursor_str], timestamp, uniqueID);
                                return Promise.resolve();
                            } else {
                                queue.call("network--estimateCompletion", [config_js_1.default.service_key, centralNode, nUuid], timestamp, uniqueID);
                                if (centralNode === screenName) {
                                    queue.call(config_js_1.default.service_key + "--getFriends", [screenName, userId, centralNode, nUuid, -1], timestamp, uniqueID);
                                    return cfData.get("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", {}).then(function (nodes) {
                                        Object.keys(nodes).forEach(function (id) {
                                            queue.call(config_js_1.default.service_key + "--getFriendsIds", [undefined, id, centralNode, nUuid, -1], timestamp, uniqueID);
                                        });
                                        return Promise.resolve();
                                    });
                                } else {
                                    return Promise.resolve();
                                }
                            }
                        });
                    }
                }
            });
        }
    });
};
exports.getFriendsIds = getFriendsIds;
var getFriends = function (screenName, userId, centralNode, nUuid, cursor, timestamp, uniqueID, queue) {
    // Check if this user is scrape-able
    return scrapeAble(screenName, userId, centralNode, nUuid).then(function (isScrapeAble) {
        if (!isScrapeAble && screenName !== centralNode) {
            return Promise.resolve();
        } else {
            var params = {
                count: 200,
                cursor: cursor,
                include_user_entities: false,
                skip_status: true
            };
            if (userId === null || userId === undefined || !userId) {
                Object.assign(params, { screen_name: screenName });
            } else {
                Object.assign(params, { user_id: userId });
            }
            return cbCall("friends_list", params).then(function (result) {
                var errorAnalysis = cbErrorHandling(result);
                if (errorAnalysis === "again") {
                    queue.call(config_js_1.default.service_key + "--getFriends", [screenName, userId, centralNode, nUuid, cursor], timestamp, uniqueID);
                    return Promise.resolve();
                } else if (errorAnalysis === "auth") {
                    console.log("AAAAHHHHH auth me!");
                } else {
                    return cfData.get("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", {}).then(function (nodes) {
                        result.reply.users.forEach(function (user) {
                            if (user.id_str in nodes) {
                                nodes[user.id_str].name = user.name;
                                nodes[user.id_str].handle = user.screen_name;
                                nodes[user.id_str].followers_count = user.followers_count;
                                nodes[user.id_str].friends_count = user.friends_count;
                                nodes[user.id_str].handle = user.screen_name;
                                nodes[user.id_str].image = getBiggerPicture(user.profile_image_url_https);
                                nodes[user.id_str].protected = user.protected;
                            }
                        });
                        return cfData.set("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", nodes);
                    }).then(function () {
                        if (result.reply.next_cursor_str && result.reply.next_cursor_str !== "0" && result.reply.next_cursor_str !== 0) {
                            queue.call(config_js_1.default.service_key + "--getFriends", [screenName, userId, centralNode, nUuid, result.reply.next_cursor_str], timestamp, uniqueID);
                        } else {
                            queue.call("network--estimateCompletion", [config_js_1.default.service_key, centralNode, nUuid]);
                        }
                        return Promise.resolve();
                    });
                }
            });
        }
    });
};
exports.getFriends = getFriends;
var getUsers = function (centralNode, nUuid, timestamp, uniqueID, queue) {
    return Promise.all([cfData.get("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--nw", { proxyKeys: [] }), cfData.get("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", {})]).then(function (data) {
        var query = [];
        var limit = 100;
        var more = false;
        // TODO: this should be relative to the overall size of the core-network
        var proxySizeLimit = 5;
        Object.keys(data[0].proxyKeys).forEach(function (proxy) {
            if (!(proxy in data[1]) && data[0].proxies[data[0].proxyKeys[proxy]][5] > proxySizeLimit) {
                if (query.length < limit) {
                    query.push(proxy);
                } else {
                    more = true;
                }
            }
        });
        if (query.length > 0) {
            var params = {
                user_id: query.join(",")
            };
            return cbCall("users_lookup", params).then(function (result) {
                var errorAnalysis = cbErrorHandling(result);
                if (errorAnalysis === "again") {
                    queue.call(config_js_1.default.service_key + "--getUsers", [centralNode, nUuid], timestamp, uniqueID);
                    return Promise.resolve();
                } else if (errorAnalysis === "auth") {
                    console.log("AAAAHHHHH auth me!");
                } else {
                    result.reply.forEach(function (user) {
                        if (!(user.id_str in data[1])) {
                            data[1][user.id_str] = {};
                        }
                        data[1][user.id_str].name = user.name;
                        data[1][user.id_str].followers_count = user.followers_count;
                        data[1][user.id_str].friends_count = user.friends_count;
                        data[1][user.id_str].handle = user.screen_name;
                        data[1][user.id_str].image = getBiggerPicture(user.profile_image_url_https);
                        data[1][user.id_str].protected = user.protected;
                    });
                    // Some IDs will not return any results, because they are protected
                    query.forEach(function (proxyId) {
                        if (!(proxyId in data[1])) {
                            data[1][proxyId] = {};
                        }
                    });
                    return cfData.set("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n", data[1]).then(function (savedData) {
                        if (more && queue) {
                            queue.call(config_js_1.default.service_key + "--getUsers", [centralNode, nUuid], timestamp, uniqueID);
                        } else {
                            queue.call("network--cleanupNetwork", [config_js_1.default.service_key, centralNode, nUuid], timestamp, uniqueID);
                            Promise.resolve();
                        }
                    });
                }
            });
        } else {
            queue.call("network--cleanupNetwork", [config_js_1.default.service_key, centralNode, nUuid], timestamp, uniqueID);
            return Promise.resolve();
        }
    });
};
exports.getUsers = getUsers;
// TODO: Is this still being used??
var removeNetwork = function (centralNode, nUuid) {
    return cfData.get("s--" + config_js_1.default.service_key + "--nw--" + centralNode).then(function (networkData) {
        delete networkData[nUuid];
        return cfData.set("s--" + config_js_1.default.service_key + "--nw--" + centralNode, networkData).then(function () {
            return Promise.all([cfData.remove("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--c"), cfData.remove("s--" + config_js_1.default.service_key + "--a--" + centralNode + "-" + nUuid + "--n")]);
        });
    });
};
exports.removeNetwork = removeNetwork;

/***/ }),

/***/ "../crossfoam-service-twitter/node_modules/@crossfoam/data/dst/index.js":
/*!*******************************************************************!*\
  !*** .-service-twitter/node_modules/@crossfoam/data/dst/index.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(/*! @crossfoam/utils */ "../crossfoam-service-twitter/node_modules/@crossfoam/utils/dst/index.js");
var get = function (key, defaultValue) {
    return browser.storage.local.get(key)
        .then(function (data) {
        if (data && data !== null && data !== undefined && !utils_1.objEmpty(data)) {
            if (key in data) {
                return data[key];
            }
            return data;
        }
        else if (defaultValue) {
            return set(key, defaultValue);
        }
        else {
            return null;
        }
    });
};
exports.get = get;
var set = function (key, value) {
    var _a;
    return browser.storage.local.set((_a = {}, _a[key] = value, _a))
        .then(function () {
        if (key in value) {
            return value[key];
        }
        return value;
    });
};
exports.set = set;
var remove = function (key) {
    return browser.storage.local.remove(key);
};
exports.remove = remove;


/***/ }),

/***/ "../crossfoam-service-twitter/node_modules/@crossfoam/utils/dst/index.js":
/*!********************************************************************!*\
  !*** .-service-twitter/node_modules/@crossfoam/utils/dst/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var throttle = function (t) {
    return new Promise(function (resolve) {
        setTimeout(resolve, t);
    });
};
exports.throttle = throttle;
// inspired by uuid v4 (shortened) https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
/* tslint:disable:no-bitwise */
var uuid = function () {
    return "xxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
exports.uuid = uuid;
/* tslint:enable:no-bitwise */
var formatDate = function (date, withTime) {
    if (withTime === void 0) { withTime = false; }
    // TODO: Language based formatting of dates
    var lang = "en";
    switch (lang) {
        case "de":
            return dateNull(date.getDate())
                + "." + dateNull((date.getMonth() + 1))
                + "." + dateNull(date.getFullYear())
                + ((withTime) ? " " + dateNull(date.getHours()) + ":" + dateNull(date.getMinutes()) : "");
            break;
        default:
            return dateNull(date.getFullYear())
                + "/" + dateNull((date.getMonth() + 1))
                + "/" + dateNull(date.getDate())
                + ((withTime) ? " " + dateNull(date.getHours()) + ":" + dateNull(date.getMinutes()) : "");
            break;
    }
};
exports.formatDate = formatDate;
var dateNull = function (num) {
    return (num < 10) ? "0" + num : "" + num;
};
var cleanNumber = function (duration) {
    if (duration === Math.floor(duration)) {
        return duration;
    }
    else if (parseFloat(duration.toFixed(1)) === parseFloat(duration.toFixed(2))) {
        return duration.toFixed(1);
    }
    else {
        return duration.toFixed(2);
    }
};
var formatDuration = function (duration) {
    duration = duration / 1000;
    if (duration < 60) {
        return Math.floor(duration) +
            " " + browser.i18n.getMessage("secondsShort");
    }
    else {
        duration = duration / 60;
        if (duration < 60) {
            return cleanNumber(duration) +
                " " + browser.i18n.getMessage("minutesShort");
        }
        else {
            duration = duration / 60;
            if (duration < 24) {
                return cleanNumber(duration) +
                    " " + browser.i18n.getMessage("hoursShort");
            }
            else {
                duration = duration / 24;
                return cleanNumber(duration) +
                    " " + browser.i18n.getMessage("daysShort");
            }
        }
    }
};
exports.formatDuration = formatDuration;
var objEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
exports.objEmpty = objEmpty;
var downloadFile = function (fileData, fileType, fileName) {
    var file = new Blob([fileData], {
        type: fileType,
    });
    return browser.downloads.download({
        // window.URL ??
        filename: fileName,
        saveAs: true,
        url: URL.createObjectURL(file),
    }).then(function (downloadId) {
        return Promise.resolve();
    }).catch(function (error) {
        throw new Error("Download failed. " + JSON.stringify(error));
    });
};
exports.downloadFile = downloadFile;
var debounce = function (func, wait, immediate) {
    if (wait === void 0) { wait = 200; }
    if (immediate === void 0) { immediate = false; }
    var timeout = null;
    var again = false;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callNow = immediate && timeout === null;
        var next = function () { return func.apply(null, args); };
        if (timeout === null) {
            timeout = setTimeout(function () {
                timeout = null;
                if (again) {
                    next();
                    again = false;
                }
            }, wait);
        }
        else {
            again = true;
        }
        if (callNow) {
            next();
        }
    };
};
exports.debounce = debounce;


/***/ }),

/***/ "../crossfoam-services/dst/index.js":
/*!*******************************!*\
  !*** .-services/dst/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var cfData = __webpack_require__(/*! @crossfoam/data */ "../crossfoam-services/node_modules/@crossfoam/data/dst/index.js");
var cfTwitter = __webpack_require__(/*! @crossfoam/service-twitter */ "../crossfoam-service-twitter/dst/index.js");
var services = (_a = {}, _a[cfTwitter.config.service_key] = cfTwitter, _a);
exports.services = services;
var identifyService = function (url) {
    var found = null;
    Object.keys(services).forEach(function (service) {
        var match = url.match(services[service].config.regex);
        if (match !== null) {
            var excludeMatch = url.match(services[service].config.regex_exclude);
            if (excludeMatch === null) {
                found = [service, match[1]];
            }
        }
    });
    return found;
};
exports.identifyService = identifyService;
var getScrapes = function () {
    return Promise.all(Object.keys(services).map(function (service) {
        return cfData.get("s--" + service + "--u", []);
    })).then(function (screenNamesList) {
        return Promise.all(screenNamesList.map(function (screenNames, i) {
            return Promise.all(screenNames.map(function (screenName) {
                return cfData.get("s--" + Object.keys(services)[i] + "--nw--" + screenName, {});
            }));
        })).then(function (networkDatas) {
            var scrapes = [];
            networkDatas.forEach(function (networkData, serviceID) {
                networkData.forEach(function (screenNameNetworkData, screenNameID) {
                    Object.keys(screenNameNetworkData).forEach(function (scrapeID) {
                        scrapes.push({
                            callCount: screenNameNetworkData[scrapeID].callCount,
                            completeCount: screenNameNetworkData[scrapeID].completeCount,
                            completed: screenNameNetworkData[scrapeID].completed,
                            date: screenNameNetworkData[scrapeID].date,
                            nUuid: scrapeID,
                            screenName: screenNamesList[serviceID][screenNameID],
                            service: Object.keys(services)[serviceID]
                        });
                    });
                });
            });
            return scrapes;
        });
    });
};
exports.getScrapes = getScrapes;

/***/ }),

/***/ "../crossfoam-services/node_modules/@crossfoam/data/dst/index.js":
/*!************************************************************!*\
  !*** .-services/node_modules/@crossfoam/data/dst/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(/*! @crossfoam/utils */ "../crossfoam-services/node_modules/@crossfoam/utils/dst/index.js");
var get = function (key, defaultValue) {
    return browser.storage.local.get(key)
        .then(function (data) {
        if (data && data !== null && data !== undefined && !utils_1.objEmpty(data)) {
            if (typeof data === "object" && key in data) {
                return data[key];
            }
            return data;
        }
        else if (defaultValue) {
            return set(key, defaultValue);
        }
        else {
            return null;
        }
    });
};
exports.get = get;
var set = function (key, value) {
    var _a;
    return browser.storage.local.set((_a = {}, _a[key] = value, _a))
        .then(function () {
        if (typeof value === "object" && key in value) {
            return value[key];
        }
        return value;
    });
};
exports.set = set;
var remove = function (key) {
    return browser.storage.local.remove(key);
};
exports.remove = remove;


/***/ }),

/***/ "../crossfoam-services/node_modules/@crossfoam/utils/dst/index.js":
/*!*************************************************************!*\
  !*** .-services/node_modules/@crossfoam/utils/dst/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var throttle = function (t) {
    return new Promise(function (resolve) {
        setTimeout(resolve, t);
    });
};
exports.throttle = throttle;
// inspired by uuid v4 (shortened) https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
/* tslint:disable:no-bitwise */
var uuid = function () {
    return "xxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
exports.uuid = uuid;
/* tslint:enable:no-bitwise */
var formatDate = function (date, withTime) {
    if (withTime === void 0) { withTime = false; }
    // TODO: Language based formatting of dates
    var lang = "en";
    switch (lang) {
        case "de":
            return dateNull(date.getDate())
                + "." + dateNull((date.getMonth() + 1))
                + "." + dateNull(date.getFullYear())
                + ((withTime) ? " " + dateNull(date.getHours()) + ":" + dateNull(date.getMinutes()) : "");
            break;
        default:
            return dateNull(date.getFullYear())
                + "/" + dateNull((date.getMonth() + 1))
                + "/" + dateNull(date.getDate())
                + ((withTime) ? " " + dateNull(date.getHours()) + ":" + dateNull(date.getMinutes()) : "");
            break;
    }
};
exports.formatDate = formatDate;
var dateNull = function (num) {
    return (num < 10) ? "0" + num : "" + num;
};
var cleanNumber = function (duration) {
    if (duration === Math.floor(duration)) {
        return duration;
    }
    else if (parseFloat(duration.toFixed(1)) === parseFloat(duration.toFixed(2))) {
        return duration.toFixed(1);
    }
    else {
        return duration.toFixed(2);
    }
};
var formatDuration = function (duration) {
    duration = duration / 1000;
    if (duration < 60) {
        return Math.floor(duration) +
            " " + browser.i18n.getMessage("secondsShort");
    }
    else {
        duration = duration / 60;
        if (duration < 60) {
            return cleanNumber(duration) +
                " " + browser.i18n.getMessage("minutesShort");
        }
        else {
            duration = duration / 60;
            if (duration < 24) {
                return cleanNumber(duration) +
                    " " + browser.i18n.getMessage("hoursShort");
            }
            else {
                duration = duration / 24;
                return cleanNumber(duration) +
                    " " + browser.i18n.getMessage("daysShort");
            }
        }
    }
};
exports.formatDuration = formatDuration;
var objEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
exports.objEmpty = objEmpty;
var downloadFile = function (fileData, fileType, fileName) {
    var file = new Blob([fileData], {
        type: fileType,
    });
    return browser.downloads.download({
        // window.URL ??
        filename: fileName,
        saveAs: true,
        url: URL.createObjectURL(file),
    }).then(function (downloadId) {
        return Promise.resolve();
    }).catch(function (error) {
        throw new Error("Download failed. " + JSON.stringify(error));
    });
};
exports.downloadFile = downloadFile;
var debounce = function (func, wait, immediate) {
    if (wait === void 0) { wait = 200; }
    if (immediate === void 0) { immediate = false; }
    var timeout = null;
    var again = false;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callNow = immediate && timeout === null;
        var next = function () { return func.apply(null, args); };
        if (timeout === null) {
            timeout = setTimeout(function () {
                timeout = null;
                if (again) {
                    next();
                    again = false;
                }
            }, wait);
        }
        else {
            again = true;
        }
        if (callNow) {
            next();
        }
    };
};
exports.debounce = debounce;


/***/ }),

/***/ "./src/typescript/options.ts":
/*!***********************************!*\
  !*** ./src/typescript/options.ts ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _crossfoam_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @crossfoam/data */ "../crossfoam-data/dst/index.js");
/* harmony import */ var _crossfoam_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_crossfoam_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _crossfoam_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @crossfoam/services */ "../crossfoam-services/dst/index.js");
/* harmony import */ var _crossfoam_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_crossfoam_services__WEBPACK_IMPORTED_MODULE_1__);


var translates = [
    ["settings--title", "settings"],
    ["settings--serviceTitle", "services"],
    ["settings--clusterTitle", "settingsClusterTitle"],
    ["settings--clusterDescription", "settingsClusterDescription"],
    ["settings--clusterNote", "settingsClusterNote"],
    ["settings--clusterSwitch1", "settingsClusterSwitch1"],
    ["settings--clusterSwitch2", "settingsClusterSwitch2"],
];
translates.forEach(function (t) {
    document.querySelector("#" + t[0]).innerHTML = browser.i18n.getMessage(t[1]);
});
Object.keys(_crossfoam_services__WEBPACK_IMPORTED_MODULE_1__["services"]).forEach(function (serviceKey) {
    document.getElementById("options--services").innerHTML = "<div class='services--service-container'>        <h3>" + _crossfoam_services__WEBPACK_IMPORTED_MODULE_1__["services"][serviceKey].config.service_name + "</h3>        <div id='services--service-" + serviceKey + "'></div>";
    _crossfoam_services__WEBPACK_IMPORTED_MODULE_1__["services"][serviceKey].createOptions(document.getElementById("services--service-" + serviceKey));
});
_crossfoam_data__WEBPACK_IMPORTED_MODULE_0__["get"]("config--siteAnalysis", "true")
    .then(function (state) {
    var checkbox = document.getElementById("siteAnalysis");
    if (state === "false") {
        checkbox.checked = false;
    }
    else {
        checkbox.checked = true;
    }
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            _crossfoam_data__WEBPACK_IMPORTED_MODULE_0__["set"]("config--siteAnalysis", "true");
        }
        else {
            _crossfoam_data__WEBPACK_IMPORTED_MODULE_0__["set"]("config--siteAnalysis", "false");
        }
    });
});
_crossfoam_data__WEBPACK_IMPORTED_MODULE_0__["get"]("config--showLabels", "true")
    .then(function (state) {
    var checkbox = document.getElementById("showLabels");
    if (state === "false") {
        checkbox.checked = false;
    }
    else {
        checkbox.checked = true;
    }
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            _crossfoam_data__WEBPACK_IMPORTED_MODULE_0__["set"]("config--showLabels", "true");
        }
        else {
            _crossfoam_data__WEBPACK_IMPORTED_MODULE_0__["set"]("config--showLabels", "false");
        }
    });
});


/***/ })

/******/ });
//# sourceMappingURL=options.js.map