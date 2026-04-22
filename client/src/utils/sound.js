const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const AUDIO_BUFFERS = {};

const playSound = async (url) => {
  try {
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    if (!AUDIO_BUFFERS[url]) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      AUDIO_BUFFERS[url] = audioBuffer;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = AUDIO_BUFFERS[url];
    source.connect(audioCtx.destination);

    source.start(0);

    return source;
  } catch (e) {
    console.warn('Audio play failed:', e);
    throw e;
  }
};

export { playSound };
