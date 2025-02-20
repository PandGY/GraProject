核心功能模块设计

src/
├── api/              # 接口服务层
│   ├── auth.ts       # 认证接口
│   ├── contract.ts   # 合同操作接口
│   └── ipfsHelper.ts # IPFS 工具类
├── components/
│   ├── EncryptedUpload.vue  # 加密上传组件
│   └── CIDVisualizer.vue     # CID 可视化组件
├── views/
│   ├── LoginView.vue        # 登录注册
│   ├── DashboardView.vue    # 主控制台
│   ├── ContractDetail.vue   # 合同详情
│   └── VerifyView.vue       # 核验页面
└── stores/           # Pinia 状态管理
    └── useAuthStore.ts