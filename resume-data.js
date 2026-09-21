/**
 * AI Academic Resume
 * ------------------------------------------------------------
 * 这里的数据全部是虚构示例，仅用于展示模板结构与排版效果。
 * 请直接修改本文件来维护你的个人简历。
 */
window.resumeData = {
  basics: {
    name: "示例同学",
    title: "人工智能 / 大模型方向",
    intent: "研究方向：检索增强生成（RAG） · 多智能体系统（MAS） · 模型压缩 · 大模型可解释性",
    summary: "某高校人工智能方向研究生，研究聚焦大语言模型、多智能体协作、检索增强生成与模型高效化，具有学术研究与工程项目实践经历。",
    phone: "138-0000-0000",
    email: "example@example.com",
    hometown: "示例省示例市",
    birth: "2000 年 1 月",
    political: "示例信息",
    currentResidence: "示例市",
    avatar: ""
  },

  education: [
    {
      school: "示例科技大学（人工智能学院）",
      major: "人工智能",
      degree: "硕士",
      period: "2024.09 – 2027.06"
    },
    {
      school: "示例大学（计算机学院）",
      major: "计算机科学与技术",
      degree: "本科",
      period: "2020.09 – 2024.06"
    }
  ],

  honors: "研究生一等奖学金、优秀学生奖、创新竞赛一等奖",

  publicationSummary: "主要论文五篇（以下均为虚构示例，仅用于演示排版）",

  publications: [
    {
      title: "GraphBridge: Structure-Aware Retrieval for Knowledge-Enhanced Language Models",
      venue: "ExampleConf 2026",
      level: "Top Conference",
      role: "第一作者",
      description: "提出一种结构感知检索框架，用于在复杂知识图中筛选与问题最相关的证据子图。方法结合路径约束与可微排序目标，使检索结果更适合后续语言模型推理，并在多个虚构基准上取得稳定提升。"
    },
    {
      title: "GeoFuse: Geometry-Preserving Parameter Fusion for Modular Language Models",
      venue: "ExampleAI 2026",
      level: "Conference",
      role: "共同一作",
      description: "面向多个轻量参数模块直接融合时可能出现的参数冲突问题，将参数变化分解为结构变化与残差信息，并在几何空间中分别进行融合，以降低知识干扰并提升模块组合后的稳定性。"
    },
    {
      title: "TruthFlow: Manifold-Guided Activation Editing for Hallucination Mitigation",
      venue: "ExampleML 2026",
      level: "Top Conference",
      role: "第二作者",
      description: "从隐藏状态流形出发构造真实性引导信号，并利用局部向量场对模型激活进行轻量干预。该方法旨在减少事实性错误，同时保持模型原有语言能力与推理效率。"
    },
    {
      title: "CacheTalk: Efficient Latent Communication for Heterogeneous Multi-Agent Systems",
      venue: "ExampleLR 2027",
      level: "Top Conference",
      role: "共同一作",
      description: "提出一种面向异构多智能体系统的潜表示通信机制，通过压缩、筛选与对齐中间缓存信息，在减少显式自然语言通信开销的同时保留更丰富的推理上下文。"
    },
    {
      title: "LiteEmotion: Balanced Pseudo-Label Learning for Lightweight Conversational Models",
      venue: "ExampleNLP 2027",
      level: "Conference",
      role: "第一作者",
      description: "针对轻量模型在对话情感识别中的类别不平衡与标注不足问题，引入数据生成、结构约束与渐进式伪标签优化，使小规模模型在有限监督条件下获得更稳定的性能。"
    }
  ],

  otherPublications: [
    {
      venue: "ExampleSys 2025",
      level: "Conference",
      title: "Prompt-Guided Contrastive Learning for Temporal Reasoning"
    },
    {
      venue: "ExampleMM 2026",
      level: "Conference",
      title: "Spectral Alignment for Multimodal Sentiment Representation"
    },
    {
      venue: "ExampleVision 2026",
      level: "Conference",
      title: "Object-Centric Spatio-Temporal Reasoning for Audio-Visual Question Answering"
    },
    {
      venue: "ExampleWeb 2026",
      level: "Conference",
      title: "Evidence Recombination for Multi-Hop Retrieval-Augmented Generation"
    },
    {
      venue: "ExampleAI 2026",
      level: "Conference",
      title: "Order-Sensitive Parameter Fusion with Lie-Algebraic Modeling"
    },
    {
      venue: "ExampleNLP 2026",
      level: "Conference",
      title: "Efficient Contrastive Learning for Conversational Understanding"
    }
  ],

  projects: [
    {
      title: "项目 1｜生成式图像编辑平台",
      period: "2023.08 – 2024.12",
      summary: "负责生成式图像编辑算法设计，基于参数高效微调与局部重绘机制实现风格迁移、区域编辑和可控生成，并围绕掩码偏移、图像抖动与生成稳定性进行工程优化。"
    },
    {
      title: "项目 2｜企业知识图谱智能分析",
      period: "2024.03 – 2024.10",
      summary: "负责多源数据融合与知识图谱构建，完成实体关系抽取、图谱建模与关联推理，并面向异常分析、风险识别与溯源场景设计检索和推理流程。"
    },
    {
      title: "项目 3｜多智能体协同决策系统",
      period: "2024.07 – 2025.06",
      summary: "面向预测与决策任务构建多个功能智能体，设计多智能体协同机制，并融合环境、历史状态与任务上下文信息，为复杂场景下的自动化决策提供支持。"
    },
    {
      title: "项目 4｜企业级 RAG 智能问答平台",
      period: "2025.01 – 至今",
      summary: "负责 RAG 问答、大模型微调与 Prompt 设计，构建向量检索、语义召回与知识库管理流程，实现制度问答、文本分类、信息抽取、意图识别与风险预警等能力。"
    }
  ],

  skills: [
    "熟悉 Transformer 与主流大语言模型架构；了解 SFT、偏好优化、LoRA 等常见训练与微调技术。",
    "熟悉 PyTorch、Transformers、LangChain 等常用框架，能够进行模型训练、推理与应用开发。",
    "了解多模态大模型、Embedding、向量检索与 RAG 系统的基本原理与工程实现。",
    "具备 Agent 数据构造、工具调用、多轮对话与模拟环境搭建经验，能够进行智能体工作流设计与评估。"
  ]
};
