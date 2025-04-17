import html2canvas from 'html2canvas';
import { jsPDF as JsPdf } from 'jspdf';

export function svg2png() {
  const svgElements = document.getElementsByTagName('svg');

  console.log(svgElements);

  if (svgElements && svgElements.length === 3) {
    const svgElement = svgElements[2];

    const svgString = new XMLSerializer().serializeToString(svgElement);

    const svgBlob = new Blob(
      [svgString],
      {
        type: 'image/svg+xml;charset=utf-8',
      },
    );

    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');

      canvas.width = svgElement.width.baseVal.value;
      canvas.height = svgElement.height.baseVal.value;

      const ctx = canvas.getContext('2d');

      if (ctx) ctx.drawImage(img, 0, 0);

      // generate PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = 'diagrama.png';
          link.href = URL.createObjectURL(blob);
          link.click();

          // Libera o objeto temporário
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };

    img.src = url;
  }
}

export async function html2pdf(options: {
  elementId: string,
  title: string,
  width: number,
  height: number,
  proportion: number,
}) {
  try {
    const {
      title,
      elementId,
      width,
      height,
      proportion,
    } = options;

    const element = document.querySelector(`#${elementId}`);

    if (element) {
      const canvas = await html2canvas(<HTMLElement>element, {
        scale: window.devicePixelRatio,
        logging: false,
        backgroundColor: '#FFFFFF',
        // windowWidth: 800,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
        /* onclone: (document) => {
          const currentElement = document.querySelector('#disc-report-content');

          if (currentElement) {
            currentElement.classList.add('pdf-mode');
          }
        }, */
      });

      const pdf = new JsPdf({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [
          Number((width * proportion).toFixed(0)),
          Number((height * proportion).toFixed(0)),
        ],
      });

      pdf.addImage(
        canvas,
        'PNG',
        10,
        10,
        Number((width * proportion).toFixed(0)),
        Number((height * proportion).toFixed(0)),
        '',
        'FAST',
      );

      pdf.save(`${title} - ${new Date().toString()}.pdf`);
    }
  } catch (e) {
    console.error(e);
  }
}
