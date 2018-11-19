import assert from 'assert';
import {parseCode,parseInfo} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
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
//
// describe('save info and create table',()=>{
//     it('empty function - only func decleration', ()=>{
//         parseCode('function x(){}');
//         let expRes=[{'Line':'1',
//             'Type':'function declaration',
//             'Name':'x',
//             'Condition':'',
//             'Value':''}];
//         assert.deepEqual(expRes,parseInfo);
//     });
// });