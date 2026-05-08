# 1. 기반 시스템 선택 (파이썬이 깔린 가벼운 리눅스)
FROM python:3.9-slim

# 2. 작업 공간 만들기 (컨테이너 안의 폴더)
WORKDIR /app

# 3. 필수 라이브러리 설치 (통역사들 설치)
RUN pip install fastapi uvicorn sqlalchemy psycopg2-binary

# 4. 코드 복사 (내 컴퓨터 -> 컨테이너 안으로)
COPY . .

# 5. 서버 실행 명령 (컨테이너가 켜지자마자 실행할 일)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]