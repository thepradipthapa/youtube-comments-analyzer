# YouTube Comments Analyzer

Analyze and categorize YouTube video comments into **Suggestions, Questions, Feedback and more** using AI.


## 🚀 How It Works

1. **Frontend** posts a YouTube video URL to `POST /analyze`.  
2. **Backend** extracts the `videoId` and starts a background job that:  
   - Fetches comments from the YouTube Data API  
   - Calls the AI model to classify comments  
   - Stores task state/results in Redis under the `task_id`  
3. **Frontend** polls `GET /status/{task_id}` to show progress and display categorized results.



## ✨ Features
- Categorizes comments into helpful groups (Thanks, Questions, Feedback, etc.)
- Provides reasoning for each classification
- Stores analysis results in Redis for fast retrieval
- Background job processing for scalability


## 🛠️ Tech Stack
- **Frontend**: React + TypeScript  
- **Backend**: FastAPI + Pydantic AI  
- **Database**: Redis (Dockerized)  


## 📦 Installation

### Prerequisites
- Python 3.x installed
- Docker installed
- `uv` installed for dependency management and Virtual environment

```bash
git clone https://github.com/thepradipthapa/youtube-comments-analyzer.git
cd youtube-comments-analyzer 
```
### Redis Setup 
```bash 
# Terminal -> 1
Docker compose up
```

### Frontend Setup 
```bash
# Terminal -> 2
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
# Terminal -> 3
cd backend
uv sync
uv fastapi run dev
```
# Contribute
Feel free to improve this project. If you have awesome ideas on your mind, please don't hesitate to open a pull request.


# Thanks
Thank you for using checking this project. If you like this  project don't forget give it a ⭐, it motivates me 😄.
