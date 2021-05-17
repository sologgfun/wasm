var md5 = require('md5');
//nodejs 直接调用
let wasm = require("./node-pkg/hello_wasm")
//打包rust调用
//let wasm = require("../Cargo.toml")
function randomString(e) {
    e = e || 32;
    var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = '';
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}

(async _ => {
    const module = await wasm;         //引入wasm对象
    const str = randomString(999999);  //生成999999位随机字符串
    //打印js生成的md5及所需时间
    var begin=Date.now();
    console.log('jsMd5:' + md5(str), 'color:blue');
    var end= Date.now();
    var timeSpent=(end-begin)/1000+"secs";;
    console.log(`js:${timeSpent}`);
    //打印wasm生成的md5及所需时间
    begin=Date.now();
    console.log('wasmMd5:' + module.digest(str), 'color:green');
    end= Date.now();
    timeSpent=(end-begin)/1000+"secs";;
    console.log(`wasm:${timeSpent}`);

    console.log('===100===')
    let i = 0
    begin=Date.now();
    while (i<10) {
        md5(randomString(999999));
        i++;
    }
    end= Date.now();
    timeSpent=(end-begin)/1000+"secs";;
    console.log(`js100:${timeSpent}`);

    let j = 0
    begin=Date.now();
    while (j<10) {
        module.digest(randomString(999999));
        j++;
    }
    end= Date.now();
    timeSpent=(end-begin)/1000+"secs";;
    console.log(`md5100:${timeSpent}`);

})();

// module.exports = {
//     handler: async (event, context) => {
//         const module = await wasm;         //引入wasm对象
//         const str = randomString(999999);  //生成999999位随机字符串
//         //打印js生成的md5及所需时间
//         var begin=Date.now();
//         console.log('jsMd5:' + md5(str), 'color:blue');
//         var end= Date.now();
//         var timeSpent=(end-begin)/1000+"secs";;
//         console.log(`js:${timeSpent}`);
//         //打印wasm生成的md5及所需时间
//         begin=Date.now();
//         console.log('wasmMd5:' + module.digest(str), 'color:green');
//         end= Date.now();
//         timeSpent=(end-begin)/1000+"secs";;
//         console.log(`wasm:${timeSpent}`);
//     }
//   }