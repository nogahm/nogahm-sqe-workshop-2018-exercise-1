import $ from 'jquery';
import {addToTable, createParseInfo, parseCode} from './code-analyzer';


$(document).ready(function () {

    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

        createParseInfo(parsedCode);
        addToTable();
    });

});

// function binarySearch(X, V, n){
//     for(let i=0;i<a+b;i++)
//     {
//         let x=8;
//     }
// }