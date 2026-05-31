const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');
code = code.replace(
    /\.map\(\(p: any\) => p\.updatedAt\)/g,
    "// eslint-disable-next-line @typescript-eslint/no-explicit-any\n          .map((p: any) => p.updatedAt)"
);
fs.writeFileSync('src/pages/Dashboard.tsx', code);

code = fs.readFileSync('src/components/pwa/UpdateBanner.tsx', 'utf-8');
code = code.replace(
    /onRegistered\(_: ServiceWorkerRegistration \| undefined\)/g,
    "// eslint-disable-next-line @typescript-eslint/no-unused-vars\n    onRegistered(_: ServiceWorkerRegistration | undefined)"
);
fs.writeFileSync('src/components/pwa/UpdateBanner.tsx', code);
