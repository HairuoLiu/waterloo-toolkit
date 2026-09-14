// assets/i18n/common.js
// Shared dictionary for the main site and all sub-apps.
// Key convention: `common.<area>.<name>`. en/zh MUST have identical key sets.
// Wording is taken verbatim from the existing pages where possible (no self-invented terms).
window.UW_DICT = window.UW_DICT || {};
window.UW_DICT['common'] = {
  en: {
    'site.name': 'UW Toolkit',
    'site.tagline': 'Lightweight tools for University of Waterloo students',
    'lang.switch': 'Switch language',
    'lang.en': 'EN',
    'lang.zh': '中文',
    'loading': 'Loading…',
    'load_failed': 'Failed to load list. If opened directly, preview with a local server.',
    'empty': 'No content.',
    'empty_tools': 'No sub-tools yet. Add one following STRUCTURE.md.',
    'share': 'Share',
    'share_page': 'Share this page',
    'link_copied': 'Link copied, go share it',
    'view_source': 'View source on GitHub',
    'back': 'Back to UW Toolkit',
    'home': 'Home',
    'nav.aria': 'Site navigation',
    'enter': 'Enter',
    'enter_wiki': 'Enter Wiki',
    'footer.text': 'Each tool is a standalone sub-page; click a card to enter. See README.md (incl. STRUCTURE.md) for naming and cover rules.'
  },
  zh: {
    'site.name': '滑铁卢大学工具箱',
    'site.tagline': '面向滑铁卢大学学生的轻量工具集合',
    'lang.switch': '切换语言',
    'lang.en': '英文',
    'lang.zh': '中文',
    'loading': '加载中…',
    'load_failed': '清单加载失败（本地直接打开时请用本地服务器预览）。',
    'empty': '暂无内容。',
    'empty_tools': '还没有子工具，欢迎按 STRUCTURE.md 添加。',
    'share': '分享',
    'share_page': '分享此页面',
    'link_copied': '链接已复制，去分享吧',
    'view_source': '在 GitHub 查看源码',
    'back': '返回滑铁卢工具箱',
    'home': '首页',
    'nav.aria': '站点导航',
    'enter': '进入',
    'enter_wiki': '进入 Wiki',
    'footer.text': '每个工具都是一个独立子页面，点击卡片进入。命名规范与封面制作见仓库内 README.md（含 STRUCTURE.md）。'
  }
};
