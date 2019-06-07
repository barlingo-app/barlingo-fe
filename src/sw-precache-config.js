module.exports = {
    staticFileGlobs: [
        'build/static/css/**.css',
        'build/static/js/**.js',
        'build/locales/**.json',
        'build/locales/**.json',
        'build/static/media/**.*' 
    ],  
    swFilePath: './build/service-worker.js',
    stripPrefix: 'build/',
    handleFetch: false,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/app-uat.barlingo\.es\//,
            handler: 'networkFirst'  
        }
    ]
}