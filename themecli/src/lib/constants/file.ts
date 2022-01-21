/**
 * 主题下某些特定文件名称
 */
 export default {
    LOCALE: (localeCatalog: string, locale: string, extname: string) => localeCatalog + '/' + locale + extname,
    CONFIG_SETTINGS_DATA: 'config/settings_data.json',
    // 可视化编辑器预览模式配置文件草稿
    CONFIG_SETTINGS_DATA_PREVIEW: 'config/settings_data.json.preview',
    CONFIG_SETTINGS_SCHEMA: 'config/settings_schema.json',
    // 草稿文件
    PREVIEW_EXT: '.preview',
    // templates/*.html
    HTML_TEMPLATE_EXT: '.html',
    // templates/*.json
    JSON_TEMPLATE_EXT: '.json',
    CSS_EXT: '.css',
    JS_EXT: '.js',
  };
  