import assert from 'assert';
import {app} from '../src/js/app';

describe('The javascript app', () => {
    it('is returning right string to an expretion', () => {
        assert.equal(
            JSON.stringify(getValue('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });


    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});
