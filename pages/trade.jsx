import Head from "next/head";
import dynamic from "next/dynamic";
import SyntheticModelDropdown from "../components/SyntheticModelDropdown";
import { React, useState, useEffect } from "react";
import { syntheticModelOptions } from "../lib/options";
import SideMenu from "../components/SideMenu";
import { SkeletonLoaderTradePage } from "../components/SkeletonLoaders";
import "../styles/trade.module.css";
import SingleActionModal from "../components/SingleActionModal";
import { OutlineCheckIcon, ExclamationTriangleIcon } from "../lib/icons";
import { useRouter } from "next/router";

const Chart = dynamic(() => import("../components/Chart.mjs"), {
  ssr: false,
});

const EventSource = require("eventsource");

var data = "";

const eventSourceUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://pricing.syntrade.xyz";

const sse = new EventSource(eventSourceUrl);
sse.onmessage = async (e) => {
  try {
    data = JSON.parse(e.data);
  } catch (error) {}
};

sse.onerror = (e) => {};

const Trade = () => {
  const [syntheticModel, setSyntheticModel] = useState(
    syntheticModelOptions[0]
  );
  const [openTradeSuccessModal, setOpenTradeSuccessModal] = useState(false);
  const [openLogInNeededModal, setOpenLogInNeededModal] = useState(false);
  const [openTradeErrorModal, setOpenTradeErrorModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoader(true);

    setTimeout(async () => {
      setLoader(false);
    }, 1000);
  }, [syntheticModel]);

  return (
    <>
      <Head>
        <title>Trade | Syntrade</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        {loader ? (
          <>
            <SkeletonLoaderTradePage />
            <div className="block lg:hidden xl:hidden 2xl:hidden sm:block min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:block md:place-items-center">
              <div className="mx-auto max-w-max">
                <div className="animate-pulse w-24 h-24 mx-auto bg-gray-300 border-gray-300 rounded"></div>
                <div className="mt-8">
                  <div className="mx-auto animate-pulse mt-8 py-2 px-4 h-8 w-80 bg-gray-300 rounded border-4 border-gray-300 focus:outline-none cursor-default select-none" />
                  <div className=" mx-auto animate-pulse mt-8 py-2 px-4 h-6 w-96 bg-gray-300 rounded border-4 border-gray-300 focus:outline-none cursor-default select-none" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="block lg:hidden xl:hidden 2xl:hidden sm:block min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:block md:place-items-center">
              <div className="mx-auto max-w-max">
                <ExclamationTriangleIcon
                  fill="#f87171"
                  className="w-24 h-24 mx-auto"
                  aria-hidden="true"
                />
                <div className="mt-8 mx-auto">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl text-center">
                    Unsupported Screen Size
                  </h1>
                  <p className="mt-4 text-base text-gray-500">
                    {
                      "We're currently not supporting trading in small screen sizes."
                    }
                  </p>
                </div>
              </div>
            </div>
            <div
              id="trade-page"
              className="hidden h-screen lg:block sm:hidden md:hidden xl:block 2xl:block"
            >
              <SingleActionModal
                id="modal-trade-success"
                openModal={openTradeSuccessModal}
                setOpenModal={setOpenTradeSuccessModal}
                modalTitle="Trade successful"
                modalDescription="You just performed a trade!"
                modalIcon={
                  <OutlineCheckIcon
                    fill="#4ade80"
                    className="w-12 h-12"
                    aria-hidden="true"
                  />
                }
              />
              <SingleActionModal
                id="modal-log-in-needed"
                openModal={openLogInNeededModal}
                setOpenModal={setOpenLogInNeededModal}
                modalTitle="Log in needed"
                modalDescription="You need to log in to start trading"
                modalIcon={
                  <ExclamationTriangleIcon
                    fill="#f87171"
                    className="w-12 h-12"
                    aria-hidden="true"
                  />
                }
              />
              <SingleActionModal
                id="modal-trade-error"
                openModal={openTradeErrorModal}
                setOpenModal={setOpenTradeErrorModal}
                modalTitle="Trade error"
                modalDescription="You don't have enough balance in wallet. Please reset balance."
                modalIcon={
                  <ExclamationTriangleIcon
                    fill="#f87171"
                    className="w-12 h-12"
                    aria-hidden="true"
                  />
                }
              />
              <SyntheticModelDropdown
                syntheticModel={syntheticModel}
                setSyntheticModel={setSyntheticModel}
              ></SyntheticModelDropdown>
              <Chart stream={sse} syntheticModel={syntheticModel.type} />
              <SideMenu
                syntheticModel={syntheticModel}
                setOpenTradeSuccessModal={setOpenTradeSuccessModal}
                setOpenLogInNeededModal={setOpenLogInNeededModal}
                setOpenTradeErrorModal={setOpenTradeErrorModal}
              ></SideMenu>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Trade;
