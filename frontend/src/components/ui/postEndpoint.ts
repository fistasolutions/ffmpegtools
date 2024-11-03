"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

const PostHandler = async (backendUrl: string, formData: FormData) => {
  try {
    const response = await axios.post(`http://localhost:5000/${backendUrl}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Error fetching data from the server"
      );
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const usePostHandler = (backendUrl: string, formData: FormData | null) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!formData) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await PostHandler(backendUrl, formData);
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [backendUrl, formData]);

  return { data, error, isLoading };
};
