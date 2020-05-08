const plotly = require('plotly')('alexandrkostyniuk', 'KmNYDnbtNicNFN9Zz5h3');


module.exports = (arrX, arrY, name) => {
  const trace1 = {
    x: arrY,
    y: arrX,
    type: "scatter"
  };
  const data = [trace1];
  const layout = {
    yaxis2: {
      domain: [0.6, 0.95],
      anchor: "x2"
    },
    xaxis2: {
      domain: [0.6, 0.95],
      anchor: "y2"
    }
  };
  const graphOptions = {layout: layout, filename: name, fileopt: "overwrite"};
  plotly.plot(data, graphOptions, function (err, msg) {
      console.log(msg);
  });

  return 'Successfully builded'
}