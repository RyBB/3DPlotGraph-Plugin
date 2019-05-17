(function(PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config.isabled) return;
  if (JSON.parse(config.isabled)[0] !== 'abled') return;

  kintone.events.on([], event => {
    alert();
  });
})(kintone.$PLUGIN_ID);
