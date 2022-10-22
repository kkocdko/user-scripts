0 . 如果你不知道什么是用户脚本，请 [安装一个用户脚本管理器](https://greasyfork.org/zh-CN#home-step-1)。

1 . 确保所有希望包含在报告内的题目都已获得 AC。

2 . 安装此脚本，修改源码头部的配置。

```js
const cfg = {
  homeworkId: 2, // 作业序号
  studentName: "Ninja", // 姓名
  problems: [
    // 题目列表（通常无需修改）
    "ch0104/01",
    "ch0104/03",
```

3 . 打开 <http://noi.openjudge.cn>，将自动生成报告并触发下载。

4 . 未使用时在脚本管理器中禁用即可。
