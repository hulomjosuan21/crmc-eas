import os
from src.core.config import settings

def delete_department_image(mapper, connection, target):
    if target.department_image:
        image_path = target.department_image
        if image_path.startswith(settings.FILES_STATIC_URL):
            relative_path = image_path.replace(settings.FILES_STATIC_URL, "", 1)
            relative_path = relative_path.lstrip("/")
            full_path = os.path.join(os.getcwd(), settings.FILES_STORAGE_PATH, relative_path)
            if os.path.exists(full_path):
                try:
                    os.remove(full_path)
                except OSError as e:
                    print(f"Error deleting file {full_path}: {e}")

                uuid_directory = os.path.dirname(full_path)

                if os.path.exists(uuid_directory) and not os.listdir(uuid_directory):
                    try:
                        os.rmdir(uuid_directory)
                    except OSError as e:
                        print(f"Error removing directory {uuid_directory}: {e}")
            else:
                print(f"File not found on disk: {full_path}")