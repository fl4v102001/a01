import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
import { errorHandler } from './api/middlewares/errorHandler';
import mcpRouter from './mcp';
import { runAgent } from './agent/agent';
import path from 'path';

const main = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    }

    const app = express();

    app.use(express.json());

    // Servir pasta pública de frontend
    app.use(express.static(path.join(__dirname, '../public')));

    // Registrar rotas
    app.use('/mcp', mcpRouter);

    // Frontend endpoint
    app.post('/api/chat', async (req, res, next) => {
        try {
            const result = await runAgent(req.body.prompt);
            res.json({ result });
        } catch (error) {
            next(error);
        }
    });

    // Register global error handler
    app.use(errorHandler);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

main();
