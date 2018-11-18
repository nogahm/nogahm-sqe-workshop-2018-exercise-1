import $ from 'jquery';
import {parseCode} from './code-analyzer';


$(document).ready(function () {

    $('#codeSubmissionButton').click(() => {

        //calculate
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

    });

});

