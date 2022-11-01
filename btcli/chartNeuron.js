const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = {
  async generateCanva(labels, data, title) {
    const renderer = new ChartJSNodeCanvas({
      width: 1600,
      height: 800,
      backgroundColour: 'rgba(255,255,255)',
    });
    const maxVaue = Math.max(...data);
    const image = await renderer.renderToBuffer({
      // Build your graph passing option you want
      type: 'line',
      data: {
        labels: labels,
        color: '#809dab',
        datasets: [
          {
            label: `Max value is ${maxVaue}`,
            data: data,
            fill: true,
            borderColor: 'rgba(0, 0, 0, 0.8)',
            radius: 0.1,
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
            display: true,
            text: title,
            color: 'white',
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
