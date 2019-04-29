import axios from 'axios';
import uuid from 'uuid/v4';
import { StreamChat } from 'stream-chat';

exports.init = async event => {
    try {
        const data = JSON.parse(event.body);

        const client = new StreamChat(
            process.env.STREAM_KEY,
            process.env.STREAM_SECRET
        );

        const user = Object.assign({}, data, { id: uuid(), role: 'admin' });
        const token = client.createToken(user.id);

        await client.updateUsers([
            user,
            {
                id: 'chuck',
                name: 'Chuck Norris',
                role: 'admin',
            },
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                user,
                token,
            }),
        };
    } catch (error) {
        return error;
    }
};

exports.reply = async event => {
    const data = JSON.parse(event.body);

    try {
        if (data.message.user.id === 'chuck' || data.type !== 'message.new') {
            return {
                statusCode: 200,
            };
        }

        const client = new StreamChat(
            process.env.STREAM_KEY,
            process.env.STREAM_SECRET
        );

        const cid = data.cid.split(':');
        const channel = client.channel(cid[0], cid[1]);

        const joke = await axios.get('https://api.chucknorris.io/jokes/random');

        await channel.sendMessage({
            text: joke.data.value,
            user: {
                id: 'chuck',
                name: 'Chuck Norris',
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify(joke.data),
        };
    } catch (error) {
        return error;
    }
};
