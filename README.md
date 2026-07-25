# LMN516 v2

这是一个已经接好 WordPress REST API 的 Next.js 前端。

## 它会怎么工作

- 你仍然在原来的 WordPress 后台写文章
- 新网站会通过 `https://lmn516.com/wp-json/wp/v2/posts` 自动读取文章
- 首页、归档页和文章页会自动更新
- 当前 WordPress 主题不再决定访客看到的样子

## 最省事的上线方式

### 1. 上传到 GitHub

新建一个仓库，例如 `lmn516-v2`，把这个文件夹里的全部文件上传进去。

### 2. 导入 Vercel

登录 Vercel，选择 `Add New Project`，导入刚才的 GitHub 仓库。

环境变量填写：

- `WORDPRESS_URL` = `https://lmn516.com`
- `NEXT_PUBLIC_SITE_URL` = `https://lmn516.com`

然后点击 Deploy。

### 3. 先使用测试网址

Vercel 会生成一个类似：

`lmn516-v2.vercel.app`

先检查文章、图片、手机端和所有页面。

### 4. 最后再绑定正式域名

测试通过后，才把 `lmn516.com` 绑定到 Vercel。

注意：正式切换时，WordPress 最好改到子域名，例如：

`cms.lmn516.com`

否则同一个根域名不能同时既指向新版前端，又继续直接承载旧 WordPress。正式切换前必须先备份数据库和 `wp-content/uploads`。

## 本地预览

安装 Node.js 后运行：

```bash
npm install
npm run dev
```

浏览器打开：

`http://localhost:3000`
