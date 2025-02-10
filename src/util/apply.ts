import { spawn } from 'child_process';

export default async function apply(raw_params: string[], inputData: Uint8Array): Promise<Uint8Array> {
    // Convert the Uint8Array to a Buffer for compatibility with Node.js streams.
    const inputBuffer = Buffer.from(inputData);

    // Construct the parameters for the ImageMagick convert command.
    // '-' tells ImageMagick to read from stdin and "jpeg:-" writes JPEG output to stdout.
    const params = ["-", ...raw_params, "png:-"];

    return new Promise((resolve, reject) => {
        const convert = spawn('convert', params);

        let stdoutBuffers: Buffer[] = [];
        let stderrBuffers: Buffer[] = [];

        // Collect data chunks from stdout.
        convert.stdout.on('data', (data: Buffer) => {
            stdoutBuffers.push(data);
        });

        // Collect error messages from stderr.
        convert.stderr.on('data', (data: Buffer) => {
            stderrBuffers.push(data);
        });

        // Handle any errors spawning the process.
        convert.on('error', (err) => {
            reject(err);
        });

        // On process close, either resolve with the output buffer or reject if there was an error.
        convert.on('close', (code) => {
            if (code !== 0) {
                const errorMsg = Buffer.concat(stderrBuffers).toString();
                return reject(new Error(`ImageMagick convert exited with code ${code}: ${errorMsg}`));
            }
            // Return the concatenated stdout buffers as a Uint8Array.
            resolve(new Uint8Array(Buffer.concat(stdoutBuffers)));
        });

        // Write the input buffer to the convert process and close stdin.
        convert.stdin.write(inputBuffer);
        convert.stdin.end();
    });
}
