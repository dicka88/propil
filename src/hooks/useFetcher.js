import { useState } from 'react';

export const useFetcher = (callback) => {
  const [data, setData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const start = () => {
    setIsLoading(true);
    callback().then((res) => {
      setIsLoading(false);
      setData(res);
    }).catch(() => {
      setIsError(true);
    });
  };

  const refetch = () => {
    start();
  };

  start();

  return {
    isLoading,
    data,
    isError,
    refetch,
  };
};

export const useMutate = (callback, { onSuccess, onFailed, onFinally }) => {
  const [data, setData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = (body) => {
    setIsLoading(true);
    callback(body).then((res) => {
      setData(res);
      onSuccess(res);
    }).catch(() => {
      setIsError(true);
      onFailed();
    }).finally(() => {
      setIsLoading(false);
      if (typeof onFinally === 'function') {
        onFinally();
      }
    });
  };

  return {
    isLoading,
    data,
    isError,
    mutate,
  };
};
