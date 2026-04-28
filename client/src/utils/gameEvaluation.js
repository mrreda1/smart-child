export const evaluateGamePerformance = (score, metrics) => {
  if (!metrics) return score > 50;

  if (metrics.type === 'drawing') return true;
  if (metrics.type === 'iq') return parseFloat(metrics.ar) >= 50;

  if (metrics.redProfile !== undefined) {
    const arValue = parseFloat(metrics.ar);
    const rgbSum = parseFloat(metrics.redProfile) + parseFloat(metrics.greenProfile) + parseFloat(metrics.blueProfile);
    return arValue >= 50 && rgbSum >= 50;
  }

  if (metrics.isr !== undefined) {
    const isrValue = parseFloat(metrics.isr);
    const aarlValue = parseFloat(metrics.aarl);
    return isrValue >= 50 && aarlValue > 0 && aarlValue <= 3.0;
  }

  if (metrics.ar !== undefined && metrics.arl !== undefined) {
    const arValue = parseFloat(metrics.ar);
    const arlValue = parseFloat(metrics.arl);
    return arValue >= 50 && arlValue > 0 && arlValue <= 2.5;
  }

  if (metrics.mrt !== undefined) {
    const piValue = parseFloat(metrics.pi);
    const mrtValue = parseFloat(metrics.mrt);
    return piValue >= 50 && mrtValue > 0 && mrtValue <= 1500;
  }

  return score > 50;
};
