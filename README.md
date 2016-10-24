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

    var expression = Linq.LinqStart(enumerable);
    
the enumerable can be any type that implements IEnumerable, in addition, I implemented it for the Array. Then you can do like the following:

    expression.Where(...).Select(...).ToArray();

Or use:

    Linq.Where(enumerable, ...).Select(...).ToArray();
    
remember to use ```ToArray``` or ```ToList``` to end the expression(if the result is still IEnumerable).

### Indexer for the collections

As there isn't have a way to implement indexer in typescript. You have to call the element of List or IDictionay, by using ```GetValue(index || key)``` and ```SetValue(index || key, value)```, but not ```collection[index || key]```.

### GetHashCode

Both object, string, boolean or number are supported for the GetHashCode Method, actually for the object, it is more likely to be called as a 'unique id'.

To get a new hashcode for an object, call the method with parameter 'ture'.

### HashTable or Dictionary?

HashTable is actually the class rewrited from System.Collections.Dictionary, using hashcode to reduce the time complexity.
