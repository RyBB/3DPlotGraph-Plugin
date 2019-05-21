(function(PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config.isabled) return;
  if (JSON.parse(config.isabled)[0] !== 'abled') return;

  const configData = JSON.parse(config.data);
  const APP = kintone.app.getId();
  const main = {
    getRecords: () => {
      const params = {
        app: APP,
      };
      return kintone
        .api(kintone.api.url('/k/v1/records', true), 'GET', params)
        .then(resp => resp)
        .catch(err => err);
    },
  };

  kintone.events.on(['app.record.index.show'], event => {
    if (event.viewId !== Number(configData.viewId)) return;
    main.getRecords().then(val => {
      const axis = key => val.records.map(row => row[key].value);
      const myplots = document.getElementById('myDiv'),
        data = [
          {
            x: axis(configData.xaxis[1]),
            y: axis(configData.yaxis[1]),
            z: axis(configData.zaxis[1]),
            $id: axis('$id'),
            mode: 'markers',
            type: 'scatter3d',
            marker: {
              color: 'rgb(23, 190, 207)',
              size: 3,
            },
          },
          {
            alphahull: 7,
            opacity: 0.1,
            type: 'mesh3d',
            x: axis(configData.xaxis[1]),
            y: axis(configData.yaxis[1]),
            z: axis(configData.zaxis[1]),
          },
        ],
        layout = {
          autosize: true,
          height: 800,
          scene: {
            xaxis: {
              title: configData.xaxis[0],
              type: 'linear',
              zeroline: false,
            },
            yaxis: {
              title: configData.yaxis[0],
              type: 'linear',
              zeroline: false,
            },
            zaxis: {
              title: configData.zaxis[0],
              type: 'linear',
              zeroline: false,
            },
          },
          title: configData[1],
          width: 800,
        };
      Plotly.newPlot('myDiv', data, layout);

      myplots.on('plotly_click', p => {
        const point = p.points[0].pointNumber;
        const recordId = p.points[0].data.$id[point];
        location.href = `/k/${APP}/show#record=${recordId}`;
      });
    });
  });
})(kintone.$PLUGIN_ID);
