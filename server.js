const readline = require('readline');
const path= require('path')
const fs= require('fs')
const glob=require('glob')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.setPrompt('请输入目录地址：')
rl.prompt();

rl.on('line', (line) => {
    const d=path.resolve(line)
    rl.close();
    const stat = fs.lstatSync(d);
    if(!stat.isDirectory()){
        return console.log('请输入一个文件目录')
    }
    readFile(d)
})
function readFile(src) {
    let isUsed=false;
    let img=null;
    const read=(src)=>{
        if(isUsed) return;
        if(fs.lstatSync(src).isDirectory()){
            for(let item of fs.readdirSync(src)){
                if(isUsed) return;
                read(path.resolve(src,item))
            }
        }else if(/\.(html|ftl|js|css)$/.test(src)){
            if(fs.readFileSync(src,'utf-8').indexOf(img)!==-1){
                isUsed=true;
            }
        }
    }
    let n=0;
    glob.sync(src + '/**/*.{png,jpg}').forEach((image)=>{
        isUsed=false;
        img=path.basename(image)
        read(src)
        if(!isUsed){
            n++;
            fs.unlinkSync(image)
            console.log('删除：'+image)
        }
    })
    console.log('共删除图片数量为：'+n)
}