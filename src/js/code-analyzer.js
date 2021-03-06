import * as esprima from 'esprima';
let parseInfo=[];
let line=1;
let typeToHandlerMapping=new Map();

const parseCode = (codeToParse) => {
    parseInfo=[];
    line=1;

    let ans=esprima.parseScript(codeToParse);
    initiateMap();
    return ans;
};

export {parseCode};
export {parseInfo};
export {createParseInfo};
export {functionCode};


//checked
function createParseInfo(parsedCode){
    try{
        funcHeader(parsedCode);
        functionCode((parsedCode.body)[0].body.body);
    }
    catch (e) {
        return 'Illigal input';
    }
}

//save function header
function funcHeader(parsedCode) {
    let name=(parsedCode.body)[0].id.name;
    //header
    parseInfo.push({Line:line, Type:'function declaration', Name:name, Condition:'', Value:''});
    for(let i=0;i<(parsedCode.body)[0].params.length;i++)        //find params
    {
        let curr=(parsedCode.body)[0].params[i];
        parseInfo.push({
            Line:line,
            Type:'variable declaration',
            Name:curr.name,
            Condition:'',
            Value:''
        });
    }
    line++;}

//save function code
function functionCode(parseBody) {
    for(let i=0;i<parseBody.length;i++) {
        handleItem(parseBody[i]);
    }
}

function handleItem(item) {
    let type=item.type;
    let func = typeToHandlerMapping[type];
    func.call(undefined,item);
}

//checked
function handleReturn(body) {
    let value=getValue(body.argument);
    parseInfo.push({
        'Line':line,
        'Type':'return statement',
        'Name':'',
        'Condition':'',
        'Value':value
    });
    line++;
}

//checked
function handleIf(body,type) {
    let condition=getBinaryExp(body.test);
    if(type == null)
        type='if statement';
    parseInfo.push({
        'Line':line,
        'Type':type,
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
    handleElse(body.alternate);}

//checked
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
            functionCode(alternate.body);
        else
            handleItem(alternate);
    }

}

//checked
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

//return string of an item - checked - ??
function getValue(value) {
    // if(value.type==('BinaryExpression'))
    //     return getBinaryExp(value);
    // else if(value.type==('Identifier'))
    //     return value.name;
    // else if(value.type==('Literal'))
    //     return value.value;
    // else if(value.type=='UnaryExpression')
    //     return value.operator+''+value.argument.value;
    let func = typeToHandlerMapping[value.type];
    return func.call(undefined,value);
}

function BinaryExpression(value)
{
    return getBinaryExp(value);
}

function Identifier(value)
{
    return value.name;
}

function Literal(value)
{
    return value.value;
}

function UnaryExpression(value)
{
    return value.operator+''+value.argument.value;
}

//find expression to string - checked - ??
function getBinaryExp(test) {
    let left=test.left;
    let right=test.right;
    left=binaryOneSide(left);
    right=binaryOneSide(right);

    return left+''+test.operator+''+right;
}

//checked - ??
function binaryOneSide(left) {
    let func = typeToHandlerMapping[left.type];
    let temp= func.call(undefined,left);
    if(left.type==('BinaryExpression'))
        left='('+temp+')';
    else
        left=temp;
    return left;
}

function MemberExpression(value)
{
    return value.object.name+'['+getValue(value.property)+']';
}

function initiateMap() {
    typeToHandlerMapping=new Map();
    typeToHandlerMapping['VariableDeclaration']=handleVarDec;
    typeToHandlerMapping['ExpressionStatement']=handleExpression;
    typeToHandlerMapping['IfStatement']=handleIf;
    typeToHandlerMapping['ReturnStatement']=handleReturn;
    typeToHandlerMapping['WhileStatement']=handleWhile;
    typeToHandlerMapping['ForStatement']=handleFor;
    typeToHandlerMapping['AssignmentExpression']=handleAss;
    typeToHandlerMapping['UpdateExpression']=handleUpdate;

    typeToHandlerMapping['BinaryExpression']=BinaryExpression;
    typeToHandlerMapping['Identifier']=Identifier;
    typeToHandlerMapping['Literal']=Literal;
    typeToHandlerMapping['UnaryExpression']=UnaryExpression;
    typeToHandlerMapping['MemberExpression']=MemberExpression;
}

//assignment - checked
function handleExpression(body) {
    let type=body.expression.type;
    let func = typeToHandlerMapping[type];
    func.call(undefined,body.expression);
    line++;
}

function handleAss(body) {
    let name=body.left.name;
    let value=body.right;
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

function handleUpdate(body) {
    let name=body.argument.name;
    let operator=body.operator;
    parseInfo.push({
        'Line':line,
        'Type':'update expression',
        'Name':name,
        'Condition':'',
        'Value':name+''+operator
    });

}

//checked
function handleVarDec(body) {
    for(let i=0;i<body.declarations.length;i++)
    {
        let curr=body.declarations[i];
        let name=curr.id.name;
        let value='null(or nothing)';
        if(curr.init!=null)
            value=getValue(curr.init);
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

//checked
function handleFor(body) {
    //for head
    let condition=body.init.declarations[0].id.name+'='+getValue(body.init.declarations[0].init);
    condition=condition+';'+getBinaryExp(body.test)+';'+body.update.argument.name+body.update.operator;
    parseInfo.push({
        'Line':line,
        'Type':'for statement',
        'Name':'',
        'Condition':condition,
        'Value':''
    });
    line++;
    functionCode(body.body.body);

}