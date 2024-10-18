export const downloadPdfDoc = (pdfDoc: Blob, name: string) => {
  const blob = new Blob([pdfDoc], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}