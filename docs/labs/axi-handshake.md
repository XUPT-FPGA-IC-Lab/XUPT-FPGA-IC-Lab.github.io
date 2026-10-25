# AXI 握手任务：Sync FIFO 与 AXI4-Lite

::: warning 建设中
本文档仍处于草稿阶段，内容与实验要求可能调整，仅供参考。具体任务安排与验收要求以实验室确认发布的版本为准。
:::

两个实验：**Sync FIFO** 和 **AXI4-Lite Slave**。目标是掌握数字设计中模块间通信的核心机制 —— valid-ready 握手，以及 项目开发中的git 协作流程。

环境搭建和仿真命令见[实验仓库中的 README](https://github.com/eugeci/easy_axi_lab#readme)；如 GitHub 访问不畅，可查看 [Gitee 仓库中的 README](https://gitee.com/eugeci/easy_axi_lab#readme)。

仓库在 github 和 gitee 各有一份，内容相同。如果遇到github的网络问题，可以换gitee。

仓库地址（github)：https://github.com/eugeci/easy_axi_lab

仓库地址（gitee)：https://gitee.com/eugeci/easy_axi_lab

## 获取仓库

先 fork 本仓库，[如何fork(github)](https://blog.csdn.net/xc_zhou/article/details/87984242),[如何fork(gitee)](https://www.cnblogs.com/pingguomang/p/18783891)然后：

```bash
# github
git clone https://github.com/<你的账号>/easy_axi_lab.git

# gitee
git clone https://gitee.com/<你的账号>/easy_axi_lab.git

cd easy_axi_lab
git checkout -b feature/my-impl
```

上游有更新时同步：

```bash
git remote add upstream <原始仓库地址>
git fetch upstream
git merge upstream/main
```

## 你要做什么

仓库里有两个 RTL 模块，代码接口与框架已经搭好，这是两个待完成的模块路径：

- `labs/fifo/rtl/sync_fifo.v`
- `labs/axi_lite/rtl/axi_lite_slave.v`

tb/ 下的 代码已经和rtl的顶层模块对接好了，默认情况下不需要修改。

## Valid-Ready 握手

这是整个实验的核心。在真实的数字系统中，两个模块之间不能假设对方永远就绪——发送方可能数据还没准备好，接收方可能还在处理上一笔数据。如果不管对方状态直接发，数据就丢了。valid-ready 握手解决了这个问题：双方各用一根信号线通知对方自己的状态，只在两边都准备好的那一拍才传数据。学会这套机制之后，你会发现很多模块之间的通信都是这样设计的，你也可以在自己的设计中使用它。

模块之间的数据传输通过 valid-ready 握手完成。以下规则适用于本实验中的 FIFO 通道和 AXI 通道：

- 当 `valid` 与 `ready` 在同一上升沿同时为 1 时，数据完成一次传输。
- 发送方不能等待 `ready` 才置位 `valid`；置位后必须维持 `valid` 与数据稳定，直到握手完成。
- 接收方可以根据自身能力决定何时置位 `ready`。AXI 接口需要满足输入和输出之间不存在组合路径的设计要求；本实验建议使用寄存器或缓冲控制生成 `ready`。
- 必须防止两个连接模块之间形成组合环。

FIFO 的两个通道（in/out）和 AXI 的五个通道，都遵循这套握手约定。Checker 会自动检查你有没有违反。

## Sync FIFO

之前你应该学习过通过调用IP核实现的FIFO求和实验，这次你需要结合valid-ready握手机制，自己用verilog实现一个FIFO模块。

参数：数据宽度 32 bit，深度 8。实现一个基于 valid-ready 握手的同步 FIFO。

需要了解的概念：

- 同步 FIFO 的基本结构：一块存储数组 + 读写指针
- 指针比地址多 1 bit，用最高位区分空和满
  - 空：`wptr == rptr`
  - 满：最高位不同，低位相同
- `$clog2` 系统函数
- 写：`in_valid && in_ready` 同时为 1 时存入
- 读：`out_valid && out_ready` 同时为 1 时读出
- 进阶：FIFO 满了但同一拍发生 pop 时，能不能立即接受 push

### 测试用例说明

| # | 名称                   | 考察点                           |
| - | ---------------------- | -------------------------------- |
| 1 | reset_behavior         | 复位后 out_valid 必须为 0        |
| 2 | single_push_pop        | 写一个、读一个、数据对得上       |
| 3 | empty_blocks_out_valid | FIFO 空的时候 out_valid 不能拉高 |
| 4 | fill_then_drain        | 填满 8 个再全部读出来            |
| 5 | full_blocks_in_ready   | FIFO 满的时候 in_ready 必须为 0  |

## AXI4-Lite Slave

16 个 32-bit 寄存器，地址范围 `0x00..0x3C`，4 字节对齐。实现一个 AXI4-Lite 从设备。

需要了解的概念：

- AXI4-Lite 有五个独立通道，每个通道有自己的 valid/ready 握手：
  - AW：写地址通道
  - W：写数据通道
  - B：写响应通道
  - AR：读地址通道
  - R：读数据通道
- 写事务流程：AW + W 都握手 → slave 写入寄存器 → 拉 B 通道返回响应
- 读事务流程：AR 握手 → slave 读出寄存器 → 拉 R 通道返回数据
- `wstrb` 是字节使能，4 bit 分别控制 4 个字节是否写入
- `bresp` / `rresp` 本实验中固定为 `OKAY`（2'b00）
- AW 和 W 到达顺序不固定，slave 必须两种情况都支持

### 测试用例说明

| # | 名称                   | 考察点                    |
| - | ---------------------- | ------------------------- |
| 1 | reset_behavior         | 复位后所有通道 valid 为 0 |
| 2 | single_write_b2b_ready | 一次简单写                |
| 3 | single_read_b2b_ready  | 写后读回，数据比对        |
| 4 | write_aw_before_w      | AW 通道先到、W 通道后到   |
| 5 | write_w_before_aw      | W 通道先到、AW 通道后到   |

## 学习路径

- 必做：FIFO
- 进阶：完成 AXI-Lite
- 再往后：了解 AXI4 的突发传输和乱序

## 调试建议

- 跑不过就看波形：`make wave LAB=fifo TC=N`，开 GTKWave 看信号
- checker 报 `valid_dropped_before_handshake` → 你的 valid 拉高后又掉下去了，检查“发送方置位 valid 后必须维持到握手完成”的规则
- 仿真卡住直到 global timeout → 大概率是某个 valid 或者 ready 永远没拉起来
- 数据对不上 → 去 `tb_top.sv` 里看 reference model 怎么算的，对比你的逻辑

## 提交

完成代码后：

```bash
git add labs/fifo/rtl/sync_fifo.v
git commit -m "完成 FIFO 实现"
git push origin feature/my-impl
```

然后在 GitHub / Gitee 上发起 Pull Request 到原始仓库的 main 分支。

## 参考资料

- AMBA AXI协议手册
- [AXI协议讲解](https://www.bilibili.com/video/BV1mD4y1p7UK/?share_source=copy_web&vd_source=6af02bd62e87634024ca82f448bec047)
