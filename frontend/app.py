from flask import Flask, render_template, request, jsonify
import requests
import os
import sys
import traceback
import logging

# Configure detailed logging
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.StreamHandler(sys.stdout),
                        logging.FileHandler('/app/flask-debug.log')
                    ])
logger = logging.getLogger(__name__)

# Explicitly set the template and static folders
template_dir = os.path.abspath('/app/templates')
static_dir = os.path.abspath('/app/static')
app = Flask(__name__, 
            template_folder=template_dir, 
            static_folder=static_dir)
app.config['DEBUG'] = True

# Get backend URL from environment variable or use default
BACKEND_URL = os.environ.get('BACKEND_URL', 'http://localhost:3000')
logger.info(f"Backend URL: {BACKEND_URL}")
logger.info(f"Template Directory: {template_dir}")
logger.info(f"Static Directory: {static_dir}")
logger.info(f"Templates: {os.listdir(template_dir)}")
logger.info(f"Static files: {os.listdir(static_dir)}")

@app.route('/')
def index():
    try:
        logger.info("Rendering index page")
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Error rendering index page: {e}")
        logger.error(traceback.format_exc())
        return f"Error rendering page: {e}", 500

@app.route('/convert', methods=['POST'])
def convert():
    try:
        data = request.get_json()
        logger.info(f"Conversion request received: {data}")
        
        conversion_type = data.get('type')
        value = data.get('value')
        from_unit = data.get('fromUnit')
        to_unit = data.get('toUnit')
        
        # Forward the request to the appropriate backend endpoint
        try:
            logger.info(f"Sending request to {BACKEND_URL}/api/{conversion_type}")
            response = requests.post(
                f"{BACKEND_URL}/api/{conversion_type}",
                json={'value': float(value), 'fromUnit': from_unit, 'toUnit': to_unit},
                timeout=10  # Add a timeout
            )
            response.raise_for_status()
            return jsonify(response.json())
        except requests.exceptions.RequestException as e:
            logger.error(f"Backend service error: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({'error': f"Backend service error: {str(e)}"}), 500
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

@app.route('/health')
def health_check():
    return jsonify({'status': 'UP'})

# Additional error handling
@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}")
    logger.error(traceback.format_exc())
    return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Startup logging
if __name__ == '__main__':
    logger.info("Starting Flask application")
    print("Logging started", file=sys.stderr)
    app.run(host='0.0.0.0', port=5000, debug=True)