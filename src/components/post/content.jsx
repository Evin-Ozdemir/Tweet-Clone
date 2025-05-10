const Content = ({ data }) => {
  return (
    <div className="my-2">
      {data.text && <p>{typeof data.text === "string" ? data.text : " "}</p>}
      {typeof data.image === "string" && (
        <img
          src={data.image}
          className="rounded-xl my-2"
          alt="Gönderi görseli"
        />
      )}
    </div>
  );
};

export default Content;
