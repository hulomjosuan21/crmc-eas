# src/services/file_service.py

import os
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException, status

from src.core.config import settings

UPLOAD_ROOT = Path(settings.FILES_STORAGE_PATH)

class FileService:
    @staticmethod
    async def upload_file(file: UploadFile, folder_name: str) -> str:
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File name is missing."
            )

        sanitized_folder = folder_name.strip('/').replace('..', '_')

        subfolder_path = UPLOAD_ROOT / sanitized_folder

        os.makedirs(subfolder_path, exist_ok=True)

        file_path = subfolder_path / file.filename

        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)  # type: ignore[arg-type]

            public_url = f"{settings.FILES_STATIC_URL}/{sanitized_folder}/{file.filename}"

            return public_url

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving file: {e}"
            )
        finally:
            await file.close()


    @staticmethod
    def delete_file_by_url(public_url: str) -> tuple[str, str]:
        static_prefix = settings.FILES_STATIC_URL

        if not public_url.startswith(static_prefix):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"URL must start with the static prefix: {static_prefix}"
            )

        path_suffix = public_url[len(static_prefix):].lstrip('/')

        try:
            parts = Path(path_suffix).parts
            if len(parts) < 2:
                folder_name = ""
                filename = parts[0]
            else:
                folder_name = parts[0]
                filename = '/'.join(parts[1:])
        except IndexError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid URL format provided."
            )

        file_path = UPLOAD_ROOT / folder_name / filename

        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File not found at: {file_path.resolve()}"
            )

        try:
            os.remove(file_path)
            return filename, folder_name
        except OSError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not delete file: {e}"
            )