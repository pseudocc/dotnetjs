# DotnetJs
.Net Framework support in javascript

## Get DotnetJs

1. Nodejs

    firstly, run ```npm install dotnetjs --save``` 

    If you are using typescript: 

        import * as DotnetJs from 'dotnetjs';

    else just like the others: 

        var DotnetJs = require('dotnetjs');

2. Amd

    run ```npm install dotnetjs --save``` 
    
    or download the files in the dist directory.

    ```<script src="dotnet.js"></script>```

    ```<script src="your.js"></script>```

    in your .ts file: 
    
    ```/// <reference path="dotnet.d.ts" />```
    
## Work with DotnetJs

DotnetJs uses similiar interface as it is in .Net Framework.

### Linq

If you are about to use complicated Linq Expressions, first make a instance of LinqStart:

    var expression = new Linq.LinqStart(enumerable);
    
the enumerable can be any type that implements IEnumerable, in addition, I implemented it for the Array. Then you can do like the following:

    expression.Where(...).Select(...).Execute();
    
remember to use ```ToArray``` or ```ToList``` to end the expression(if the result is IEnumerable).
