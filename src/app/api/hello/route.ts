import { NextResponse } from 'next/server';
import { filterMessage } from '../../../utils/backend/filter-message'
import axios from 'axios';

export async function GET() {

  // await filterMessage("")

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "given this photo, find me 1. who sent the tweet, the username starting with @ 2. how many reposts, likes 3. the time it was sent 4. the text of the tweet"
          },
          {
            type: "image_url",
            image_url: {
              url: "https://internal-assets-bucket-dev.s3.amazonaws.com/cleanss.png"
            }
          }
        ]
      }
    ],
    max_tokens: 300
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  console.log(response.data.choices);

  

  return NextResponse.json({ message: 'Hello from the API!' });
}

