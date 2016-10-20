# DotnetJs
.Net Framework support in javascript

## Working with DotnetJs

0. Nodejs

run ```npm install dotnetjs --save``` first

If you are using typescript: 

```import * as DotnetJs from 'dotnetjs';```

else just like the others: 

```var DotnetJs = require('dotnetjs');```

0. Amd

run ```npm install dotnetjs --save``` or download the files in the dist directory.

    <script src="dotnet.js"></script>

    <script src="your.js"></script>

    in your .ts file: 
    
    /// <reference path="dotnet.d.ts" />