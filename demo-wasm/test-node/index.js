var md5 = require('md5');
let wasm = require("../pkg/hello_wasm")
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
    console.time('js');
    console.log('%cjsMd5:' + md5(str), 'color:blue');
    console.timeEnd('js');
    //打印wasm生成的md5及所需时间
    console.time('wasm');
    console.log('%cwasmMd5:' + module.digest(str), 'color:green');
    console.timeEnd('wasm');
})();