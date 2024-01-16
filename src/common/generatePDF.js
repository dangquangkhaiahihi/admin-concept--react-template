import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ShowNotification from '../components/react-notifications/react-notifications';
import { NotificationMessageType } from '../utils/configuration';

export async function generatePDF(loader, setLoader, captureTarget, nameFile, showLoadingCallback) {
  if (loader) return;

  setLoader(true);

  if (showLoadingCallback && typeof showLoadingCallback === 'function') {
    showLoadingCallback(true);
  }

  let pdfDataURL = "initial-value";

  try {
    const canvas = await html2canvas(captureTarget);
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('p', 'mm', 'a4');

    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    const componentWidth = doc.internal.pageSize.getWidth();
    const componentHeight = doc.internal.pageSize.getHeight();

    const scale = Math.min(componentWidth / contentWidth, componentHeight / contentHeight);
    doc.addImage(imgData, 'PNG', 0, 0, contentWidth * scale, contentHeight * scale);

    setLoader(false);

    await doc.save(nameFile + '.pdf', { returnPromise: true });

    if (showLoadingCallback && typeof showLoadingCallback === 'function') {
      showLoadingCallback(false);
    }

    ShowNotification('Trích xuất thông tin thành công.', NotificationMessageType.Success);

    pdfDataURL = doc.output('bloburi');
    console.log('pdfDataURL', pdfDataURL);

    return pdfDataURL;
  } catch (error) {
    // Handle any errors here
    console.error('Error generating PDF:', error);
    throw error;
  }
}