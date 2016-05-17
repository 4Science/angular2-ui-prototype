const GlobalConfig = {
    // Location of REST API
    rest: {
        // By default, we are currently using a local proxy running on port 5050.
        // This is necessary because our actual REST API doesn't provide CORS headers yet!
        // The actual REST API path is in the 'proxy' settings below.
        // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
        nameSpace: '/',
        baseURL: 'http://localhost:5050'
    },
    // REST Location that we are proxying (see src/proxy.ts)
    // (Since we are using a proxy at this time, the actual REST API goes here)
    proxy: {
        nameSpace: '/tdl-rest',
        baseURL: 'https://training-ir.tdl.org'
        // E.g. to use demo.dspace.org REST API, use the below values *instead*
        //nameSpace: '/rest',
        //baseURL: 'https://demo.dspace.org'
    },
    // Path and Port in use for this Angular2 UI
    ui: {
        nameSpace: '/',
        baseURL: 'http://localhost:3000'
    }
};

export {GlobalConfig}
