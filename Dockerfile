FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Asegurar que el directorio de videos existe aunque el volumen esté vacío
RUN mkdir -p /app/videos

EXPOSE 5000

CMD ["python", "app.py"]
