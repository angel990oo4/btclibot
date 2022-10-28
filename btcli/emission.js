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
            label: 'Emission',
            data: data,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Emission value',
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            grid: {
              drawOnChartArea: true, // only want the grid lines for one axis to show up
            },
          },
          x: {
            display: false,
          },
        },
      },
    });
    return new AttachmentBuilder(image, 'graph.png');
  },
};
