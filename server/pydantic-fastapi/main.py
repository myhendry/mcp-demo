from dataclasses import dataclass
import os
from typing import Union
from colorama import Fore
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from openai import OpenAI
from pydantic_ai import Agent
from pydantic_fastapi.routers.fastapi_vercelai import fast
from pydantic_fastapi.routers.fastapi_vercelai.utils.prompt import convert_to_openai_messages
from pydantic_fastapi.routers.fastapi_vercelai.fast import stream_text, Request
from pydantic_fastapi.routers.pydantic_agent import movie_agent

load_dotenv(".env")

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError(Fore.RED + "OPENAI_API_KEY is missing!")

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


app.include_router(fast.router, prefix="/api/v1/chat")
app.include_router(movie_agent.router, prefix="/api/v1/movie")
