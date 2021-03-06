/* */ 
'use strict';
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var angular2_1 = require('../../../angular2');
var static_request_1 = require('../static_request');
var enums_1 = require('../enums');
var lang_1 = require('../../core/facade/lang');
var exceptions_1 = require('../../core/facade/exceptions');
var Rx = require('@reactivex/rxjs/dist/cjs/Rx');
var Subject = Rx.Subject,
    ReplaySubject = Rx.ReplaySubject;
var MockConnection = (function() {
  function MockConnection(req) {
    this.response = new ReplaySubject(1).take(1);
    this.readyState = enums_1.ReadyStates.Open;
    this.request = req;
  }
  MockConnection.prototype.mockRespond = function(res) {
    if (this.readyState === enums_1.ReadyStates.Done || this.readyState === enums_1.ReadyStates.Cancelled) {
      throw new exceptions_1.BaseException('Connection has already been resolved');
    }
    this.readyState = enums_1.ReadyStates.Done;
    this.response.next(res);
    this.response.complete();
  };
  MockConnection.prototype.mockDownload = function(res) {};
  MockConnection.prototype.mockError = function(err) {
    this.readyState = enums_1.ReadyStates.Done;
    this.response.error(err);
  };
  return MockConnection;
})();
exports.MockConnection = MockConnection;
var MockBackend = (function() {
  function MockBackend() {
    var _this = this;
    this.connectionsArray = [];
    this.connections = new Subject();
    this.connections.subscribe(function(connection) {
      return _this.connectionsArray.push(connection);
    });
    this.pendingConnections = new Subject();
  }
  MockBackend.prototype.verifyNoPendingRequests = function() {
    var pending = 0;
    this.pendingConnections.subscribe(function(c) {
      return pending++;
    });
    if (pending > 0)
      throw new exceptions_1.BaseException(pending + " pending connections to be resolved");
  };
  MockBackend.prototype.resolveAllConnections = function() {
    this.connections.subscribe(function(c) {
      return c.readyState = 4;
    });
  };
  MockBackend.prototype.createConnection = function(req) {
    if (!lang_1.isPresent(req) || !(req instanceof static_request_1.Request)) {
      throw new exceptions_1.BaseException("createConnection requires an instance of Request, got " + req);
    }
    var connection = new MockConnection(req);
    this.connections.next(connection);
    return connection;
  };
  MockBackend = __decorate([angular2_1.Injectable(), __metadata('design:paramtypes', [])], MockBackend);
  return MockBackend;
})();
exports.MockBackend = MockBackend;
