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

        messages = {};

        angular.forEach(validationEntries, function (validationEntry) {

            if (!validationEntry.hasOwnProperty('validator')) {
                throw new Error("Unknown validator for model '" + modelName + "' - '" + validationEntry + "'");
            }

            var validatorName = validationEntry.validator;
            var args = validationEntry.args;
            var validatorMessage = validationEntry.message;

            var validationName = 'validation' + capitalizedModelName + capitalizeFirstLetter(validationKey) +
                capitalizeFirstLetter(validatorName);

            var validationFunction = null;
            switch (validatorName) {
                case 'notEmpty':
                    //validationName = 'required';
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
            messages[validationName] = validatorMessage;
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

        var fullDirectiveName = directiveName + 'Messages';

        // 'messages' gets modified somewhere so the reference gets lost
        // and ends up being the last instance of it.
        // that makes the directive always use the messages for the final directive
        // which is incorrect
        var directiveReferenceToMessages = messages;

        validationModule
            .directive(fullDirectiveName, [
                '$compile',
                function(
                    $compile
                ) {
                    var template = '';
                    angular.forEach(directiveReferenceToMessages, function (message, name) {
                        var thisElement = '<div ng-message="' + name + '">' + message + '</div>';
                        template = template + thisElement;
                    });

                    var messageElements = angular.element(template);

                    return ({
                        restrict: 'A',
                        compile: function(element, attrs) {
                            var ngMessagesAttr = attrs[fullDirectiveName];
                            if (!ngMessagesAttr) {
                                console.log(fullDirectiveName + " must have attribute set");
                            } else {
                                var messagesElement = angular.element('<div ng-messages="' + ngMessagesAttr + '">');
                                messagesElement.append(messageElements);
                                element.append(messagesElement);

                                return function (scope, element) {
                                    // Do nothing no need to link anything to the scope
                                }
                            }
                        }
                    })
                }
        ]);
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
