import assert from 'assert';
import {parseCode,parseInfo,createParseInfo,functionCode} from '../src/js/code-analyzer';

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

describe('save info and create table',()=>{
    it('func decleration with one param', ()=>{
        let text=parseCode('function x(y){}');
        createParseInfo(text);
        let expRes=[{Line:'1',
            Type:'function declaration',
            Name:'x',
            Condition:'',
            Value:''}, {Line:'1', Type:'variable declaration', Name:'y', Condition:'', Value:''}];
        assert.deepEqual(expRes,parseInfo);
    });

    it('variable decleration with assignment', ()=>{
        let ans=parseCode('let x=8;');
        functionCode(ans.body);
        let expRes=[{Line:'1', Type:'variable declaration', Name:'x', Condition:'', Value:'8'}];
        assert.deepEqual(expRes,parseInfo);
    });

    it('assignment expression', ()=>{
        let ans=parseCode('x=y;');
        functionCode(ans.body);
        let expRes=[{Line:'1', Type:'assignment expression', Name:'x', Condition:'', Value:'y'}];
        assert.deepEqual(expRes,parseInfo);
    });

    it('While with no body - condition with array', ()=>{
        let ans=parseCode('while(3>y[z]){}');
        functionCode(ans.body);
        let expRes=[{Line:'1', Type:'While Statement', Name:'', Condition:'3>y[z]', Value:''}];
        assert.deepEqual(expRes,parseInfo);
    });

    it('for with no body - binary exp', ()=>{
        let ans=parseCode('for(let i=0;i<(8+t)/2;i++){}');
        functionCode(ans.body);
        let expRes=[{Line:'1', Type:'for statement', Name:'', Condition:'i=0;i<((8+t)/2);i++', Value:''}];
        assert.deepEqual(expRes,parseInfo);
    });

    it('if + else if + else', ()=>{
        let ans=parseCode('if(a==0)\n' +
            '{\n' +
            '    a=0;\n' +
            '}\n' +
            'else if(b==0)\n' +
            '    b=0;\n' +
            'else \n' +
            '    c=0;');
        functionCode(ans.body);
        let expRes=[{Line:'1', Type:'if statement', Name:'', Condition:'a==0', Value:''},
            {Line:'2', Type:'assignment expression', Name:'a', Condition:'', Value:'0'},
            {Line:'3', Type:'else if statement', Name:'', Condition:'b==0', Value:''},
            {Line:'4', Type:'assignment expression', Name:'b', Condition:'', Value:'0'},
            {Line:'5', Type:'else statement', Name:'', Condition:'', Value:''},
            {Line:'6', Type:'assignment expression', Name:'c', Condition:'', Value:'0'}];
        assert.deepEqual(expRes,parseInfo);
    });
});

// if(a)
// {
//     a=0;
// }
// else if(b)
//     b=0;
// else
//     c=0;
