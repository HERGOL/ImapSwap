from flask import Flask, request, jsonify
import imaplib
import logging
from threading import Thread
from flask_cors import CORS
import socket

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)

CORS(app, origins="*")

# Structure to track task progress
tasks_progress = {}


def check_connection(host, email_address, password):
    """
    Verifies the connection to an IMAP server and returns the connection.
    If no response is received within 60 seconds, the connection is considered failed.
    """
    try:
        socket.setdefaulttimeout(60)
        connection = imaplib.IMAP4_SSL(host)
        connection.login(email_address, password)
        logging.info(f"Successfully connected to {host} for {email_address}")
        return connection
    except socket.timeout:
        error_msg = f"Connection to {host} for {email_address} timed out after 60 seconds."
        logging.error(error_msg)
        return None
    except imaplib.IMAP4.error as e:
        # Capture the specific IMAP error message
        error_msg = f"Authentication error to {host} for {email_address}: {str(e)}"
        logging.error(error_msg)
        return None
    except Exception as e:
        error_msg = f"Connection error to {host} for {email_address}: {str(e)}"
        logging.error(error_msg)
        return None


def list_folders(connection):
    """
    Retrieves available folders from the IMAP server.
    """
    try:
        status, folders = connection.list()
        if status != "OK":
            logging.error("Unable to retrieve folders.")
            return []
        logging.info("Available folders: " + ", ".join([folder.decode() for folder in folders]))
        return folders
    except Exception as e:
        logging.error(f"Error while retrieving folders: {e}")
        return []


def transfer_emails(task_id, source_host, source_email, source_password, dest_host, dest_email, dest_password):
    """
    Transfers all emails from the source mailbox to the destination mailbox,
    avoiding duplicate transfers.
    """
    try:
        tasks_progress[task_id] = {"status": "In progress", "current": 0, "total": 0, "error": None}
        logging.info(f"Starting email transfer (task_id: {task_id})")

        # Connect to IMAP servers
        source = check_connection(source_host, source_email, source_password)
        if not source:
            error_msg = f"Unable to connect to the source server ({source_host}). Check host, email, and password."
            tasks_progress[task_id]["status"] = "Failed"
            tasks_progress[task_id]["error"] = error_msg
            return

        dest = check_connection(dest_host, dest_email, dest_password)
        if not dest:
            error_msg = f"Unable to connect to the destination server ({dest_host}). Check host, email, and password."
            tasks_progress[task_id]["status"] = "Failed"
            tasks_progress[task_id]["error"] = error_msg
            return

        # Select "INBOX" folder on the source server
        source.select("INBOX")
        status, messages = source.search(None, "ALL")
        if status != "OK":
            tasks_progress[task_id]["status"] = "Failed"
            tasks_progress[task_id]["error"] = "Unable to retrieve emails from the source mailbox."
            return

        email_ids = messages[0].split()
        total_emails = len(email_ids)
        tasks_progress[task_id]["total"] = total_emails
        logging.info(f"Total number of emails to transfer: {total_emails}")

        if total_emails == 0:
            tasks_progress[task_id]["status"] = "Completed"
            tasks_progress[task_id]["error"] = "No emails to transfer."
            logging.info("No emails to transfer.")
            return

        # Track transferred message IDs to prevent duplicates
        transferred_message_ids = set()

        # Transfer emails
        for index, email_id in enumerate(email_ids, start=1):
            try:
                # Fetch raw email from the source server
                logging.info(f"Fetching email ID {email_id.decode()}...")
                status, msg_data = source.fetch(email_id, "(BODY[HEADER.FIELDS (MESSAGE-ID)])")
                if status != "OK":
                    logging.warning(f"Error fetching email ID {email_id.decode()} headers.")
                    continue

                # Extract Message-ID to check for duplicates
                message_id = None
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        try:
                            message_id_header = response_part[1].decode().strip()
                            message_id_match = re.search(r'Message-ID:\s*<(.+)>', message_id_header, re.IGNORECASE)
                            if message_id_match:
                                message_id = message_id_match.group(1)
                        except Exception as header_error:
                            logging.warning(f"Error parsing Message-ID: {header_error}")

                # Skip if Message-ID is already transferred
                if message_id and message_id in transferred_message_ids:
                    logging.info(f"Skipping duplicate email with Message-ID: {message_id}")
                    continue

                # Fetch full email
                status, full_msg_data = source.fetch(email_id, "(RFC822)")
                if status != "OK":
                    logging.warning(f"Error fetching full email ID {email_id.decode()}.")
                    continue

                raw_email = full_msg_data[0][1]

                # Append email to the destination server
                status, append_response = dest.append("INBOX", None, None, raw_email)
                if status != "OK":
                    logging.warning(f"Error appending email ID {email_id.decode()} to the destination server.")
                else:
                    logging.info(f"[{index}/{total_emails}] Email ID {email_id.decode()} successfully transferred.")

                    # Add Message-ID to transferred set if available
                    if message_id:
                        transferred_message_ids.add(message_id)

                tasks_progress[task_id]["current"] = index
                logging.info(f"Task progress: {index}/{total_emails} emails transferred.")

            except Exception as email_error:
                logging.error(f"Error processing email ID {email_id.decode()}: {email_error}")

        tasks_progress[task_id]["status"] = "Completed"
        logging.info("Email transfer successfully completed.")

    except Exception as e:
        logging.error(f"Error during email transfer: {e}")
        tasks_progress[task_id]["status"] = "Failed"
        tasks_progress[task_id]["error"] = str(e)

    finally:
        try:
            if source:
                try:
                    source.close()
                except imaplib.IMAP4.error as e:
                    logging.warning(f"Error closing the source folder: {e}")
                source.logout()
            if dest:
                try:
                    dest.close()
                except imaplib.IMAP4.error as e:
                    logging.warning(f"Error closing the destination folder: {e}")
                dest.logout()
        except Exception as e:
            logging.warning(f"Error closing connections: {e}")


@app.route('/start_transfer', methods=['POST'])
def start_transfer():
    """
    Starts the email transfer process.
    """
    data = request.json
    required_fields = [
        "source_host", "source_email", "source_password",
        "dest_host", "dest_email", "dest_password"
    ]

    # Check that all required fields are provided
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "All required fields are not provided."}), 400

    # Generate a unique ID for the task
    task_id = f"task-{len(tasks_progress) + 1}"
    tasks_progress[task_id] = {"status": "Initializing", "current": 0, "total": 0, "error": None}

    # Start the transfer in a separate thread
    thread = Thread(target=transfer_emails, kwargs={
        "task_id": task_id,
        "source_host": data["source_host"],
        "source_email": data["source_email"],
        "source_password": data["source_password"],
        "dest_host": data["dest_host"],
        "dest_email": data["dest_email"],
        "dest_password": data["dest_password"]
    })
    thread.start()

    return jsonify({"task_id": task_id}), 200


@app.route('/progress/<task_id>', methods=['GET'])
def get_progress(task_id):
    progress = tasks_progress.get(task_id)
    if not progress:
        return jsonify({"error": "Task not found."}), 404
    return jsonify(progress)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
