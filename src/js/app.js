import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    let parseInfo=[];

    $('#codeSubmissionButton').click(() => {
        //calculate
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        //show in table and save
        funcHeader(parsedCode);
        functionCode((parsedCode.body)[0].body);
    });

    //save function header
    function funcHeader(parsedCode) {
        let name=(parsedCode.body)[0].id.name
        //find header
        parseInfo.put({
            "Line":1,
            "Type":"function declaration",
            "Name":name,
            "Condition":"",
            "Value":""
        });
        //find params
        for(let i=0;i<(parsedCode.body)[0].params.length;i++)
        {
            let curr=(parsedCode.body)[0].params[i];
            parseInfo.put({
                "Line":1,
                "Type":"variable declaration",
                "Name":curr.name,
                "Condition":"",
                "Value":""
            });
        }
    }

    //save function code
    function functionCode(parseBody) {
        for(let i=0;i<parseBody.body.length;i++)
        {
            let type=parseBody.body[i].type;
            if(type=="VariableDeclaration")
                handleVarDec(parseBody.body[i].type);
            if(type=="ExpressionStatement")
                handleExpression(parseBody.body[i].type);
            if(type=="WhileStatement")
                handleWhile(parseBody.body[i].type);
            if(type=="ForStatement")
                handleFor(parseBody.body[i].type);
            if(type=="IfStatement")
                handleIf(parseBody.body[i].type);
            if(type=="ReturnStatement")
                handleReturn(parseBody.body[i].type);}
    }
});
