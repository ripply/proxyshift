var validationModule = angular.module('scheduling-app.validation', [
    'ngMessages'
]);

if (window.Validations === undefined) {
    throw new Error("There are no validations! Include them before this script");
}

angular.forEach(window.Validations, function (modelValues, modelName) {
    var capitalizedModelName = capitalizeFirstLetter(modelName);

    angular.forEach(modelValues, function (validationEntries, validationKey) {
        var validationDirectives = {};

        if (!(validationEntries instanceof Array)) {
            validationEntries = [validationEntries];
        }

        angular.forEach(validationEntries, function (validationEntry) {

            if (!validationEntry.hasOwnProperty('validator')) {
                throw new Error("Unknown validator for model '" + modelName + "' - '" + validationEntry + "'");
            }

            var validatorName = validationEntry.validator;
            var args = validationEntry.args;

            var validationName = 'validation' + capitalizedModelName + capitalizeFirstLetter(validatorName);

            var validationFunction = null;
            switch (validatorName) {
                case 'notEmpty':
                    validationName = 'required';
                    validationFunction = function(modelValue) {
                        return !/^[\s\t\r\n]*$/.test(validator.toString(modelValue));
                    };
                    break;
                default:
                    if (validatorName in validator) {
                        validationFunction = function(modelValue) {
                            if (args !== undefined) {
                                return validator[validatorName].apply(undefined, [modelValue].concat(args));
                            } else {
                                return validator[validatorName].call(undefined, modelValue);
                            }
                        };
                    } else {
                        throw new Error("Unhandled validator: '" + validatorName + "'");
                    }
            }

            validationDirectives[validationName] = validationFunction;
        });

        var directiveName = 'validate' + capitalizedModelName + capitalizeFirstLetter(validationKey);

        validationModule
            .directive(directiveName, function () {
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function (scope, element, attributes, ngModel) {
                        angular.forEach(validationDirectives, function (validationFunction, validationName) {
                            ngModel.$validators[validationName] = validationFunction;
                        });
                    }
                };
            });
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
