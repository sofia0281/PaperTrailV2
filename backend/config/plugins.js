module.exports = {
    upload: {
      config: {
        provider: 'local',
        providerOptions: {
          sizeLimit: 250 * 1024 * 1024, // 250MB en bytes
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'application/pdf'
          ],
        },
      },
    },
  };