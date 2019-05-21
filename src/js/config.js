jQuery.noConflict();
(($, PLUGIN_ID) => {
  'use strict';

  const body = document.getElementsByTagName('BODY')[0];

  // スピナー
  const spinner = new kintoneUIComponent.Spinner();

  // ダイアログ
  const Dialog = new kintoneUIComponent.Dialog({
    header: '注意！！',
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
  const viewId = new kintoneUIComponent.Text({value: ''});
  const xaxisName = new kintoneUIComponent.Text({value: ''});
  const yaxisName = new kintoneUIComponent.Text({value: ''});
  const zaxisName = new kintoneUIComponent.Text({value: ''});

  // ドロップダウンフィールド
  let xaxis_dropdown, yaxis_dropdown, zaxis_dropdown;

  // 要素のrender
  $('#plugin-config-area-isabled').append(checkbox.render());
  $('#plugin-config-area-viewId').append(viewId.render());
  $('#plugin-config-area-name').append(graphName.render());
  $('#plugin-config-area-xaxis-name').append(xaxisName.render());
  $('#plugin-config-area-yaxis-name').append(yaxisName.render());
  $('#plugin-config-area-zaxis-name').append(zaxisName.render());

  $(body).append(spinner.render());

  spinner.show();

  // ドロップダウン
  KintoneConfigHelper.getFields('NUMBER')
    .then(resp => resp.map(val => {
      return {
        label: `${val.label} (${val.code})`,
        value: val.code,
        isDisabled: false,
      }
    }))
    .then(array => {
      xaxis_dropdown = new kintoneUIComponent.Dropdown({
        items: array,
        value: array[0].value
      });
      yaxis_dropdown = new kintoneUIComponent.Dropdown({
        items: array,
        value: array[0].value
      });
      zaxis_dropdown = new kintoneUIComponent.Dropdown({
        items: array,
        value: array[0].value
      });
      $('#plugin-config-area-xaxis').append(xaxis_dropdown.render());
      $('#plugin-config-area-yaxis').append(yaxis_dropdown.render());
      $('#plugin-config-area-zaxis').append(zaxis_dropdown.render());
    })
    .then(() => {
      // 設定情報の確認 & 値の挿入
      const conf = kintone.plugin.app.getConfig(PLUGIN_ID);
      const configData = JSON.parse(conf.data);

      // 必須項目に値が入っていれば設定がすでにある
      if (configData.viewId) {
        checkbox.setValue(JSON.parse(conf.isabled));
        viewId.setValue(configData.viewId);
        graphName.setValue(configData.graphName);
        xaxisName.setValue(configData.xaxis[0]);
        xaxis_dropdown.setValue(configData.xaxis[1]);
        yaxisName.setValue(configData.yaxis[0]);
        yaxis_dropdown.setValue(configData.yaxis[1]);
        zaxisName.setValue(configData.zaxis[0]);
        zaxis_dropdown.setValue(configData.zaxis[1]);
      }
    })
    .catch(err => console.log(err));
  spinner.hide();

  // 保存ボタン押下時
  $('#submit').on('click', () => {
    const isabled = JSON.stringify(checkbox.getValue());
    const data = {
      viewId: viewId.getValue(),
      graphName: graphName.getValue(),
      xaxis: [
        xaxisName.getValue(),
        xaxis_dropdown.getValue(),
      ],
      yaxis: [
        yaxisName.getValue(),
        yaxis_dropdown.getValue(),
      ],
      zaxis: [
        zaxisName.getValue(),
        zaxis_dropdown.getValue(),
      ],
    };

    // アラートの要素を隠す
    $('#plugin-config-area-viewId-require').addClass('require');
    $('#plugin-config-area-xaxis-require').addClass('require');
    $('#plugin-config-area-yaxis-require').addClass('require');
    $('#plugin-config-area-zaxis-require').addClass('require');
    $('#plugin-config-area-all-require').addClass('require');

    // 必須項目が空だったらアラート要素を表示する
    let req = 0;
    if (!data.viewId) {
      $('#plugin-config-area-viewId-require').removeClass('require');
      req++;
    }
    if (!data.xaxis[0] || !data.xaxis[1]) {
      $('#plugin-config-area-xaxis-require').removeClass('require');
      req++;
    }
    if (!data.yaxis[0] || !data.yaxis[1]) {
      $('#plugin-config-area-yaxis-require').removeClass('require');
      req++;
    }
    if( !data.zaxis[0] || !data.zaxis[1]) {
      $('#plugin-config-area-zaxis-require').removeClass('require');
      req++;
    }

    // 上記がどれかマッチすればエラー
    if (req) {
      window.alert('必須項目が入力されていません');
      return;
    }

    const config = {isabled, data: JSON.stringify(data)};
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
