import { spawn } from 'child_process';


export default async function apply(raw_params: string[], inputData: Uint8Array): Promise<Uint8Array> {
    const inputBuffer = Buffer.from(inputData);
    
    const params = ["-", ...raw_params, "png:-"];
    
    return new Promise((resolve, reject) => {
        const convert = spawn('convert', params);
        
        let stdoutBuffers: Buffer[] = [];
        let stderrBuffers: Buffer[] = [];
        
        convert.stdout.on('data', (data: Buffer) => {
            stdoutBuffers.push(data);
        });
        
        convert.stderr.on('data', (data: Buffer) => {
            stderrBuffers.push(data);
        });
        
        convert.on('error', (err) => {
            reject(err);
        });
        
        convert.on('close', (code) => {
            if (code !== 0) {
                const errorMsg = Buffer.concat(stderrBuffers).toString();
                return reject(new Error(`ImageMagick convert exited with code ${code}: ${errorMsg}`));
            }
            
            resolve(new Uint8Array(Buffer.concat(stdoutBuffers)));
        });
        
        convert.stdin.write(inputBuffer);
        convert.stdin.end();
    });
}
