var validationModule = angular.module('scheduling-app.validation', [

]);
validationModule.service('ValidatorDirectiveGeneratorService', [
    function() {
        angular.forEach(window.Validations, function(modelName) {
            var capitalizedModelName = capitalizeFirstLetter(modelName);
            angular.forEach(modelName, function(validationEntries, validationKey) {
                var validationDirectives = {};

                if (!(validationEntries instanceof Array)) {
                    validationEntries = [validationEntries];
                }

                angular.forEach(validationEntries, function(validationEntry) {
                    console.log("Validation " + validation);
                    if (!validationEntry.hasOwnProperty('validator')) {
                        throw new Error("Unknown validator for model '" + modelName + "' - '" + validationEntry + "'");
                    }

                    var validator = validationEntry.validator;

                    var validationName = 'validation' + capitalizedModelName + capitalizeFirstLetter(validator);

                    var validationFunction = null;
                    switch (validationName) {
                        case 'notEmpty':
                            validationName = 'required';
                            validationFunction = function(modelValue) {
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
            });

            validationModule
                .directive('validation' + capitalizedModelName, function() {
                    return {
                        restrict: 'A',
                        require: 'ngModel',
                        link: function(scope, element, attributes, ngModel) {
                            angular.forEach(validationDirectives)
                            ngModel.$validators[validationName] = validationFunction;
                        }
                    };
                });
        });
    }
]);

function capitalizeFirstLetter(string) {
    string.charAt(0).toUpperCase() + string.slice(1);
}
