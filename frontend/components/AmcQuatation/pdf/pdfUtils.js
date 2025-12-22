// lib/pdfUtils.js
let pdfjsLib = null;

export const loadPdfJs = async () => {
  if (pdfjsLib) return pdfjsLib;

  // Dynamic import with proper handling
  const pdfjs = await import('pdfjs-dist/webpack');
  pdfjsLib = pdfjs;
  
  return pdfjsLib;
};

export const pdfFirstPageToImage = async (file) => {
  const pdfjsLib = await loadPdfJs();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const page = await pdf.getPage(1);

  // A4 @ 300 DPI
  const A4_WIDTH = 2480;
  const A4_HEIGHT = 3508;

  const viewport = page.getViewport({ scale: 1 });
  const scale = Math.min(
    A4_WIDTH / viewport.width,
    A4_HEIGHT / viewport.height
  );

  const scaledViewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  await page.render({
    canvasContext: context,
    viewport: scaledViewport,
  }).promise;

  return canvas.toDataURL("image/png");
};