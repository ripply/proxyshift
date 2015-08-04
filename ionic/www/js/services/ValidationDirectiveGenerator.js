var validationModule = angular.module('scheduling-app.validation', []);

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

            var validator = validationEntry.validator;

            var validationName = 'validation' + capitalizedModelName + capitalizeFirstLetter(validator);

            var validationFunction = null;
            switch (validator) {
                case 'notEmpty':
                    validationName = 'required';
                    validationFunction = function (modelValue) {
                        if (modelValue === null || modelValue === undefined) {
                            return false;
                        }

                        if (typeof modelValue == 'string') {
                            return modelValue.length > 0;
                        }

                        return true;
                    };
                    break;
                default:
                    throw new Error("Unhandled validator: '" + validator + "'");
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
