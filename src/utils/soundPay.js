// Simple Sound Transfer Simulation using Web Audio API

export const playTransferSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Play a "data" pattern: High-Low-High
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.setValueAtTime(440, now + 0.2); // A4
    osc.frequency.setValueAtTime(1760, now + 0.4); // A6

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.6);
};

export const listenForTransfer = (onDetected) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return () => { };

    const ctx = new AudioContext();
    let cleanup = () => { ctx.close().catch(() => { }); };
    let active = true;

    (async () => {
        try {
            const baseUrl = import.meta.env.BASE_URL || '/';
            const processorPath = 'transfer-processor.js';
            const processorUrl = baseUrl.endsWith('/') ? `${baseUrl}${processorPath}` : `${baseUrl}/${processorPath}`;

            await ctx.audioWorklet.addModule(processorUrl);

            if (!active) return;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!active) {
                stream.getTracks().forEach(t => t.stop());
                return;
            }

            const source = ctx.createMediaStreamSource(stream);
            const workletNode = new AudioWorkletNode(ctx, 'transfer-processor');

            source.connect(workletNode);

            // Prevent garbage collection
            // workletNode.connect(ctx.destination); 

            workletNode.port.onmessage = (event) => {
                // Threshold check (0-1 range for float data)
                // Adjust threshold as needed. 0.05 is roughly equivalent to previous byte threshold
                if (event.data.volume > 0.05) {
                    onDetected();
                }
            };

            cleanup = () => {
                active = false;
                source.disconnect();
                workletNode.disconnect();
                stream.getTracks().forEach(t => t.stop());
                ctx.close();
            };

        } catch (err) {
            console.error("Audio setup failed", err);
        }
    })();

    return () => {
        active = false;
        cleanup();
    };
};
