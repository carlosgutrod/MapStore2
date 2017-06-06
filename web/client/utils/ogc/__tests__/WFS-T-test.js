/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('expect');
const {insert, update, property, deleteFeature, transaction} = require('../WFST');
const {fidFilter} = require('../Filter/base');
const {featureTypeSchema} = require('../WFS/base');
const describeStates = require('json-loader!../../../test-resources/wfs/describe-states.json');
const describePois = require('json-loader!../../../test-resources/wfs/describe-pois.json');
const wyoming = require('json-loader!../../../test-resources/wfs/Wyoming.json');
const museam = require('json-loader!../../../test-resources/wfs/museam.json');
const expectedInsertWyoming = require('raw-loader!../../../test-resources/wfst/insert/Wyoming_1_1_0.xml');
const expectedInsertmuseam = require('raw-loader!../../../test-resources/wfst/insert/museam_1_1_0.xml');
const expectedDelete = require('raw-loader!../../../test-resources/wfst/delete/museam_1_1_0.xml');
const expectedUpdate = require('raw-loader!../../../test-resources/wfst/update/museam_1_1_0.xml');
describe('Test WFS-T request bodies generation', () => {
    it('WFS-T insert', () => {
        const result = insert(wyoming, describeStates);
        expect(result).toExist();
    });
    it('WFS-T transaction with insert polygon', () => {
        const result = transaction([insert(wyoming, describeStates)], featureTypeSchema(describeStates));
        expect(result).toExist();
        expect(result + '\n').toEqual(expectedInsertWyoming);
    });
    it('WFS-T transaction with insert multypolygon', () => {
        const result = transaction([insert(wyoming, describeStates)], featureTypeSchema(describeStates));
        expect(result).toExist();
        expect(result + '\n').toEqual(expectedInsertWyoming);
    });
    it('WFS-T transaction with insert point', () => {
        const result = transaction([insert(museam, describePois)], featureTypeSchema(describePois));
        expect(result).toExist();
        expect(result + '\n').toEqual(expectedInsertmuseam);
    });
    it('WFS-T transaction with delete', () => {
        const result = transaction([deleteFeature(museam, describePois)], featureTypeSchema(describePois));
        expect(result).toExist();
        expect(result + '\n').toEqual(expectedDelete);
    });
    it('WFS-T transaction with update', () => {
        const result = transaction(
            [update([property("NAME", "newName"), fidFilter("poi.7")], describePois)
            ],
            featureTypeSchema(describePois));
        expect(result).toExist();
        expect(result + '\n').toEqual(expectedUpdate);
    });
});