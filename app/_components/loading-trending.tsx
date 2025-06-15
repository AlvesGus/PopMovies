export const LoadingTrending = () => {
    return (
      <div className="flex flex-col justify-center items-center gap-4 mt-40">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-action-500 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-action-500 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-action-500 animate-bounce [animation-delay:.7s]"></div>
        </div>
        <h2 className="text-3xl text-center">
        Estamos procurando os melhores filme da semana!
        </h2>
      </div>
    );
  };
  