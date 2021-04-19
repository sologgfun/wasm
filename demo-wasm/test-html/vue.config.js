const path = require("path");
console.log(path.resolve('../pkg/'))
module.exports = {
    lintOnSave: false,
    devServer: {
        overlay: {
            warning: false,
            errors: false
        }
    },
    configureWebpack:{
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [path.resolve('../pkg/')], // 你的wasm文件路径
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    }
}