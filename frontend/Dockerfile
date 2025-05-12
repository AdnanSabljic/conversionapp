# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install pip and upgrade it
RUN pip install --upgrade pip

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Verify file structure
RUN ls -R /app

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Create a directory for logs
RUN mkdir -p /app/logs

# Use gunicorn to run the application with additional logging
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--access-logfile", "/app/logs/gunicorn-access.log", "--error-logfile", "/app/logs/gunicorn-error.log", "--capture-output", "--log-level", "debug", "app:app"]