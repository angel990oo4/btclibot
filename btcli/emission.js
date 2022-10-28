const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = {
  async generateCanva(labels, data) {
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
            label: 'Dogs',
            data: data,
            fill: false,
            borderColor: 'blue',
          },
        ],
      },
    });
    return new AttachmentBuilder(image, 'graph.png');
  },
};
