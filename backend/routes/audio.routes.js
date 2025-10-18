import { Router } from 'express';


const audioRouter = Router();

audioRouter.get('/', (req, res) => res.send({title: "GET all users"}));

audioRouter.get('/:id', (req, res) => res.send({title: "GET an audio"}));

audioRouter.post('/', createAudio);

audioRouter.put('/:id', (req, res) => res.send({title: "UPDATE an audio file"}));

audioRouter.delete('/:id', (req, res) => res.send({title: "DELETE an audio file"}));