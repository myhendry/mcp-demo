from dataclasses import dataclass
import os
from colorama import Fore
from fastapi import APIRouter
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider

router = APIRouter()

@dataclass
class Movie:
    title: str
    year: int
    rating: float
    description: str
    cast: list[str]

def get_model(model_name: str):
    try:
        model = OpenAIModel(model_name=model_name, provider=OpenAIProvider(api_key=os.getenv("OPENAI_API_KEY")))
    except Exception as e:
        print(Fore.RED + f"Error getting model {model_name}: {e}")
        model = None
    return model

@router.get('/')
async def get_agent(q: str | None = None) -> Movie:
    if not q:
        return {"message": "Query or Model Name is missing"}
    try:
        model_name = "gpt-4o-mini"
        system_prompt = "You are a helpful assistant."
        agent = Agent(model=get_model(model_name), system_prompt=system_prompt, result_type=Movie)
        result = await agent.run(q)
        return result.data
    except Exception as e:
        return {"message": str(e)}

# * Local
# def main_loop():
#     system_prompt = "You are a helpful assistant."
#     agent = Agent(model=get_model("gpt-4o-mini"), system_prompt=system_prompt, result_type=Movie)
#     while True:
#         user_input = input("Enter a movie title: ")
#         if user_input == "exit":
#             break
#         result = agent.run_sync(user_input)
#         print(result)

# if __name__ == "__main__":
#     main_loop()