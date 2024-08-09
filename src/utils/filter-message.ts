import axios from "axios";

export const filterMessage = async (message: string): Promise<number> => {

    const messageContent = `You are a live stream message moderator. You are what stands between viewer messages getting shared to a live stream with thounsands of viewers. Please rate messages that I give you from 0 to 10 where 0 is family friendly and 10 is extremly racist or sexist or mean. 0 is something like "I love your content" 5 is something like "Youre bad at trading lmao get rekt" 10 is something like saying the n word in any way or calling for the death of a race. We will use the level you give us to decide if we can surface the message. Only respond with a single number between 0 and 10. No other words or letters or you'll break the system and the company will fail. Good responses are things like "0" "10" "9" "6", bad responses are things like "rating: 5" "4." "10..." "3. What else can I help with?".  The message will follow this sentence. ${message}`

    const data = {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: messageContent }],
        temperature: 0.7
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        }
    );

    return parseInt(response.data.choices[0].message.content)

};