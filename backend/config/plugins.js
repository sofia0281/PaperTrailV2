module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST', 'smtp.example.com'), // Servidor SMTP
          port: env.int('SMTP_PORT', 587), // Puerto SMTP
          auth: {
            user: env('SMTP_USERNAME'), // Tu usuario SMTP
            pass: env('SMTP_PASSWORD'), // Tu contraseña SMTP
          },
          // ... otras configuraciones de Nodemailer
        },
        settings: {
          defaultFrom: env('SMTP_DEFAULT_FROM', 'no-reply@example.com'),
          defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO', 'no-reply@example.com'),
        },
      },
    },
  });