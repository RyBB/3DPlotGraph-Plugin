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
  console.log(configData)

  kintone.events.on(['app.record.index.show'], event => {
    if (event.viewId !== Number(configData[0])) return;
    main.getRecords().then(val => {
      const axis = key => val.records.map(row => row[key].value);
      const myplots = document.getElementById('myDiv'),
        data = [
          {
            x: axis(configData[5]),
            y: axis(configData[6]),
            z: axis(configData[7]),
            $id: axis('$id'),
            mode: 'markers',
            type: 'scatter3d',
            marker: {
              color: 'rgb(23, 190, 207)',
              size: 3,
            },
          },
          // {
          //   alphahull: 7,
          //   opacity: 0.1,
          //   type: 'mesh3d',
          //   x: axis('axis_x'),
          //   y: axis('axis_y'),
          //   z: axis('axis_z'),
          // },
        ],
        layout = {
          autosize: true,
          height: 800,
          scene: {
            xaxis: {
              title: configData[2],
              type: 'linear',
              zeroline: false,
            },
            yaxis: {
              title: configData[3],
              type: 'linear',
              zeroline: false,
            },
            zaxis: {
              title: configData[4],
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
