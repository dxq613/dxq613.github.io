# 如何给 bui 贡献文档

1. 如何参与讨论
2. 如何提交 patch

## 如何参与讨论

### 旺旺群

加入旺旺群 **778141976** 和更多人一起讨论 bui 

### QQ群
QQ群： 138692365


## 如何提交 patch

### 文档规范

### 环境： 无

### 提交文档

fork bui 文档项目 https://github.com/dxq613/dxq613.github.io/fork

进入一个目录，例如

    cd /path/my

clone bui 到本地

    git clone git@github.com:username/dxq613.github.io.git

username 为你的 github 用户名

进入新 clone 的 dxq613.github.io 目录

    cd dxq613.github.io

添加 官方 master

    git remote add remote https://github.com/dxq613/dxq613.github.io.git

开始新 patch 前要和官方主干同步

    git pull remote master

### 对应于 github issues 提供 patch

可以先[提交issue](https://github.com/dxq613/dxq613.github.io/issues)

**永远不要把 patch 提交到你的主干！**

**一定要使用 issue 分支！**

确保你的主干和官方同步

    git checkout master
    git pull remote master


建立一个新分支，该分支名为 issue_ 加 issue 数字

    git checkout -b issue_###

"###" 为你提交的 issue 号码，现在你已经切换到了 issue_### 分支


下面对你修改的代码进行 stage 操作

    git add filename

注意不要使用: **git add .**

一旦你 stage 了你修改的所有文件，运行以下命令提交

    git commit -m "简介. Fixes #xxx"

对于多行注释，只要运行 **git commit** 然后在其后的界面输入多行注释

然后把你的 patch 提交到你的 github

    git push origin -u issue_###

在进行下个 patch 开始前，请切换到 master 分支

    git checkout master

最后到的 github 界面，点击 pull request 即可
