/**
 * AI Academic Resume
 * ------------------------------------------------------------
 * All content below is fictional example data.
 * The visual editor can edit this data without touching code.
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

  honors: "研究生一等奖学金、优秀学生奖、创新竞赛一等奖",

  sections: [
    {
      id: "education",
      type: "education",
      title: "教育经历",
      subtitle: "Education",
      items: [
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
      ]
    },

    {
      id: "selected-publications",
      type: "publication",
      title: "主要论文",
      subtitle: "Selected Publications",
      lead: "主要论文五篇（以下均为虚构示例，仅用于演示排版）",
      items: [
        {
          title: "GraphBridge: Structure-Aware Retrieval for Knowledge-Enhanced Language Models",
          venue: "ExampleConf 2026",
          level: "Top Conference",
          role: "第一作者",
          description: "提出一种结构感知检索框架，用于在复杂知识图中筛选与问题最相关的证据子图。方法结合路径约束与可微排序目标，使检索结果更适合后续语言模型推理。"
        },
        {
          title: "GeoFuse: Geometry-Preserving Parameter Fusion for Modular Language Models",
          venue: "ExampleAI 2026",
          level: "Conference",
          role: "共同一作",
          description: "面向多个轻量参数模块直接融合时可能出现的参数冲突问题，将参数变化分解为结构变化与残差信息，并在几何空间中分别进行融合。"
        },
        {
          title: "TruthFlow: Manifold-Guided Activation Editing for Hallucination Mitigation",
          venue: "ExampleML 2026",
          level: "Top Conference",
          role: "第二作者",
          description: "从隐藏状态流形出发构造真实性引导信号，并利用局部向量场对模型激活进行轻量干预，以减少事实性错误。"
        }
      ]
    },

    {
      id: "additional-publications",
      type: "simplePublication",
      title: "其他论文",
      subtitle: "Additional Publications",
      items: [
        {
          venue: "ExampleSys 2025",
          level: "Conference",
          title: "Prompt-Guided Contrastive Learning for Temporal Reasoning"
        },
        {
          venue: "ExampleMM 2026",
          level: "Conference",
          title: "Spectral Alignment for Multimodal Sentiment Representation"
        }
      ]
    },

    {
      id: "internships",
      type: "experience",
      title: "实习经历",
      subtitle: "Internship Experience",
      items: [
        {
          title: "示例科技公司｜大模型算法实习生",
          period: "2025.06 – 2025.09",
          summary: "参与企业级大模型应用研发，负责 RAG 检索链路优化、Prompt 设计与离线评测，协助构建数据清洗和自动化评估流程。"
        }
      ]
    },

    {
      id: "projects",
      type: "experience",
      title: "项目经历",
      subtitle: "Project Experience",
      items: [
        {
          title: "生成式图像编辑平台",
          period: "2023.08 – 2024.12",
          summary: "负责生成式图像编辑算法设计，基于参数高效微调与局部重绘机制实现风格迁移、区域编辑和可控生成。"
        },
        {
          title: "企业级 RAG 智能问答平台",
          period: "2025.01 – 至今",
          summary: "负责 RAG 问答、大模型微调与 Prompt 设计，构建向量检索、语义召回与知识库管理流程。"
        }
      ]
    },

    {
      id: "skills",
      type: "skills",
      title: "专业技能",
      subtitle: "Professional Skills",
      items: [
        "熟悉 Transformer 与主流大语言模型架构；了解 SFT、偏好优化、LoRA 等常见训练与微调技术。",
        "熟悉 PyTorch、Transformers、LangChain 等常用框架，能够进行模型训练、推理与应用开发。",
        "了解多模态大模型、Embedding、向量检索与 RAG 系统的基本原理与工程实现。",
        "具备 Agent 数据构造、工具调用、多轮对话与模拟环境搭建经验。"
      ]
    }
  ]
};
