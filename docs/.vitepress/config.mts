
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'FPGA & IC 创新实验室',
  description: '西安邮电大学 FPGA & IC 创新实验室',

  // 组织主页仓库：<组织名>.github.io
  base: '/',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '教程', link: '/labs/' },
      { text: '研究与项目', link: '/projects/' },
      { text: '关于我们', link: '/about/' }
    ],

    sidebar: {
      '/labs/': [
        {
          text: '实验教学',
          items: [
            { text: '实验目录', link: '/labs/' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    },

    outline: {
      label: '本页目录'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})

