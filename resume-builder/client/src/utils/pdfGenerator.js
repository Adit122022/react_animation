import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Generate PDF from HTML element
export const generatePDF = async (elementId, filename = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    let position = 0;
    let heightLeft = imgHeight;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

// Download PDF from URL
export const downloadPDFFromURL = async (url, filename = 'resume.pdf') => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('PDF download failed:', error);
    throw error;
  }
};