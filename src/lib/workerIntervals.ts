const workers: Set<{ id: Number, worker: Worker }> = new Set();
let count = 0;

const workerInterval = {
    setInterval: (callback: Function, interval: number, ...args: unknown[]): Number => {
        const code = `self.addEventListener('message', e=>{setInterval(()=>self.postMessage(null), e.data)})`
        const worker = new Worker(`data:text/javascript;base64,${btoa(code)}`);
        worker.onmessage = () => callback(...args);
        worker.postMessage(interval)
        const id = ++count;
        workers.add({ id, worker });
        return id
    },
    clearInterval: (intervalID: Number) => {
        console.log(intervalID)
        workers.forEach((set) => {
            if (set.id === intervalID) {
                set.worker.terminate();
                workers.delete(set);
            }
        });
    }
}

export default workerInterval;