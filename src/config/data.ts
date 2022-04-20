interface Team {
    id: string
    display: string
} 

interface Queue {
    id: string,
    display: string
}

interface Data {
    teams: Team[],
    queues: Queue[],
    summonerMaxLength: number
}

const data: Data = {
    teams: [
        {
            id: "100",
            display: ":blue_square:"
        },
        {
            id: "200",
            display: ":red_square:"
        }
    ],
    queues: [
        {
            id: "RANKED_FLEX_SR",
            display: "FLEX"
        },
        {
            id: "RANKED_SOLO_5x5",
            display: "SOLO"
        },
    ],
    "summonerMaxLength": 16
}

function getTeamDisplay(data: Data, id: string): string {
    var display: string ="";
    for (const team of data.teams) {
        if (team.id === id) display = team.display
    }
    if (display) return display
    throw EvalError(`Invalid team ID: ${id}`)
}


function getQueueDisplay(data: Data, id: string): string {
    var display: string ="";
    for (const queue of data.queues) {
        if (queue.id === id) display = queue.display
    }
    if (display) return display
    throw EvalError(`Invalid queue ID: ${id}`)
}

export default data;
export { getQueueDisplay, getTeamDisplay };