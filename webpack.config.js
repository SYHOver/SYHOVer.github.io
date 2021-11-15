// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const conf = getConfig({
  modules:['index']  //新增模块
});

const config = {
  entry:conf.entry,
  output: {
    filename: '[name]/[name].[chunkhash].js',
    path: path.resolve(__dirname, "docs"),
    clean: true,
  },
  devServer: {
    open: true,
    host: "localhost",
    hot:true,
    static: './docs',
  },
  plugins: [
    ...conf.html
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.less$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

function getConfig(props){
  let entry = {};
  let html = [];
  let modules = props.modules || [];
  modules.forEach(name=>{
    entry[name] = [`./src/${name}/${name}.js`, `./src/${name}/${name}.less`];
    html.push(new HtmlWebpackPlugin({
      template: `src/${name}/${name}.html`,
      filename: `${name}.html`,
      chunks: [`${name}`]
    }))
  })
  return {
    entry,
    html
  }
}

module.exports = async () => {
  if (isProduction) {
    config.mode = "production";
    config.plugins.push(new MiniCssExtractPlugin({
      filename: '[name]/[name].[contenthash].css'
    }));
  } else {
    config.mode = "development";
  }
  return config;
};

const fs = require("fs");
class FileSystem {
    constructor(params) {
        this.baseDir = params.baseDir;
    }

    /**
      * @description 该方法是用来写文件的
      * @param fileName <arr>  文件的名字
      */
    writeFiles(fileName) {
            fs.writeFile(fileName,fileName, function () {})
    }


    /**
    * @description  该方法是用来得到文件格式的
    * @param filename <string> 文件名称
    * @returns <arr> 文件格式
    * **/
    formatFile(fileName) {
        return [
            {
                name: "./src/" + fileName + "/" + fileName + ".js",
                content: fileName + ".js"
            },
            {
                name: "./src/" + fileName + "/" + fileName + ".html",
                content: fileName + ".html"
            },
            {
                name: "./src/" + fileName + "/" + fileName + ".less",
                content: fileName + ".less"
            }
        ]
    }


    /**
 * @description  如果有该文件返回true
 * @param filename,  <string> 文件名称  
 * @param type,      <number> 是文件还是文件夹
 * @returns <Boolean>
 * **/
    //
    getStat(fileName, type) {
        return new Promise(function (resolve) {
            var exists = false;  //默认false  文件不存在
            fs.access(fileName, function (err) {
                if (!err) {
                    exists = true;    //先判断是否有这个文件或文件价  如果有再进行判断
                }
                if (exists) {
                    fs.stat(fileName, function (err, data) {
                        //type =1 判断是不是文件夹   2判断是不是文件
                        if (!err) {
                            type == 1 ? exists = data.isDirectory() : exists = data.isFile();
                            resolve(exists);
                        }
                    })
                } else {
                    resolve(exists);
                }
            })
        })
    }

    readdirFiles(templateUrl) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            fs.readdir(_this.baseDir + "/" + templateUrl, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    /**
     * @description  该方法是用来复制文件的
     * @param filename <string> 文件名称
     * @param templateUrl <string> 复制模板路径
     * **/
    async copyFiles(fileName, templateUrl) {
        let src = "./src/";
        let data = await this.readdirFiles(templateUrl);
        for (let i = 0; i < data.length; i++) {
            let tailArr = data[i].split(".");
            fs.copyFile(src + templateUrl + "/" + data[i], src + fileName + "/" + fileName + "." + tailArr[tailArr.length - 1], function () { })
        }
    }

    mkdir(fileName) {
        let str = "/";
        fs.mkdir(this.baseDir + str + fileName, async function(){})
    }

    generateModules(fileObj) {
        let str = "/";
        var _this = this;
        fileObj.modules.forEach(async (fileName, index) => {
            let res = await _this.getStat(_this.baseDir + str + fileName, 1);
            if (res) {
                let res = await _this.getStat(_this.formatFile(fileName)[index].name,2);
                if (res && fileObj.replace) {
                    _this.copyFiles(fileName, fileObj.template);
                } else {
                    _this.writeFiles(_this.formatFile(fileName)[index].name);
                }
            } else {
                _this.mkdir(fileName);
                _this.copyFiles(fileName, fileObj.template);
            }
        })
    }
}

let fileSystem = new FileSystem({
    baseDir: './src'
})

var modules = ['home', 'article', 'articleDetail'];

fileSystem.generateModules({
    modules,   //模块名的集合，必填项
    template: 'template',   //创建模块所依赖的模板， 非必填项，如不填，默认指的是 this.baseDir + '/' + template 文件夹；
    replace: false //非必填项， 默认为false，如果是false，在创建模板时，不会替换掉之前已存在的文件内容， ture是强制替换现有的模板文件及文件内容；
});
