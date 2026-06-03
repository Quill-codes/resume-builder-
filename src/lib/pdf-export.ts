import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = 794; // at 96 DPI
const A4_HEIGHT_PX = 1123; // at 96 DPI
const SCALE = 2; // 2x for 192 DPI effective

export async function exportToPDF(
  element: HTMLElement,
  filename: string = 'resume.pdf'
): Promise<void> {
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.backgroundColor = '#ffffff';
  clone.style.overflow = 'visible';
  clone.style.height = 'auto';

  // Remove any transform/scale from preview
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'top left';

  document.body.appendChild(clone);

  // Wait for fonts and images to load
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const totalHeight = clone.scrollHeight;
    const pages = Math.ceil(totalHeight / A4_HEIGHT_PX);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    for (let page = 0; page < pages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const canvas = await html2canvas(clone, {
        scale: SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        y: page * A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(clone);
  }
}

export { A4_WIDTH_PX, A4_HEIGHT_PX };
