import * as esprima from 'esprima';
let parseInfo=[];
let line=1;
const parseCode = (codeToParse) => {
    parseInfo=[];
    line=1;
    let ans=esprima.parseScript(codeToParse);

    createParseInfo(ans);
    addToTable();
    return ans;
};

export {parseCode};


function createParseInfo(parsedCode){
    funcHeader(parsedCode);
    functionCode((parsedCode.body)[0].body.body);
}

function addToTable() {
    var table = document.getElementById('resultsTable');
    for(let i=0;i<parseInfo.length;i++){
        var row = table.insertRow(i+1);
        var line = row.insertCell(0);
        var type = row.insertCell(1);
        var name = row.insertCell(2);
        var condition = row.insertCell(3);
        var value = row.insertCell(4);
        line.innerHTML = parseInfo[i].Line;
        type.innerHTML = parseInfo[i].Type;
        name.innerHTML = parseInfo[i].Name;
        condition.innerHTML = parseInfo[i].Condition;
        value.innerHTML = parseInfo[i].Value;
    }
}

//save function header
function funcHeader(parsedCode) {
    let name=(parsedCode.body)[0].id.name;
    parseInfo.push({//find header
        'Line':line,
        'Type':'function declaration',
        'Name':name,
        'Condition':'',
        'Value':''});
    for(let i=0;i<(parsedCode.body)[0].params.length;i++)        //find params
    {
        let curr=(parsedCode.body)[0].params[i];
        parseInfo.push({
            'Line':line,
            'Type':'variable declaration',
            'Name':curr.name,
            'Condition':'',
            'Value':''
        });
    }
    line++;}

//save function code
function functionCode(parseBody) {
    for(let i=0;i<parseBody.length;i++) {
        handleItem(parseBody[i]);
    }
}

function handleReturn(body) {
    let value='';
    if(body.argument.type==('UnaryExpression')) {
        value=body.argument.operator+''+body.argument.argument.value;
    }
    else if(body.argument.type==('BinaryExpression')) {
        value=getBinaryExp(body.argument);
    }
    else if(body.argument.type==('Identifier')) {
        value=body.argument.name;
    }
    parseInfo.push({
        'Line':line,
        'Type':'return statement',
        'Name':'',
        'Condition':'',
        'Value':value
    });
    line++;
}

function handleIf(body, statement) {
    let condition=getBinaryExp(body.test);
    parseInfo.push({
        'Line':line,
        'Type':statement,
        'Name':'',
        'Condition':condition,
        'Value':''
    });
    line++;
    //body
    let consequents=body.consequent;
    if(consequents.type=='BlockStatement')
        functionCode(consequents.body);
    else
        handleItem(consequents);
    //else
    handleElse(body.alternate);

}

function handleElse(alternate) {
    if(alternate.type=='IfStatement')
        handleIf(alternate, 'else if statement');
    else {
        parseInfo.push({
            'Line':line,
            'Type':'else statement',
            'Name':'',
            'Condition':'',
            'Value':''
        });
        line++;
        if(alternate.type=='BlockStatement')
            functionCode(alternate);
        else
            handleItem(alternate);
    }

}

function handleItem(item) {
    let type=item.type;
    if(type==('VariableDeclaration'))
        handleVarDec(item);
    else if(type==('ExpressionStatement'))
        handleExpression(item);
    else if(type==('IfStatement'))
        handleIf(item, 'if statement');
    else if(type==('ReturnStatement'))
        handleReturn(item);
    else
        handleWhileOrFor(item);
}

function handleWhileOrFor(item) {
    let type=item.type;
    if(type==('WhileStatement'))
        handleWhile(item);
    if(type==('ForStatement'))
        handleFor(item);
}

function handleWhile(body) {
    //while header
    let condition=getBinaryExp(body.test);
    parseInfo.push({
        'Line':line,
        'Type':'While Statement',
        'Name':'',
        'Condition':condition,
        'Value':''
    });
    line++;

    //while body
    functionCode(body.body.body);
}

//return string of an item
function getValue(value) {
    if(value.type==('BinaryExpression'))
        return getBinaryExp(value);
    else if(value.type==('Identifier'))
        return value.name;
    else if(value.type==('Literal'))
        return value.value;
}

//find expression to string
function getBinaryExp(test) {
    let left=test.left;
    let right=test.right;
    if(left.type==('BinaryExpression'))
        left='('+getBinaryExp(left)+')';
    else if (left.type==('Identifier'))
        left=left.name;
    else if(left.type==('Literal'))
        left=left.value;
    else if(left.type==('MemberExpression'))
        left=left.object.name+'['+getValue(left.property)+']';
    if(right.type==('BinaryExpression'))
        right='('+getBinaryExp(right)+')';
    else if (right.type==('Identifier'))
        right=right.name;
    else if(right.type==('Literal'))
        right=right.value;
    else if(right.type==('MemberExpression'))
        right=right.object.name+'['+getValue(right.property)+']';
    return left+''+test.operator+''+right;}

//assignment
function handleExpression(body) {
    if(body.expression.type==('AssignmentExpression')) {
        let name=body.expression.left.name;
        let value=body.expression.right;
        //get value if it is binary expresion
        value=getValue(value);
        parseInfo.push({
            'Line':line,
            'Type':'assignment expression',
            'Name':name,
            'Condition':'',
            'Value':value
        });
    }
    line++;}

function handleVarDec(body) {
    for(let i=0;i<body.declarations.length;i++)
    {
        let curr=body.declarations[i];
        let name=curr.id.name;
        let value=curr.init;
        if(value==null)
            value='null(or nothing)';
        parseInfo.push({
            'Line':line,
            'Type':'variable declaration',
            'Name':name,
            'Condition':'',
            'Value':value
        });
    }

    line++;
}