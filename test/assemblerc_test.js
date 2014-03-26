
/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var path = require('path');

// node_modules
var expect = require('chai').expect;
var _ = require('lodash');
var file = require('fs-utils');

// local modules
var assemble = require('../lib/assemble');


describe('assemble', function() {

  describe('runtime configuration file', function() {


    var filenames = [
      '.assemblerc',
      '.test-assemblerc',
      'assemble.config.yml',
      'assemble.config.json'
    ];

    var configFiles = _.flatten(_.map(filenames, function (filename) {
      var results = _.map(['~/', './', __dirname], function (base) {
        var results = base === '~/' ? path.join(base, filename) : path.resolve(path.join(base, filename));
        return results;
      });
      return results;
    }));

    var backupFilename = function (filename) {
      return filename + '.bk-assemble-test';
    };

    var backupFiles = function () {
      // ensure there is no assemble runtime config files
      _.each(configFiles, function (filename) {
        if (file.exists(filename)) {
          file.writeFileSync(backupFilename(filename), file.readFileSync(filename));
          file.delete(filename);
        }
      });
    };

    var restoreFiles = function () {
      _.each(configFiles, function (filename) {
        if (file.exists(filename)) {
          file.delete(filename);
        }
        if (file.exists(backupFilename(filename))) {
          file.writeFileSync(filename, file.readFileSync(backupFilename(filename)));
          file.delete(backupFilename(filename));
        }
      });
    };

    before(function () {
      backupFiles();
    });

    after(function () {
      restoreFiles();
    });

    it('should create an instance of App with no runtime configuration', function() {
      var actual = assemble();
      expect(actual).to.be.an.instanceof(assemble.App);
    });

    _.each(configFiles, function (filename) {

      it('should use ' + filename, function () {
        file.writeFileSync(filename, JSON.stringify({ test: { rcfile: filename }}));
        var actual = assemble({name: 'rc-test-' + filename, metadata: { assemblerc: filename }});
        expect(actual.options.test.rcfile).to.eql(filename);
      });

    });

  });

});
