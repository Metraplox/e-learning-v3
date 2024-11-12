export default () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    jwt: {
        secret: process.env.JWT_SECRET,
        expirationTime: process.env.JWT_EXPIRATION || '1d',
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
        queues: {
            users: process.env.USERS_QUEUE || 'users_queue',
            courses: process.env.COURSES_QUEUE || 'courses_queue',
            payments: process.env.PAYMENTS_QUEUE || 'payments_queue',
        },
    },
    services: {
        users: process.env.USERS_SERVICE_URL,
        courses: process.env.COURSES_SERVICE_URL,
        payments: process.env.PAYMENTS_SERVICE_URL,
    }
});