import axios from "axios";

export async function uploadImage(file: File, token: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        "http://localhost:3000/api/upload-url",
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