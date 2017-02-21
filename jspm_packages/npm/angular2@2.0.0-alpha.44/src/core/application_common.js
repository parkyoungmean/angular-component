/* */ 
(function(process) {
  'use strict';
  var forms_1 = require('./forms');
  var di_1 = require('./di');
  var lang_1 = require('./facade/lang');
  var browser_adapter_1 = require('./dom/browser_adapter');
  var browser_testability_1 = require('./testability/browser_testability');
  var dom_adapter_1 = require('./dom/dom_adapter');
  var xhr_1 = require('./compiler/xhr');
  var xhr_impl_1 = require('./compiler/xhr_impl');
  var event_manager_1 = require('./render/dom/events/event_manager');
  var key_events_1 = require('./render/dom/events/key_events');
  var hammer_gestures_1 = require('./render/dom/events/hammer_gestures');
  var testability_1 = require('./testability/testability');
  var api_1 = require('./render/api');
  var render_1 = require('./render/render');
  var shared_styles_host_1 = require('./render/dom/shared_styles_host');
  var platform_bindings_1 = require('./platform_bindings');
  var animation_builder_1 = require('../animate/animation_builder');
  var browser_details_1 = require('../animate/browser_details');
  var wtf_init_1 = require('./profile/wtf_init');
  var application_ref_1 = require('./application_ref');
  function applicationDomBindings() {
    if (lang_1.isBlank(dom_adapter_1.DOM)) {
      throw "Must set a root DOM adapter first.";
    }
    return [di_1.provide(render_1.DOCUMENT, {useValue: dom_adapter_1.DOM.defaultDoc()}), event_manager_1.EventManager, new di_1.Provider(event_manager_1.EVENT_MANAGER_PLUGINS, {
      useClass: event_manager_1.DomEventsPlugin,
      multi: true
    }), new di_1.Provider(event_manager_1.EVENT_MANAGER_PLUGINS, {
      useClass: key_events_1.KeyEventsPlugin,
      multi: true
    }), new di_1.Provider(event_manager_1.EVENT_MANAGER_PLUGINS, {
      useClass: hammer_gestures_1.HammerGesturesPlugin,
      multi: true
    }), di_1.provide(render_1.DomRenderer, {useClass: render_1.DomRenderer_}), di_1.provide(api_1.Renderer, {useExisting: render_1.DomRenderer}), shared_styles_host_1.DomSharedStylesHost, di_1.provide(shared_styles_host_1.SharedStylesHost, {useExisting: shared_styles_host_1.DomSharedStylesHost}), platform_bindings_1.EXCEPTION_PROVIDER, di_1.provide(xhr_1.XHR, {useValue: new xhr_impl_1.XHRImpl()}), testability_1.Testability, browser_details_1.BrowserDetails, animation_builder_1.AnimationBuilder, forms_1.FORM_PROVIDERS];
  }
  exports.applicationDomBindings = applicationDomBindings;
  function platform(bindings) {
    return application_ref_1.platformCommon(bindings, function() {
      browser_adapter_1.BrowserDomAdapter.makeCurrent();
      wtf_init_1.wtfInit();
      browser_testability_1.BrowserGetTestability.init();
    });
  }
  exports.platform = platform;
  function commonBootstrap(appComponentType, appBindings) {
    if (appBindings === void 0) {
      appBindings = null;
    }
    var p = platform();
    var bindings = [application_ref_1.applicationCommonBindings(), applicationDomBindings()];
    if (lang_1.isPresent(appBindings)) {
      bindings.push(appBindings);
    }
    return p.application(bindings).bootstrap(appComponentType);
  }
  exports.commonBootstrap = commonBootstrap;
})(require('process'));
