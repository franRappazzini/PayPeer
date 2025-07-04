import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("home");

  return (
    <main>
      <h1>{t("title")}</h1>

      <p>{t("greeting")}</p>
    </main>
  );
};

export default Home;
