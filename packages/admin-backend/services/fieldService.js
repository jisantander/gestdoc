'use strict'

function formatFieldsSchema(_fields) {
    let properties = {};
    var singleField = false;
    var singleFieldName = "";

    if (_fields.constructor !== Array) {
        _fields = [_fields];
        singleField = true;
    }

    for (var i = 0; i < _fields.length; i++) {
        var fieldName = _fields[i]._fieldName;
        singleFieldName = fieldName;
        properties[fieldName] = {};
        properties[fieldName].type = _fields[i]._type;
        properties[fieldName].widget = _fields[i]._widget;
        properties[fieldName].placeholder = _fields[i]._placeholder;
        properties[fieldName].description = _fields[i]._description;
        properties[fieldName].format = _fields[i]._format;
        properties[fieldName].default = _fields[i]._default;
        properties[fieldName].minLength = _fields[i]._minLength;
        properties[fieldName].maxLength = _fields[i]._maxLength;
        properties[fieldName].visibleIf = _fields[i]._visibleIf;

        if (_fields[i]._oneOf.length == 0) {
            properties[fieldName].oneOf = undefined;
        } else {
            properties[fieldName].oneOf = [];
            _fields[i]._oneOf.forEach( function(oneOf, index) {
                var objOneOf = {}
                objOneOf.description = oneOf._description;
                objOneOf.enum = oneOf._enum;
                properties[fieldName].oneOf[index] = objOneOf;
            });
        }

        if (_fields[i]._items) {
            properties[fieldName].items = formatFieldsSchema(_fields[i]._items);
        }

        if (_fields[i]._properties.length > 0) {
            properties[fieldName].properties =  formatFieldsSchema(_fields[i]._properties)
        }
    };

    if (singleField) {
        return properties[singleFieldName];
    }

    return properties;
}

function formatFieldHeaders(_fields) {
    let properties = {};
    let names = [];
    var singleField = false;
    var singleFieldName = "";

    if (_fields.constructor !== Array) {
        _fields = [_fields];
        singleField = true;
    }

    for (var i = 0; i < _fields.length; i++) {
        var fieldName = _fields[i]._fieldName;
        singleFieldName = fieldName;
        properties[fieldName] = {};

        if (_fields[i]._items) {
            properties[fieldName].items = formatFieldsSchema(_fields[i]._items);
            var auxArr = Object.keys(properties[fieldName].items.properties);
            auxArr.forEach( function(innerFieldName, index) {
                names.push(fieldName+'.'+ innerFieldName);
            });
        } else {
            if (_fields[i]._properties.length > 0 && fieldName != 'comuna') {
                properties[fieldName].properties =  formatFieldsSchema(_fields[i]._properties);
                var auxArr = Object.keys(properties[fieldName].properties);
                auxArr.forEach( function(innerFieldName, index) {
                    names.push(fieldName+'.'+ innerFieldName);
                });
            } else {
                names.push(fieldName);
            }
        }

    };

    if (singleField) {
        return properties[singleFieldName];
    }

    return names;
}


module.exports = {
  formatFieldsSchema,
  formatFieldHeaders
}