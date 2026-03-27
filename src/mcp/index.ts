import { Router } from 'express';
import { mcpController } from './controller';

const mcpRouter = Router();

// Endpoint que lista todas as ferramentas disponíveis e seus schemas
mcpRouter.get('/tools', mcpController.getTools);

// Endpoint encarregado de rodar a ferramenta com os devidos argumentos
mcpRouter.post('/execute', mcpController.executeTool);

export default mcpRouter;
