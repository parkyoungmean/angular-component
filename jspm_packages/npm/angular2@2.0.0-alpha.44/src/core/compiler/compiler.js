/* */ 
'use strict';
var runtime_compiler_1 = require('./runtime_compiler');
var template_compiler_1 = require('./template_compiler');
exports.TemplateCompiler = template_compiler_1.TemplateCompiler;
var directive_metadata_1 = require('./directive_metadata');
exports.CompileDirectiveMetadata = directive_metadata_1.CompileDirectiveMetadata;
exports.CompileTypeMetadata = directive_metadata_1.CompileTypeMetadata;
exports.CompileTemplateMetadata = directive_metadata_1.CompileTemplateMetadata;
var source_module_1 = require('./source_module');
exports.SourceModule = source_module_1.SourceModule;
exports.SourceWithImports = source_module_1.SourceWithImports;
var lang_1 = require('../facade/lang');
var di_1 = require('../di');
var template_parser_1 = require('./template_parser');
var html_parser_1 = require('./html_parser');
var template_normalizer_1 = require('./template_normalizer');
var runtime_metadata_1 = require('./runtime_metadata');
var change_detector_compiler_1 = require('./change_detector_compiler');
var style_compiler_1 = require('./style_compiler');
var command_compiler_1 = require('./command_compiler');
var template_compiler_2 = require('./template_compiler');
var change_detection_1 = require('../change_detection/change_detection');
var compiler_1 = require('../linker/compiler');
var runtime_compiler_2 = require('./runtime_compiler');
var element_schema_registry_1 = require('./schema/element_schema_registry');
var dom_element_schema_registry_1 = require('./schema/dom_element_schema_registry');
var url_resolver_1 = require('./url_resolver');
var app_root_url_1 = require('./app_root_url');
var anchor_based_app_root_url_1 = require('./anchor_based_app_root_url');
var change_detection_2 = require('../change_detection/change_detection');
function compilerProviders() {
  return [change_detection_2.Lexer, change_detection_2.Parser, html_parser_1.HtmlParser, template_parser_1.TemplateParser, template_normalizer_1.TemplateNormalizer, runtime_metadata_1.RuntimeMetadataResolver, style_compiler_1.StyleCompiler, command_compiler_1.CommandCompiler, change_detector_compiler_1.ChangeDetectionCompiler, di_1.provide(change_detection_1.ChangeDetectorGenConfig, {useValue: new change_detection_1.ChangeDetectorGenConfig(lang_1.assertionsEnabled(), lang_1.assertionsEnabled(), false, true)}), template_compiler_2.TemplateCompiler, di_1.provide(runtime_compiler_2.RuntimeCompiler, {useClass: runtime_compiler_1.RuntimeCompiler_}), di_1.provide(compiler_1.Compiler, {useExisting: runtime_compiler_2.RuntimeCompiler}), dom_element_schema_registry_1.DomElementSchemaRegistry, di_1.provide(element_schema_registry_1.ElementSchemaRegistry, {useExisting: dom_element_schema_registry_1.DomElementSchemaRegistry}), anchor_based_app_root_url_1.AnchorBasedAppRootUrl, di_1.provide(app_root_url_1.AppRootUrl, {useExisting: anchor_based_app_root_url_1.AnchorBasedAppRootUrl}), url_resolver_1.UrlResolver];
}
exports.compilerProviders = compilerProviders;
