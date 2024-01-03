"use client";

import { Input, Select, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MovieList } from "../sections";

type Movie = {
  id: number;
  original_title: string;
  genres: string;
  overview: string;
};

type Props = {};

export const Home: React.FC<Props> = () => {
  const [value, setValue] = useState("");
  const [model, setModel] = useState("1");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("keyword") || "";
  const options = [
    {
      value: "1",
      label: "Universal Sentence Encoder",
    },
    {
      value: "2",
      label: "Custom Model",
    },
  ];

  useEffect(() => {
    setValue(keyword);
  }, [keyword]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const useEndpoint = "http://127.0.0.1:5000/api/recommend/use";
      const bertEndpoint = "http://127.0.0.1:5000/api/recommend/bert";
      const selectedEndpoint = model === "1" ? useEndpoint : bertEndpoint;
      const response = await fetch(selectedEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });
      const data = await response.json();
      console.log("data", data);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [value, model]);

  useEffect(() => {
    if (value) {
      fetchData();
    }
  }, [value, fetchData]);

  const Search = useCallback(() => {
    router.push(`/?keyword=${value}`);
    fetchData();
  }, [value, fetchData]);

  return (
    <div className="mt-[108px] mb-[10px]">
      <div className="container max-w-[1100px]">
        <h1 className="text-primary text-5xl font-black mb-0 text-center">
          Similar Movie
        </h1>
        <div className="flex justify-center items-center p-4 gap-2">
          <span>Select Model:</span>
          <Select
            placeholder="Select Model"
            options={options}
            defaultValue={"1"}
            onChange={(value: any) => {
              console.log(value);
              setModel(value);
            }}
          />
        </div>
        <div className="flex justify-center items-center p-4">
          <Input
            className="rounded-[5px] py-[18px] px-[28px] search"
            placeholder="Enter whatever you like"
            style={{ width: "430px" }}
            size="large"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPressEnter={() => {
              Search();
            }}
            suffix={<SearchOutlined />}
          />
        </div>

        {loading && <Spin tip="Loading..." />}

        {recommendations.length > 0 && (
          <MovieList recommendations={recommendations} />
        )}
      </div>
    </div>
  );
};
