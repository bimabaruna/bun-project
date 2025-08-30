import axios from "axios";

export async function uploadImage(file: File, token: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        "/api/upload-url",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token || "",
            },
        }
    );

    return response.data.imageUrl;
}