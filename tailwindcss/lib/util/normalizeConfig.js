"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeConfig = normalizeConfig;
var _log = _interopRequireWildcard(require("./log"));
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function normalizeConfig(config) {
    // Quick structure validation
    /**
   * type FilePath = string
   * type RawFile = { raw: string, extension?: string }
   * type ExtractorFn = (content: string) => Array<string>
   * type TransformerFn = (content: string) => string
   *
   * type Content =
   *   | Array<FilePath | RawFile>
   *   | {
   *       files: Array<FilePath | RawFile>,
   *       extract?: ExtractorFn | { [extension: string]: ExtractorFn }
   *       transform?: TransformerFn | { [extension: string]: TransformerFn }
   *   }
   */ let valid = (()=>{
        // `config.purge` should not exist anymore
        if (config.purge) {
            return false;
        }
        // `config.content` should exist
        if (!config.content) {
            return false;
        }
        // `config.content` should be an object or an array
        if (!Array.isArray(config.content) && !(typeof config.content === "object" && config.content !== null)) {
            return false;
        }
        // When `config.content` is an array, it should consist of FilePaths or RawFiles
        if (Array.isArray(config.content)) {
            return config.content.every((path)=>{
                // `path` can be a string
                if (typeof path === "string") return true;
                // `path` can be an object { raw: string, extension?: string }
                // `raw` must be a string
                if (typeof (path === null || path === void 0 ? void 0 : path.raw) !== "string") return false;
                // `extension` (if provided) should also be a string
                if ((path === null || path === void 0 ? void 0 : path.extension) && typeof (path === null || path === void 0 ? void 0 : path.extension) !== "string") {
                    return false;
                }
                return true;
            });
        }
        // When `config.content` is an object
        if (typeof config.content === "object" && config.content !== null) {
            // Only `files`, `extract` and `transform` can exist in `config.content`
            if (Object.keys(config.content).some((key)=>![
                    "files",
                    "extract",
                    "transform"
                ].includes(key))) {
                return false;
            }
            // `config.content.files` should exist of FilePaths or RawFiles
            if (Array.isArray(config.content.files)) {
                if (!config.content.files.every((path)=>{
                    // `path` can be a string
                    if (typeof path === "string") return true;
                    // `path` can be an object { raw: string, extension?: string }
                    // `raw` must be a string
                    if (typeof (path === null || path === void 0 ? void 0 : path.raw) !== "string") return false;
                    // `extension` (if provided) should also be a string
                    if ((path === null || path === void 0 ? void 0 : path.extension) && typeof (path === null || path === void 0 ? void 0 : path.extension) !== "string") {
                        return false;
                    }
                    return true;
                })) {
                    return false;
                }
                // `config.content.extract` is optional, and can be a Function or a Record<String, Function>
                if (typeof config.content.extract === "object") {
                    for (let value of Object.values(config.content.extract)){
                        if (typeof value !== "function") {
                            return false;
                        }
                    }
                } else if (!(config.content.extract === undefined || typeof config.content.extract === "function")) {
                    return false;
                }
                // `config.content.transform` is optional, and can be a Function or a Record<String, Function>
                if (typeof config.content.transform === "object") {
                    for (let value of Object.values(config.content.transform)){
                        if (typeof value !== "function") {
                            return false;
                        }
                    }
                } else if (!(config.content.transform === undefined || typeof config.content.transform === "function")) {
                    return false;
                }
            }
            return true;
        }
        return false;
    })();
    if (!valid) {
        _log.default.warn("purge-deprecation", [
            "The `purge`/`content` options have changed in Tailwind CSS v3.0.",
            "Update your configuration file to eliminate this warning.",
            "https://tailwindcss.com/docs/upgrade-guide#configure-content-sources", 
        ]);
    }
    // Normalize the `safelist`
    config.safelist = (()=>{
        var ref;
        let { content , purge , safelist  } = config;
        if (Array.isArray(safelist)) return safelist;
        if (Array.isArray(content === null || content === void 0 ? void 0 : content.safelist)) return content.safelist;
        if (Array.isArray(purge === null || purge === void 0 ? void 0 : purge.safelist)) return purge.safelist;
        if (Array.isArray(purge === null || purge === void 0 ? void 0 : (ref = purge.options) === null || ref === void 0 ? void 0 : ref.safelist)) return purge.options.safelist;
        return [];
    })();
    // Normalize prefix option
    if (typeof config.prefix === "function") {
        _log.default.warn("prefix-function", [
            "As of Tailwind CSS v3.0, `prefix` cannot be a function.",
            "Update `prefix` in your configuration to be a string to eliminate this warning.",
            "https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function", 
        ]);
        config.prefix = "";
    } else {
        var _prefix;
        config.prefix = (_prefix = config.prefix) !== null && _prefix !== void 0 ? _prefix : "";
    }
    // Normalize the `content`
    config.content = {
        files: (()=>{
            let { content , purge  } = config;
            if (Array.isArray(purge)) return purge;
            if (Array.isArray(purge === null || purge === void 0 ? void 0 : purge.content)) return purge.content;
            if (Array.isArray(content)) return content;
            if (Array.isArray(content === null || content === void 0 ? void 0 : content.content)) return content.content;
            if (Array.isArray(content === null || content === void 0 ? void 0 : content.files)) return content.files;
            return [];
        })(),
        extract: (()=>{
            let extract = (()=>{
                var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
                if ((ref = config.purge) === null || ref === void 0 ? void 0 : ref.extract) return config.purge.extract;
                if ((ref1 = config.content) === null || ref1 === void 0 ? void 0 : ref1.extract) return config.content.extract;
                if ((ref2 = config.purge) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.extract) === null || ref3 === void 0 ? void 0 : ref3.DEFAULT) return config.purge.extract.DEFAULT;
                if ((ref4 = config.content) === null || ref4 === void 0 ? void 0 : (ref5 = ref4.extract) === null || ref5 === void 0 ? void 0 : ref5.DEFAULT) return config.content.extract.DEFAULT;
                if ((ref6 = config.purge) === null || ref6 === void 0 ? void 0 : (ref7 = ref6.options) === null || ref7 === void 0 ? void 0 : ref7.extractors) return config.purge.options.extractors;
                if ((ref8 = config.content) === null || ref8 === void 0 ? void 0 : (ref9 = ref8.options) === null || ref9 === void 0 ? void 0 : ref9.extractors) return config.content.options.extractors;
                return {};
            })();
            let extractors = {};
            let defaultExtractor = (()=>{
                var ref, ref10, ref11, ref12;
                if ((ref = config.purge) === null || ref === void 0 ? void 0 : (ref10 = ref.options) === null || ref10 === void 0 ? void 0 : ref10.defaultExtractor) {
                    return config.purge.options.defaultExtractor;
                }
                if ((ref11 = config.content) === null || ref11 === void 0 ? void 0 : (ref12 = ref11.options) === null || ref12 === void 0 ? void 0 : ref12.defaultExtractor) {
                    return config.content.options.defaultExtractor;
                }
                return undefined;
            })();
            if (defaultExtractor !== undefined) {
                extractors.DEFAULT = defaultExtractor;
            }
            // Functions
            if (typeof extract === "function") {
                extractors.DEFAULT = extract;
            } else if (Array.isArray(extract)) {
                for (let { extensions , extractor  } of extract !== null && extract !== void 0 ? extract : []){
                    for (let extension of extensions){
                        extractors[extension] = extractor;
                    }
                }
            } else if (typeof extract === "object" && extract !== null) {
                Object.assign(extractors, extract);
            }
            return extractors;
        })(),
        transform: (()=>{
            let transform = (()=>{
                var ref, ref13, ref14, ref15, ref16, ref17;
                if ((ref = config.purge) === null || ref === void 0 ? void 0 : ref.transform) return config.purge.transform;
                if ((ref13 = config.content) === null || ref13 === void 0 ? void 0 : ref13.transform) return config.content.transform;
                if ((ref14 = config.purge) === null || ref14 === void 0 ? void 0 : (ref15 = ref14.transform) === null || ref15 === void 0 ? void 0 : ref15.DEFAULT) return config.purge.transform.DEFAULT;
                if ((ref16 = config.content) === null || ref16 === void 0 ? void 0 : (ref17 = ref16.transform) === null || ref17 === void 0 ? void 0 : ref17.DEFAULT) return config.content.transform.DEFAULT;
                return {};
            })();
            let transformers = {};
            if (typeof transform === "function") {
                transformers.DEFAULT = transform;
            }
            if (typeof transform === "object" && transform !== null) {
                Object.assign(transformers, transform);
            }
            return transformers;
        })()
    };
    // Validate globs to prevent bogus globs.
    // E.g.: `./src/*.{html}` is invalid, the `{html}` should just be `html`
    for (let file of config.content.files){
        if (typeof file === "string" && /{([^,]*?)}/g.test(file)) {
            _log.default.warn("invalid-glob-braces", [
                `The glob pattern ${(0, _log).dim(file)} in your Tailwind CSS configuration is invalid.`,
                `Update it to ${(0, _log).dim(file.replace(/{([^,]*?)}/g, "$1"))} to silence this warning.`
            ]);
            break;
        }
    }
    return config;
}
