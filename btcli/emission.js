const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = {
  async generateCanva(labels, data, title) {
    const renderer = new ChartJSNodeCanvas({
      width: 1600,
      height: 800,
      backgroundColour: 'white',
    });
    const image = await renderer.renderToBuffer({
      // Build your graph passing option you want
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: false,
            text: title,
          },
        },
        scales: {
          x: {
            display: false,
          },
        },
      },
    });
    return new AttachmentBuilder(image, 'graph.png');
  },
};
