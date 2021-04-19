<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
var md5 = require('md5');
import wasm from "../../pkg/index";
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

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
