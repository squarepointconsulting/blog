let worker = null;

export const initializeWorker = async () => {
  if (!worker && window.Tesseract) {
    worker = await window.Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
  }
  return worker;
};

export const recognizeText = async (file) => {
  if (!worker) {
    throw new Error('Worker not initialized');
  }
  try {
    const { data: { text } } = await worker.recognize(file);
    return text;
  } catch (error) {
    console.error('Error during OCR:', error);
    throw error;
  }
};

export const terminateWorker = async () => {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}; 