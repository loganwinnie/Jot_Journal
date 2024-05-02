# Jot Journal

Jot Journal is a Ai powered journaling web application that uses the open ai api to
create prompts based on the users previous writing.

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fjotjournal.netlify.app%2F&up_message=Live&up_color=%23169d7d&down_message=Offline&down_color=grey&style=for-the-badge&label=Jot%20Journal)](https://jotjournal.netlify.app/)

## Why I created Jot Journal

I create Jot Journal to promote deeper thinking while journaling. As someone who tries
to write down some of my thoughts everyday, I often run into roadblocks where I am unsure what to write next.

Thats where the prompts came into play. I asked myself what if I could leverage AI to create prompts based on my previous writing to inspire me to write more. Using prompt engineering and much trial and error I was able to create just that. A journal that promotes healthy deeper thought and that inspires users to write more.

## Created with

![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)  
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Postgresql](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Cloning and running locally

#### To run locally and generate prompts it will require an OpenAi user api key. **Currently OpenAI does not offer a free tier, so payment will be required.**

### Backend

1. Navigate to the [OpenAi api dashboard](https://platform.openai.com/settings/profile?tab=api-keys), login or signup and retrieve a project api key.

2. Clone the repo

   ```
   git clone https://github.com/loganwinnier/aijournal.git
   ```

3. Navigate into /backend directory and create and activate a virtual enviorment.
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```
4. Install packages
   ```
   pip install -r requirements.txt
   ```
5. Generate a fernet key

   ```
   python3 fernet_gen.py
   ```

6. Create and config .env

   ```
    OPEN_AI_KEY= **YOUR API KEY HERE**
    OPEN_AI_MODEL=gpt-3.5-turbo-0125
    ENCRYPT_KEY= **YOUR FERNET KEY HERE**
   ```

   #### Extra Keys for Deployment

   - **JWT_SECRET_KEY**: A secret key for encoding JWT tokens
   - **HASH_ALGORITHM**: Algorithm for password hashing _default HS256_
   - **ACCESS_TOKEN_TIME**: Expiration time for tokens in minutes _default 10080_
   - **OPEN_AI_REQUEST_PER_HOUR**: Request per hour for each user _default 20_
   - **ALLOWED_ORIGIN**: Allowed request origins _default all (\*)_
   - **DATABASE_URL**: Database url _default_ "postgresql:///jot_journal"

7. Start backend development server

### Frontend

1. Navigate to the /frontend directory in a new terminal window.
2. Install packages

   ```
   npm install
   ```

3. Start development server.
   ```
   npm run dev
   ```

## Running tests

### Backend

Navigate into the backend folder and simply run the command below.

```
python -m pytest tests/
```

### Frontend

WIP

## Contact and find me

[![Linked-in](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/logan-winnie-r/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:loganwinnier@gmail.com)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/loganwinnier/)
