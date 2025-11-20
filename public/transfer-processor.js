class TransferProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const channelData = input[0];
            let sum = 0;
            // Calculate average amplitude
            for (let i = 0; i < channelData.length; i++) {
                sum += Math.abs(channelData[i]);
            }
            const average = sum / channelData.length;

            // Send volume back to main thread
            this.port.postMessage({ volume: average });
        }
        return true; // Keep processor alive
    }
}

registerProcessor('transfer-processor', TransferProcessor);
