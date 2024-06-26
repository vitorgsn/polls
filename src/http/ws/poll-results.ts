import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import z from "zod";

export async function pollResults(app: FastifyInstance) {
    app.get('/polls/:pollId/results', {websocket: true}, (connection, request) => {
        const getPollParams = z.object({
            pollId: z.string().uuid(),
        })
        
        const { pollId } = getPollParams.parse(request.params)

        voting.subscribe(pollId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })
    })
}

/*
export async function pollResults(app: FastifyInstance) {
    app.get('/polls/:pollId/results', {websocket: true}, (connection, request) => {
        // Inscrever apenas nas mensagens publicadas no canal com o ID da enquete ('pollId')

        connection.socket.on('message', (message: string) => {
            connection.socket.send('you sent: ' + message)

            setInterval(() => {
                connection.socket.send('oi')
            }, 500)
        })
    })
}

// Pub/Sub - Publish
// "1" => 1, 2, 3, 4, 5
*/