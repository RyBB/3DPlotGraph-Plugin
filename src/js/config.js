jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';

  const body = document.getElementsByTagName('BODY')[0];

  // スピナー
  const spinner = new kintoneUIComponent.Spinner();

  // ダイアログ
  const Dialog = new kintoneUIComponent.Dialog({
    header: '注意！',
    content: '保存せずプラグインの設定画面に戻ってもよろしいでしょうか？',
    isVisible: true,
    showCloseButton: true
  });

  // ダイアログに表示するボタン
  const acceptBtn = new kintoneUIComponent.Button({text: 'はい'});

  // チェックボックスフィールド
  const checkbox = new kintoneUIComponent.CheckBox({
    items: [{
      label: '有効',
      value: 'abled',
    }],
    value: ['abled']
  });

  // テキストフィールド
  const graphName = new kintoneUIComponent.Text({value: ''});
  const xaxisName = new kintoneUIComponent.Text({value: ''});
  const yaxisName = new kintoneUIComponent.Text({value: ''});
  const zaxisName = new kintoneUIComponent.Text({value: ''});

  // 要素のrender
  $('#plugin-config-area-isabled').append(checkbox.render());
  $('#plugin-config-area-name').append(graphName.render());
  $('#plugin-config-area-xaxis-name').append(xaxisName.render());
  $('#plugin-config-area-yaxis-name').append(yaxisName.render());
  $('#plugin-config-area-zaxis-name').append(zaxisName.render());

  $(body).append(spinner.render());

  spinner.show();

  // 設定情報の確認
  const conf = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (conf.isabled) {
    checkbox.setValue(JSON.parse(conf.isabled));
  }
  KintoneConfigHelper.getFields('NUMBER')
    .then(resp => resp.map(val => {
      return {
        label: `${val.label} (${val.code})`,
        value: val.code,
        isDisabled: false,
      }
    }))
    .then(array => {
      const xaxis_dropdown = new kintoneUIComponent.Dropdown({
        items: array,
        value: array[0].value
      });
      const yaxis_dropdown = new kintoneUIComponent.Dropdown({
        items: array,
        value: array[0].value
      });
      const zaxis_dropdown = new kintoneUIComponent.Dropdown({
        items: array,
        value: array[0].value
      });
      $('#plugin-config-area-xaxis').append(xaxis_dropdown.render());
      $('#plugin-config-area-yaxis').append(yaxis_dropdown.render());
      $('#plugin-config-area-zaxis').append(zaxis_dropdown.render());
    })
    .catch(err => console.log(err));
  spinner.hide();


  // 保存ボタン押下時
  $('#submit').on('click', () => {
    const config = {};
    config.isabled = JSON.stringify(checkbox.getValue());

    kintone.plugin.app.setConfig(config);
  });
  // キャンセルボタン押下時
  $('#cancel').on('click', () => {
    $(body).append(
      Dialog.render()
    );
    Dialog.setFooter(acceptBtn.render());
    acceptBtn.on('click', () => {
      history.back();
    });
  });
})(jQuery, kintone.$PLUGIN_ID);
