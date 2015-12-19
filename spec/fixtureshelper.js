var models = require('../app/models'),
    knex = models.knex,
    _ = require('underscore'),
    sqlFixtures = require('sql-fixtures'),
    Promise = require('bluebird'),
    fixtures = require('./fixtures/fixtures');

module.exports = {
    setFixtures: setFixtures,
    databaseReady: databaseReady,
    fixtures: fixtures,
    parse: parse
};

var resetDatabasePromise = null;

function setFixtures() {
    // accepts multiple arguments that are objects of the format
    /*
     {
     users: {
     username: 'Bob',
     email: 'bob@example.com'
     }
     };
     */

    var fixturesList = [];
    var i = 0;
    while (arguments.hasOwnProperty(i)) {
        fixturesList.push(arguments[i++]);
    }
    var promise = new Promise(function(resolve, reject) {
        // makes sqlite3 use async
        // sqlFixtures does a series of insert/select/insert/select/...
        // this makes sqlite3 run very slowly
        // this is because sqlite3 by default will persist data to disk
        // before performing a select query
        // setting this to false means that it does not do that
        knex.schema.raw("PRAGMA synchronous=OFF");
        return models.initDb(true)
            .then(function() {
                // database has been reset
                // add fixtures inside a transaction
                // then resolve promise
                var client = {
                    client: global.db_dialect,
                    connection: {
                        filename: global.db_file
                    }
                };

                function recurse(fixturesLeft) {
                    if (fixturesLeft.length == 0) {
                        // no fixtures left
                        // end recursion
                        resolve();
                    } else {
                        var fixture = fixturesLeft.shift();
                        preprocessFixtures(fixture);
                        return sqlFixtures.create(knex, fixture, function (err, result) {
                            if (err) {
                                reject(err);
                            }

                            return recurse(fixturesLeft);
                        });
                    }
                }

                return recurse(fixturesList);
            });
    });

    resetDatabasePromise = promise;

    return promise;
}

function databaseReady(next) {
    if (resetDatabasePromise === null || !resetDatabasePromise.isPending()) {
        return next();
    } else {
        return resetDatabasePromise
            .then(next);
    }
}

/**
 * Preprocess fixtures to convert '@table.columnname:value' => 'table:0'
 * @param fixtures
 */
function preprocessFixtures(fixtures) {
    var regularExpression = /@([^:]+):([^:]+):([^:]+)/;

    _.each(fixtures, function(insertableColumns, tableName) {
        _.each(insertableColumns, function(insertableColumn) {
            _.each(insertableColumn, function(columnValue, columnName) {
                var match;
                if ((match = regularExpression.exec(columnValue)) !== null) {
                    if (match.index === regularExpression.lastIndex) {
                        regularExpression.lastIndex++;
                    }

                    var matchTableName = match[1];
                    var matchColumnName = match[2];
                    var matchColumnValue = match[3];

                    /*
                     console.log("Searching for tabel: " + match[0]);
                     console.log("Column name: " + match[1]);
                     console.log("Value: " + match[2]);
                     */

                    // check for this value
                    var found = false;
                    if (fixtures.hasOwnProperty(matchTableName)) {
                        var matchedTable = fixtures[matchTableName];
                        _.each(matchedTable, function(matchedIndividualTable, zeroedTableIndex) {
                            if (matchedIndividualTable.hasOwnProperty(matchColumnName) &&
                                matchedIndividualTable[matchColumnName] == matchColumnValue) {
                                // match, modify the text we found to use index
                                insertableColumn[columnName] = matchTableName + ":" + zeroedTableIndex;
                                found = true;
                            }
                        });
                    }

                    if (!found) {
                        throw new Error("Cannot find: " + match[0]);
                    }
                }
            });
        });
    });

    return fixtures;
}

function parse(uri) {
    var re = /(([^@]*)@([^:@]+):([^:@]+):([^:@]+):([^@]*))/g;
    var match;

    var textBeforeMatch = 2;
    var modelName = 3;
    var columnName = 4;
    var columnValue = 5;
    var textafterMatch = 6;

    var result = '';

    var sqlStartingIndex = 1;

    var foundAMatch = false;

    while ((match = re.exec(uri)) !== null) {
        foundAMatch = true;

        if (match.index === re.lastIndex) {
            re.lastIndex++;
        }

        var model = global.fixtures.base[match[modelName]];
        if (model === undefined) {
            throw new Error("Cannot find model: " + match[modelName]);
        }

        var column = match[columnName];
        var expectedColumnValue = match[columnValue];

        var found = null;

        for (var i = 0; i < model.length; i++) {
            var realColumnValue = model[i][column];
            if (realColumnValue == expectedColumnValue) {
                found = i + sqlStartingIndex;
                break;
            }
        }

        if (found === null) {
            throw new Error("Cannot find fixture for: @" + match[modelName] + ":" + match[columnName] + ":" + match[columnValue] + ":");
        }

        var beforeText = match[textBeforeMatch];
        var afterText = match[textafterMatch];

        result = result + (beforeText || '') + found + (afterText || '');
    }

    if (!foundAMatch) {
        throw new Error("Could not find a match in " + uri);
    }

    return result;
}
