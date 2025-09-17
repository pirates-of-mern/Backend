import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Basic Swagger config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SIH Backend API",
            version: "1.0.0",
            description: "API documentation for Heritage & Culture Backend",
        },
        servers: [
            {
                url: "http://localhost:5000", // apka backend URL
            },
        ],
    },
    apis: ["./src/routes/*.js"], // yahan tumhare router files ka path
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
