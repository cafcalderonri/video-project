import os
import urllib.parse
from flask import Flask, abort, jsonify, render_template, request, send_from_directory, Response

app = Flask(__name__, template_folder="templates", static_folder="static")

# Registrar la carpeta logo/ como archivos estáticos bajo /static/logo/
LOGO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logo")


@app.route("/static/logo/<path:filename>")
def serve_logo(filename):
    return send_from_directory(LOGO_DIR, filename)


VIDEOS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "videos")


@app.route("/api/videos")
def list_videos():
    if not os.path.isdir(VIDEOS_DIR):
        return jsonify([])

    videos = []
    for filename in os.listdir(VIDEOS_DIR):
        if filename.lower().endswith(".mp4"):
            name = filename[:-4]  # nombre sin extensión
            videos.append({
                "name": name,
                "filename": urllib.parse.quote(filename),
            })
    return jsonify(videos)


@app.route("/videos/<path:filename>")
def serve_video(filename):
    real_name = urllib.parse.unquote(filename)
    file_path = os.path.join(VIDEOS_DIR, real_name)

    if not os.path.isfile(file_path):
        abort(404)

    file_size = os.path.getsize(file_path)
    range_header = request.headers.get("Range")

    if not range_header:
        # Servir el archivo completo con 200
        with open(file_path, "rb") as f:
            data = f.read()
        return Response(
            data,
            status=200,
            mimetype="video/mp4",
            headers={"Content-Length": str(file_size)},
        )

    # Parsear el header Range: bytes=start-end
    range_value = range_header.replace("bytes=", "").strip()
    parts = range_value.split("-")
    start = int(parts[0])
    end = int(parts[1]) if parts[1] else file_size - 1

    # Asegurarse de que end no supera el tamaño real
    end = min(end, file_size - 1)
    chunk_size = end - start + 1

    with open(file_path, "rb") as f:
        f.seek(start)
        data = f.read(chunk_size)

    return Response(
        data,
        status=206,
        mimetype="video/mp4",
        headers={
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(chunk_size),
        },
    )


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
