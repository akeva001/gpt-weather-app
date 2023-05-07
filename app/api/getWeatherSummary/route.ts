import { NextResponse } from "next/server";
import openai from "@/openai";

export async function POST(request: Request) {
  // weatherdata in the body of the POST req
  const { weatherData } = await request.json();

  console.log("WEATHERDATA");
  console.log(JSON.stringify(weatherData));

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `Pretend you're a weather news reporter, reporting LIVE on TV. Be energetic and full of charisma. Introduce yourself as Alex say you are LIVE from the Kevakian Headquarters. State the city you are providing a summary for. Then give a summary of todays weather only. Make it easy for the viewer to understand and know what to do to prepare for thos weather conditions such as bringing an umbrella if it is raining etc. Use the uv_index data provided to provide UV advice. Provide a joke regarding the weather. Assume the data cam from your team at the news office and not the user.`,
      },
      {
        role: "user",
        content: `Hi there, can i get a summary of todays weather, use the following information to get the weather
        data: ${JSON.stringify(weatherData)}`,
      },
    ],
  });
  const { data } = response;

  return NextResponse.json(data.choices[0].message);
}
