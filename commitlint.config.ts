import { defineConfig } from 'cz-git';

/**
 * 提交信息长度配置
 * 统一管理各种长度限制，确保提交信息规范性
 */
const LENGTH_CONFIG = {
  /** 提交简述最小长度，避免过于简单的描述 */
  MIN_SUBJECT_LENGTH: 5,
  /** 提交简述最大长度，保持标题简洁性 */
  MAX_SUBJECT_LENGTH: 80,
  /** 完整提交头部最大长度 (type(scope): subject) */
  MAX_HEADER_LENGTH: 100,
};

/**
 * 提交类型配置
 * 遵循 Conventional Commits 规范，支持变更日志自动生成
 */
const TYPE_CONFIG = [
  { value: 'feat', name: '✨  feat:      新增功能' },
  { value: 'fix', name: '🐛 fix:       修复问题' },
  { value: 'wip', name: '🚧 wip:       开发中 (临时提交)' },
  { value: 'docs', name: '📚 docs:      文档更新' },
  { value: 'style', name: '🎨 style:     代码格式 (不影响功能)' },
  { value: 'refactor', name: '♻️ refactor:  重构代码 (非新功能非修复)' },
  { value: 'perf', name: '⚡  perf:      性能优化' },
  { value: 'test', name: '✅  test:      测试相关' },
  { value: 'build', name: '🔧 build:     构建系统或依赖' },
  { value: 'ci', name: '👷 ci:        CI/CD 配置' },
  { value: 'revert', name: '⏪  revert:    撤销提交' },
];

/** 提取提交类型值数组，用于 commitlint 规则校验 */
const COMMIT_TYPES = TYPE_CONFIG.map(type => type.value);

/**
 * 作用域配置
 * 定义项目模块范围，保证提交信息的模块化和一致性
 */
const SCOPE_CONFIG = [
  { value: 'pages', name: '📄 pages       - 页面相关' },
  { value: 'components', name: '🧩 components  - 公共组件' },
  { value: 'layouts', name: '📐 layouts     - 布局系统' },
  { value: 'utils', name: '🔧 utils       - 工具函数' },
  { value: 'hooks', name: '🪝 hooks       - Vue组合式函数' },
  { value: 'directives', name: '🎯 directives  - 自定义指令' },
  { value: 'stores', name: '📦 stores      - 状态管理' },
  { value: 'router', name: '🛣️router      - 路由配置' },
  { value: 'api', name: '🌐 api         - 接口层' },
  { value: 'types', name: '📝 types       - TypeScript类型' },
  { value: 'constants', name: '📌 constants   - 常量定义' },
  { value: 'enums', name: '🔢 enums       - 枚举定义' },
  { value: 'styles', name: '🎨 styles      - 样式文件' },
  { value: 'assets', name: '🖼️assets      - 静态资源' },
  { value: 'locales', name: '🌍 locales     - 国际化语言包' },
  { value: 'config', name: '⚙️ config      - 配置文件' },
  { value: 'build', name: '🏗️build       - 构建配置' },
  { value: 'deps', name: '📋 deps        - 依赖管理' },
  { value: 'docs', name: '📚 docs        - 文档' },
];

/** 提取作用域值数组，用于 commitlint 规则校验 */
const COMMIT_SCOPES = SCOPE_CONFIG.map(scope => scope.value);

/**
 * Commitlint 配置
 * 基于 Conventional Commits 规范，结合中文语境优化
 * @see https://commitlint.js.org/#/reference-rules
 */
export default defineConfig({
  /** 继承标准的 Conventional Commits 配置 */
  extends: ['@commitlint/config-conventional'],

  /** 提交信息校验规则 */
  rules: {
    /** 约束可用的提交类型，避免自造类型，确保与变更日志生成工具兼容 */
    'type-enum': [2, 'always', COMMIT_TYPES],
    /** 限定可用的作用域，保障模块命名一致性和规范性 */
    'scope-enum': [2, 'always', COMMIT_SCOPES],
    /** 提交简述最小长度，避免"修复问题/更新代码"等过于空泛的描述 */
    'subject-min-length': [2, 'always', LENGTH_CONFIG.MIN_SUBJECT_LENGTH],
    /** 提交简述最大长度，控制标题可读性，中文按字符计数 */
    'subject-max-length': [2, 'always', LENGTH_CONFIG.MAX_SUBJECT_LENGTH],
    /** 完整提交头部长度限制，适配中文语境，放宽至 100 字符 */
    'header-max-length': [2, 'always', LENGTH_CONFIG.MAX_HEADER_LENGTH],
  },

  /** 交互式提交提示配置 (cz-git) */
  prompt: {
    /** 交互式提示文案 */
    messages: {
      type: '选择提交类型:',
      scope: '选择影响范围 (可选):',
      subject: '填写变更描述:',
      body: '填写详细描述 (可选，使用 "|" 换行):',
      breaking: '列举破坏性变更 (可选，使用 "|" 换行):',
      footerPrefixesSelect: '选择关联 issue 前缀 (可选):',
      customFooterPrefix: '输入自定义 issue 前缀:',
      footer: '列举关联issue (可选) 例如: #31, #I3244:',
      confirmCommit: '确认提交以上信息?',
    },

    /** 提交类型选择列表 */
    types: TYPE_CONFIG,
    /** 是否在最终提交信息中显示 emoji */
    useEmoji: false,

    /** 作用域配置 */
    scopes: SCOPE_CONFIG,
    /** 是否允许自定义作用域，与 scope-enum 规则保持一致 */
    allowCustomScopes: false,
    /** 是否允许空作用域 */
    allowEmptyScopes: true,

    /** 允许包含破坏性变更的提交类型 */
    allowBreakingChanges: ['feat', 'fix', 'refactor', 'perf'],

    /** 长度限制配置，与校验规则保持一致 */
    maxHeaderLength: LENGTH_CONFIG.MAX_HEADER_LENGTH,
    maxSubjectLength: LENGTH_CONFIG.MAX_SUBJECT_LENGTH,
    minSubjectLength: LENGTH_CONFIG.MIN_SUBJECT_LENGTH,
  },
});
