(() => {
    const nativeFetch = window.fetch.bind(window);
    const reads = new Set(['getdashboard', 'getterm', 'getsigconfig', 'getbydate', 'hasdata', 'getlatestroom', 'getlatest', 'getprevious', 'report', 'statuscheck', 'formdata']);
    const queue = [], pending = new Map();
    let active = 0;
    function drain() {
        while (active < 3 && queue.length) {
            const write = queue.findIndex(job => !job.read);
            const job = queue.splice(write < 0 ? 0 : write, 1)[0];
            job.signal?.removeEventListener('abort', job.cancel);
            if (job.signal?.aborted) { job.reject(new DOMException('Aborted', 'AbortError')); continue; }
            active++;
            const controller = new AbortController();
            const cancel = () => controller.abort();
            job.signal?.addEventListener('abort', cancel, { once: true });
            const timer = setTimeout(cancel, job.read ? 30000 : 90000);
            nativeFetch(job.url, { ...job.options, signal: controller.signal }).then(async response => {
                const bytes = await response.arrayBuffer();
                const copy = new Response([204, 205, 304].includes(response.status) ? null : bytes, {
                    status: response.status, statusText: response.statusText, headers: response.headers
                });
                Object.defineProperty(copy, 'url', { value: response.url });
                Object.defineProperty(copy, 'redirected', { value: response.redirected });
                return copy;
            }).then(job.resolve, job.reject).finally(() => { clearTimeout(timer); job.signal?.removeEventListener('abort', cancel); active--; drain(); });
        }
    }
    function scheduled(url, options = {}) {
        let parsed;
        try { parsed = new URL(typeof url === 'string' ? url : url.url, location.href); } catch (_) { return nativeFetch(url, options); }
        if (parsed.hostname !== 'script.google.com' || !parsed.pathname.startsWith('/macros/s/')) return nativeFetch(url, options);
        const read = (!options.method || options.method.toUpperCase() === 'GET') && reads.has((parsed.searchParams.get('mode') || '').toLowerCase());
        const canonical = new URL(parsed);
        canonical.searchParams.delete('t'); canonical.searchParams.delete('_'); canonical.searchParams.sort();
        const key = read && !options.signal && typeof url === 'string' ? canonical.href : null;
        if (key && pending.has(key)) return pending.get(key).then(r => r.clone());
        const request = new Promise((resolve, reject) => {
            const signal = options.signal;
            const job = { url, options, read, resolve, reject, signal };
            job.cancel = () => { const i = queue.indexOf(job); if (i >= 0) { queue.splice(i, 1); reject(new DOMException('Aborted', 'AbortError')); } };
            if (signal?.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
            signal?.addEventListener('abort', job.cancel, { once: true }); queue.push(job); drain();
        });
        if (!key) return request;
        pending.set(key, request);
        const clean = () => { if (pending.get(key) === request) pending.delete(key); };
        request.then(clean, clean);
        return request.then(r => r.clone());
    }
    window.fetch = scheduled;
    window.BurapaNet = {
        async fetch(url, options = {}, timeout = 25000) {
            const controller = new AbortController(), upstream = options.signal;
            const cancel = () => controller.abort();
            if (upstream?.aborted) controller.abort();
            else upstream?.addEventListener('abort', cancel, { once: true });
            const timer = setTimeout(cancel, timeout);
            try { return await scheduled(url, { ...options, signal: controller.signal }); }
            finally { clearTimeout(timer); upstream?.removeEventListener('abort', cancel); }
        }
    };
})();
