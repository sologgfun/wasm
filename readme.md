# WebAssembly

## 什么是WebAssembly?

> WebAssembly是一种将JavaScript以外的编程语言运行在浏览器的方法。所以当人们说 WebAssembly 更快的时候，一般来讲是与 JavaScript 相比而言的。

### 一些关于性能的历史

JavaScript 于 1995 年问世，它的设计初衷并不是为了执行起来快，在前 10 个年头，它的执行速度也确实不快。

紧接着，浏览器市场竞争开始激烈起来。

被人们广为传播的“性能大战”在 2008 年打响。许多浏览器引入了 **Just-in-time 编译器**，也叫 JIT。基于 JIT 的模式，JavaScript 代码的运行渐渐变快。

正是由于这些 JIT 的引入，使得 JavaScript 的性能达到了一个转折点，JS 代码执行速度快了 10 倍。

![性能](https://testwjf.oss-cn-shanghai.aliyuncs.com/v2-2b532115c6e74fdf016ceb17b279c221_1440w.png)

## 一个C++与JS的实验

---

## Just-in-time (JIT) 工作原理

> JavaScript 的启动比较缓慢，但是通过 JIT 可以使其变快，那么 JIT 是如何起作用的呢？

### Q:JavaScript 在浏览器中是如何运行的？
> JavaScript 引擎的工作就是把人类的语言转换成机器能看懂的语言。

![jit](https://pic3.zhimg.com/80/v2-ba1812d24cd3bd3fd5ce2f976c683722_1440w.png)

### Q:解释器和编译器的区别？

1. 如果是通过解释器，翻译是一行行地边解释边执行
> ![jit](https://pic2.zhimg.com/80/v2-3e3d960264590f2496a2b12afe5b5bb9_1440w.png)

2. 编译器是把源代码整个编译成目标代码，执行时不再需要编译器，直接在支持目标代码的平台上运行。
> ![jit](https://pic2.zhimg.com/80/v2-0b601888e312f2d362ba64cb5ee502c5_1440w.png)

3. 解释器的利弊
> 不需要等待整个编译过程完成就可以运行你的代码。从第一行开始翻译，就可以依次继续执行了。
可是当你运行同样的代码一次以上的时候，解释器的弊处就显现出来了。比如你执行一个循环，那解释器就不得不一次又一次的进行翻译，这是一种效率低下的表现。

4. 编译器的利弊
> 它需要花一些时间对整个源代码进行编译，然后生成目标文件才能在机器上执行。对于有循环的代码执行的很快，因为它不需要重复的去翻译每一次循环。

5. Just-in-time 编译器：综合了两者的优点
> 不同的浏览器实现这一功能的方式不同，不过其基本思想是一致的。在 JavaScript 引擎中增加一个监视器（也叫分析器）。监视器监控着代码的运行情况，记录代码一共运行了多少次、如何运行的等信息。

> ![jit](https://pic2.zhimg.com/80/v2-e8f36d5ee87844d0798528a605d00dd5_1440w.png)

以V8为例，既有`解释器（Ignition）`，也有`编译器（TurboFan）`。

如果同一行代码运行了几次，这个代码段就被标记成了 `“warm”`，如果运行了很多次，则被标记成 `“hot”`。

6. 基线编译器
> 如果一段代码变成了 “warm”，那么 JIT 就把它送到编译器去编译，并且把编译结果存储起来，尽可能的复用编译后的代码。

7. 优化编译器
> 如果一个代码段变得 “very hot”，监视器会把它发送到优化编译器中。生成一个更快速和高效的代码版本出来，并且存储之。

> 基于推理的优化（Speculative Optimazition）
优化编译器使用解释器收集的信息来进行假设，并且基于这些假设进行优化（例如，对象属性总是以特定的顺序出现）。

```js
function arraySum(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
}
```
+= 循环中这一步看起来很简单，只需要进行一步计算，但是恰恰因为是用动态类型，他所需要的步骤要比你所想象的更复杂一些。

我们假设 arr 是一个有 100 个整数的数组。当代码被标记为 “warm” 时，基线编译器就为函数中的每一个操作生成一个桩。sum += arr[i]会有一个相应的桩，并且把里面的 += 操作当成整数加法。
> 将加法编译为机器码存起来

但是，sum 和 arr[i] 两个数并不保证都是整数。因为在 JavaScript 中类型都是动态类型，在接下来的循环当中，arr[i] 很有可能变成了string 类型。整数加法和字符串连接是完全不同的两个操作，会被编译成不同的机器码。

所以 JIT 在每行代码被执行的时候都会检查数据类型

> ![jit](https://pic4.zhimg.com/80/v2-eda86cdd0b7e0b00c876bf3d053b440f_1440w.png)

优化编译器中，整个函数被统一编译，这样的话就可以在循环开始执行之前进行类型检查。

> ![jit](https://pic3.zhimg.com/80/v2-b7387c3dc140753eb60482aaede0c046_1440w.png)

但是，如果这些假设无效，优化编译器将执行 去优化，丢弃优化的代码。这一过程叫做**去优化**。

通常优化编译器会使得代码变得更快，但是一些情况也会引起一些意想不到的性能问题。如果你的代码一直陷入优化<->去优化的怪圈，那么程序执行将会变慢，还不如基线编译器快。
> 大多数的浏览器都做了限制，当优化/去优化循环发生的时候会尝试跳出这种循环。

## 一个JIT的实现

## WebAssembly的原理？
> 还没学到

## 一些QA

### WASM == 汇编级性能？

> 这显然不对，WASM 里的 Assembly 并不意味着真正的汇编码，而只是种新约定的字节码，也是需要解释器运行的。这种解释器肯定比 JS 解释器快得多，但自然也达不到真正的原生机器码水平。

一个在 WASM 和 JS 之间做性能对比的经典案例，就是 Mozilla 开发者和 V8 开发者的battle现场。整个过程是这样的：

1. Mozilla Hacks 发表了一篇名为 用 Rust 和 WASM 优化 Source Map 性能 的博文，将 source-map 这个 JS 包的性能优化了五倍。
2. V8 核心开发 Vyacheslav Egorov 回应了名为 你也许不需要用 Rust 和 WASM 来优化 JS 的博文，用纯 JS 实现了速度比 Rust 更快的惊人优化。
3. 原文作者以 无需魔法的速度 为名展开了进一步讨论，并用 Rust 做出了新的性能优化。

最终 Vyacheslav 给出了一张三轮过招后的性能对比图
> 虽然最终还是 Rust 更快，但 JS 被逼到极限后还胜出了一回合

![性能对比](https://pic4.zhimg.com/80/v2-a6f5a4d5ee2b68ec8aecbd8340ca4c73_1440w.jpg)

### WASM 比 JS 快，所以计算密集型应用就该用它？
> WASM不支持GPU设备计算加速
WASM 同样是 CPU 上的计算。对于可以高度并行化的任务，使用 WebGL 来做 GPU 加速往往更快。

至于浏览器内 AI 计算的性能方面，社区的评测结论也是 WebGL 和 WebMetal 具备最高的性能水平，然后才是 WASM

### 只要嵌入 WASM 函数到 JS 就能提高性能？

既然 WASM 很快，那么是不是我只要把 JS 里 const add (a, b) => a + b 这样的代码换成用 C 编译出来的 WASM，就可以有效地提高性能了呢？

由于JIT的存在，add 函数如果始终都在算整数加法，那么 JS 引擎就会自动编译出一份计算 int a + int b 的机器码来替代掉原始的 JS 函数，这样高频调用这个函数的性能就会得到极大的提升

## 参考资料
1. [WebAssembly](https://zhuanlan.zhihu.com/p/25800318)
2. [一个白学家眼里的 WebAssembly](https://zhuanlan.zhihu.com/p/102692865)
3. [【译】JavaScript工作原理：V8编译器的优化](https://juejin.cn/post/6844903958234791944#heading-5)
4. [编译原理:JavaScript编译器（二）：V8的解释器和优化编译器](https://time.geekbang.org/column/article/263523?utm_source=related_read&utm_medium=article&utm_term=related_read)
5. [JIT 即时编译的原理](https://zhuanlan.zhihu.com/p/46917559)