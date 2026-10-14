/**
 * PDF Exporter Utility
 * Converts the formatted proposal HTML element into a multi-page high-quality PDF.
 */

export async function exportProposalToPdf(elementId, filename = 'Project_Proposal.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Proposal element with id #${elementId} not found.`);
    throw new Error('Proposal element not found in DOM.');
  }

  try {
    // Dynamic import to ensure browser compatibility
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        before: '.fm-pdf-page-break'
      }
    };

    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.warn('html2pdf generation encountered an issue, falling back to window.print():', err);
    // Graceful fallback to browser print dialog
    window.print();
    return false;
  }
}
