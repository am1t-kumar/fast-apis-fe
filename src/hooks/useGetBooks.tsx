import { useEffect, useState } from "react";

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

const baseUrl = "http://127.0.0.1:8000/books";

const useGetBooks = (refresh: boolean) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(baseUrl);
      const data = await response.json();
      setBooks(data.books);
      setLoading(false);
    };

    fetchBooks();
  }, [refresh]);

  return {
    books,
    loading,
  };
};

export default useGetBooks;
