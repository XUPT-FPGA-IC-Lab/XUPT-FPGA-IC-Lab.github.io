
import { defineConfig } from 'vitepress'

const labSidebar = [
  {
    text: '基础训练',
    items: [
      { text: '总目录', link: '/labs/' },
      { text: '基础自检', link: '/labs/basic-circuit' },
      { text: '流水灯实验', link: '/labs/led' },
      { text: '数码管驱动与按键消抖', link: '/labs/second-task' },
      { text: '小课设', link: '/labs/mini-project' }
    ]
  },
  {
    text: '通信与显示',
    items: [
      { text: '串口协议学习与应用', link: '/labs/uart' },
      { text: 'AXI 握手任务', link: '/labs/axi-handshake' },
      { text: 'VGA 图像显示实验', link: '/labs/vga' }
    ]
  },
  {
    text: '工具使用',
    items: [
      { text: 'git基础使用', link: '/labs/tools/git' },
      { text: 'Linux系统基础', link: '/labs/tools/linux' }
    ]
  }
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'FPGA & IC 创新实验室',
  description: '西安邮电大学 FPGA & IC 创新实验室',

  // 组织主页仓库：<组织名>.github.io
  base: '/',

  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/XUPT-FPGA-IC-Lab/XUPT-FPGA-IC-Lab.github.io',
        ariaLabel: '本网站 GitHub 仓库'
      }
    ],

    nav: [
      { text: '首页', link: '/' },
      { text: '实验任务', link: '/labs/' },
      { text: '研究与项目', link: '/projects/' },
      { text: '关于我们', link: '/about/' }
    ],

    sidebar: {
      '/labs/': labSidebar
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

